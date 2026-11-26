// Every section the page carries, compared with the same region of the live build: its visible
// text, its ids and every href and src. The live build is the target (Spec 0001) and is never
// edited to make this pass.
import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import Header from "../src/components/Header.astro";
import Support from "../src/components/Support.astro";
import Film from "../src/components/Film.astro";
import Voices from "../src/components/Voices.astro";
import Timeline from "../src/components/Timeline.astro";
import Law from "../src/components/Law.astro";
import Footer from "../src/components/Footer.astro";

const live = parse(readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8"));

/** Visible text, with runs of whitespace collapsed, as a reader would read it. */
const text = (el: HTMLElement): string => {
  const copy = parse(el.outerHTML);
  // Icons carry no text, and an island's inlined hydration script and style are not text either.
  copy.querySelectorAll("svg,script,style").forEach((e) => e.remove());
  return copy.textContent.replace(/\s+/g, " ").trim();
};

/** Every href and src in document order, ignoring the build's own hashed asset paths. */
const refs = (el: HTMLElement): string[] =>
  el
    .querySelectorAll("[href],[src]")
    .map((e) => e.getAttribute("href") ?? e.getAttribute("src") ?? "")
    .filter((v) => v !== "" && !v.startsWith("/_astro/"));

/** Every id in document order: a deep link that exists today must still exist. */
const ids = (el: HTMLElement): string[] =>
  el.querySelectorAll("[id]").map((e) => e.getAttribute("id") ?? "");

interface Section {
  name: string;
  component: AstroComponentFactory;
  /** The selectors that together make up this section in the live build. */
  selectors: string[];
}

const sections: Section[] = [
  { name: "header", component: Header, selectors: ["header"] },
  { name: "support", component: Support, selectors: ["section#apoie"] },
  { name: "film", component: Film, selectors: ["section#filme"] },
  { name: "voices and the wall", component: Voices, selectors: ["section#vozes", "figure.wall"] },
  { name: "timeline", component: Timeline, selectors: ["section#viaduto"] },
  { name: "law", component: Law, selectors: ["section#lei"] },
  { name: "footer", component: Footer, selectors: ["footer"] },
];

describe.each(sections)("$name", ({ component, selectors }) => {
  let built: HTMLElement;
  let reference: HTMLElement;

  beforeAll(async () => {
    const container = await AstroContainer.create({
      // As in astro.config.mjs, so the whitespace between tags is what the build emits.
      astroConfig: { compressHTML: true },
      // The support section holds the PIX copy island.
      renderers: await loadRenderers([reactRenderer()]),
    });
    built = parse(await container.renderToString(component));
    reference = parse(
      selectors.map((s) => live.querySelector(s)?.outerHTML ?? `MISSING ${s}`).join(""),
    );
  });

  it("has the live build's visible text", () => {
    expect(text(built)).toBe(text(reference));
  });

  it("has the live build's hrefs and srcs, in order", () => {
    expect(refs(built)).toEqual(refs(reference));
  });

  it("keeps every id the live build has, so no deep link breaks", () => {
    expect(ids(built)).toEqual(ids(reference));
  });
});
