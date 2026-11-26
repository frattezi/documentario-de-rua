import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Channel from "../src/components/Channel.astro";
import { feature, shorts, socialCards } from "../src/content/channel";

const live = readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8");

function section(html: string): HTMLElement {
  const el = parse(html).querySelector("section#canal");
  if (!el) throw new Error("section#canal not found");
  return el;
}

const text = (el: HTMLElement): string => el.textContent.replace(/\s+/g, " ").trim();
const attrs = (el: HTMLElement, name: string): string[] =>
  el.querySelectorAll(`[${name}]`).map((e) => e.getAttribute(name) ?? "");
/**
 * Markup for a structural comparison. Astro renders an empty attribute as `alt` where the live
 * build has `alt=""`; HTML treats both the same.
 */
const markup = (el: HTMLElement): string => el.outerHTML.replace(/ alt(?=[ >])/g, ' alt=""');

describe("channel section", () => {
  let built: HTMLElement;
  const reference = section(live);

  beforeAll(async () => {
    const container = await AstroContainer.create({
      // As in astro.config.mjs, so the whitespace between tags is what the build emits.
      astroConfig: { compressHTML: true },
    });
    built = section(await container.renderToString(Channel));
  });

  it("uses the live heading and id", () => {
    expect(built.getAttribute("id")).toBe("canal");
    expect(text(built.querySelector("#canal-h")!)).toBe("Mais histórias da rua");
    expect(built.getAttribute("aria-labelledby")).toBe(reference.getAttribute("aria-labelledby"));
  });

  it("has the live page's visible text", () => {
    expect(text(built)).toBe(text(reference));
  });

  it("has every href and src of the live page", () => {
    expect(attrs(built, "href")).toEqual(attrs(reference, "href"));
    expect(attrs(built, "src")).toEqual(attrs(reference, "src"));
    expect(attrs(built, "alt")).toEqual(attrs(reference, "alt"));
  });

  it("links the call to subscribe to the channel with sub_confirmation", () => {
    const subscribe = built.querySelector(".social--yt");
    expect(subscribe?.getAttribute("href")).toBe(
      "https://www.youtube.com/@guilhermesimoesdias?sub_confirmation=1",
    );
    expect(text(subscribe!.querySelector(".act")!)).toBe("Inscrever-se");
  });

  it("matches the live markup", () => {
    expect(markup(built)).toBe(markup(reference));
  });

  it("renders one card per data entry", () => {
    expect(built.querySelectorAll(".feature")).toHaveLength(1);
    expect(built.querySelector(".feature img")?.getAttribute("src")).toBe(feature.thumbnail);
    expect(built.querySelectorAll(".short")).toHaveLength(shorts.length);
    expect(built.querySelectorAll(".social")).toHaveLength(socialCards.length);
  });
});
