import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Hero from "../src/components/Hero.astro";
import { filmVideo, heroCalls } from "../src/content/hero";
import { youtubeEmbedAllow, youtubeEmbedUrl } from "../src/lib/youtube";

const live = readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8");

function section(html: string): HTMLElement {
  const el = parse(html).querySelector("section.hero");
  if (!el) throw new Error("section.hero not found");
  return el;
}

/** Visible text: Astro's island bootstrap (`<style>`, `<script>`) is not part of it. */
function text(el: HTMLElement): string {
  const copy = parse(el.outerHTML);
  for (const hidden of copy.querySelectorAll("style, script")) hidden.remove();
  return copy.textContent.replace(/\s+/g, " ").trim();
}
const attrs = (el: HTMLElement, name: string): string[] =>
  el.querySelectorAll(`[${name}]`).map((e) => e.getAttribute(name) ?? "");
/**
 * Markup for a structural comparison. The island's bootstrap scripts and its generated
 * attributes (uid, hashed bundle URLs) belong to Astro, not to the page, so they are dropped.
 */
const markup = (el: HTMLElement): string =>
  el.outerHTML
    .replace(/<style>astro-island.*?<\/style>/s, "")
    .replace(/<script>.*?<\/script>/gs, "")
    .replace(/<astro-island[^>]*>/, "<astro-island>")
    .replace(/ alt(?=[ >])/g, ' alt=""');

describe("hero", () => {
  let built: HTMLElement;
  const reference = section(live);

  beforeAll(async () => {
    const container = await AstroContainer.create({
      // As in astro.config.mjs, so the whitespace between tags is what the build emits.
      astroConfig: { compressHTML: true },
      renderers: await loadRenderers([reactRenderer()]),
    });
    built = section(await container.renderToString(Hero));
  });

  it("has the live page's visible text", () => {
    expect(text(built)).toBe(
      "Entre a Lei e a RuaViaduto Angola · Av. Antônio Carlos · Belo Horizonte" +
        "Assista o documentário completo no YouTube29:43" +
        "Curta-metragem documental · 30 minBelo Horizonte, MG · Gravado em maio de 2025" +
        " Inscreva-se no canal Siga no InstagramDoe via PIX",
    );
    expect(text(built)).toBe(text(reference));
  });

  it("has every href, src and srcset of the live page", () => {
    expect(attrs(built, "href")).toEqual(attrs(reference, "href"));
    expect(attrs(built, "src")).toEqual(attrs(reference, "src"));
    expect(attrs(built, "srcset")).toEqual(attrs(reference, "srcset"));
    expect(attrs(built, "alt")).toEqual(attrs(reference, "alt"));
  });

  it("names the title as the live page does", () => {
    const h1 = built.querySelector("h1#t");
    expect(h1?.getAttribute("aria-label")).toBe("Entre a Lei e a Rua");
    expect(built.getAttribute("aria-labelledby")).toBe("t");
  });

  it("uses the square crop at 640px and below, the wide crop above", () => {
    const source = built.querySelector(".ov__photo source");
    expect(source?.getAttribute("media")).toBe("(max-width: 640px)");
    expect(source?.getAttribute("srcset")).toBe("/img/overpass-sq.jpg");
    expect(built.querySelector(".ov__photo img")?.getAttribute("src")).toBe("/img/overpass.jpg");
  });

  it("renders the player as a thumbnail button with the duration, and no iframe", () => {
    const button = built.querySelector("button.screen");
    expect(button?.getAttribute("aria-label")).toBe("Assistir Entre a Lei e a Rua (29:43)");
    expect(text(button!.querySelector(".dur")!)).toBe("29:43");
    expect(button?.querySelector("img")?.getAttribute("src")).toBe(filmVideo.thumbnail);
    expect(built.querySelector("iframe")).toBeNull();
    expect(built.toString()).not.toMatch(/youtube-nocookie|ytimg|googlevideo/);
  });

  it("hydrates the player only when visible, with the live props", () => {
    const island = built.querySelector("astro-island");
    expect(island?.getAttribute("client")).toBe("visible");
    expect(island?.getAttribute("props")).toBe(
      parse(live).querySelector("astro-island")?.getAttribute("props"),
    );
  });

  it("renders the three calls from data", () => {
    const pills = built.querySelectorAll(".cta .pill");
    expect(pills.map((p) => p.getAttribute("href"))).toEqual(heroCalls.map((c) => c.href));
    expect(pills.map(text)).toEqual(heroCalls.map((c) => c.label));
  });

  it("matches the live markup", () => {
    expect(markup(built)).toBe(markup(reference));
  });
});

describe("YouTube embed", () => {
  it("is the nocookie URL, autoplaying, without related videos", () => {
    expect(youtubeEmbedUrl("iLqNWQIXITs")).toBe(
      "https://www.youtube-nocookie.com/embed/iLqNWQIXITs?autoplay=1&rel=0",
    );
  });

  it("allows what the live player allows", () => {
    const livePlayer = readFileSync(
      new URL("../reference/live/_astro/YouTubePlayer.SbS_WuS8.js", import.meta.url),
      "utf8",
    );
    expect(livePlayer).toContain(`allow:\`${youtubeEmbedAllow}\``);
  });
});
