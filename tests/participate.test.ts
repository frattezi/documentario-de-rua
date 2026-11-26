// The participation section: the three calls to action, the PIX card inside it, and the states
// that must never look real while the facts behind them are missing.
//
// The PIX card itself is the live build's card, unchanged — only the ask around it is new
// (Spec 0002). The card's markup is compared with the live one to keep it so.
import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Participate from "../src/components/Participate.astro";
import { pixKey } from "../src/content/pix";
import { calls, formPendingReason } from "../src/content/participate";
import { site } from "../src/content/site";

const live = parse(readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8"));

const text = (el: HTMLElement): string => {
  const copy = parse(el.outerHTML);
  copy.querySelectorAll("svg,script,style").forEach((e) => e.remove());
  return copy.textContent.replace(/\s+/g, " ").trim();
};

/** Markup without the attributes and bootstrap Astro generates for an island. */
const markup = (el: HTMLElement): string =>
  el.outerHTML
    .replace(/<style>astro-island.*?<\/style>/s, "")
    .replace(/<script>.*?<\/script>/gs, "")
    .replace(/<astro-island[^>]*>/, "<astro-island>");

describe("the participation section", () => {
  let built: HTMLElement;

  beforeAll(async () => {
    const container = await AstroContainer.create({
      astroConfig: { compressHTML: true },
      renderers: await loadRenderers([reactRenderer()]),
    });
    built = parse(await container.renderToString(Participate));
  });

  it("holds the three calls, each at its own anchor", () => {
    expect(calls.map((c) => c.id)).toEqual(["ajude", "apoie", "faca-parte"]);
    for (const call of calls) {
      const article = built.querySelector(`#${call.id}`);
      expect(article, `#${call.id} is missing`).not.toBeNull();
      expect(article!.getAttribute("aria-labelledby")).toBe(`${call.id}-h`);
      expect(text(built.querySelector(`#${call.id}-h`)!)).toBe(call.heading);
    }
  });

  it("keeps #apoie inside the section, so the hero's PIX pill still lands on the card", () => {
    const section = built.querySelector("#participe")!;
    expect(section.querySelector("#apoie")).not.toBeNull();
  });

  it("renders the live build's PIX card, unchanged", () => {
    const card = (el: HTMLElement): string => markup(el.querySelector(".pixcard")!);
    expect(card(built)).toBe(card(live));
  });

  it("passes the configured key to the copy island, as the live page does", () => {
    const props = JSON.parse(built.querySelector("astro-island")!.getAttribute("props")!);
    expect(props).toEqual({ pixKey: [0, pixKey] });
    expect(props).toEqual(
      // The live page has two islands; this is the PIX one.
      JSON.parse(live.querySelector('astro-island[component-url*="PixCopy"]')!.getAttribute("props")!),
    );
  });

  it("has no PIX key, so the card reads a definir and its button is disabled", () => {
    expect(pixKey).toBeNull();
    expect(text(built.querySelector("#pixkey")!)).toBe("a definir");
    const button = built.querySelector("#apoie button.btn")!;
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(text(button)).toBe("Copiar chave");
  });

  it("has no form URLs, so each form button is disabled with its reason, never a dead link", () => {
    expect(site.forms.production).toBeNull();
    expect(site.forms.membership).toBeNull();
    for (const call of calls.filter((c) => c.kind === "form")) {
      const article = built.querySelector(`#${call.id}`)!;
      const button = article.querySelector("button.btn")!;
      expect(button.hasAttribute("disabled")).toBe(true);
      expect(text(button)).toBe(call.action);
      expect(text(article)).toContain(formPendingReason);
      expect(article.querySelector("a.btn")).toBeNull();
    }
  });

  it("says the copy is provisional while it is, so a draft never reads as a promise", () => {
    expect(site.participateCopyIsProvisional).toBe(true);
    const draft = built.querySelector(".draft");
    expect(draft).not.toBeNull();
    expect(draft!.getAttribute("role")).toBe("note");
  });
});
