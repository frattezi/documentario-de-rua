// The regions Spec 0002 does not touch must stay identical to the live build, to the character.
// This is what protects the Film's content — above all the testimonies — while the Project's
// identity and its new sections change around them.
//
// What Spec 0002 is allowed to change is the allowlist in tests/parity.test.ts; nothing here.
import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import Film from "../src/components/Film.astro";
import Voices from "../src/components/Voices.astro";
import Timeline from "../src/components/Timeline.astro";
import Law from "../src/components/Law.astro";
import Footer from "../src/components/Footer.astro";

const live = parse(readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8"));

/** Visible text, whitespace collapsed. Icons and an island's inlined assets carry none. */
const text = (el: HTMLElement): string => {
  const copy = parse(el.outerHTML);
  copy.querySelectorAll("svg,script,style").forEach((e) => e.remove());
  return copy.textContent.replace(/\s+/g, " ").trim();
};

/** Every href and src in document order, ignoring the build's own hashed asset paths. */
const refs = (el: HTMLElement): string[] =>
  el
    .querySelectorAll("[href],[src]")
    .map((e) => e.getAttribute("href") ?? e.getAttribute("src") ?? "")
    .filter((v) => v !== "" && !v.startsWith("/_astro/"));

const render = async (component: AstroComponentFactory): Promise<HTMLElement> => {
  const container = await AstroContainer.create({
    // As in astro.config.mjs, so the whitespace between tags is what the build emits.
    astroConfig: { compressHTML: true },
    renderers: await loadRenderers([reactRenderer()]),
  });
  return parse(await container.renderToString(component));
};

const fromLive = (selector: string): HTMLElement => {
  const el = live.querySelector(selector);
  if (!el) throw new Error(`${selector} not found in the live build`);
  return el;
};

interface Region {
  name: string;
  component: AstroComponentFactory;
  /** The part of the rendered component to compare, and the live build's counterpart. */
  selector: string;
}

/** Regions Spec 0002 leaves alone. Each must match the live build exactly. */
const unchanged: Region[] = [
  { name: "the overpass timeline", component: Timeline, selector: "section#viaduto" },
  { name: "the law section", component: Law, selector: "section#lei" },
  { name: "the footer", component: Footer, selector: "footer" },
  { name: "the five Voices", component: Voices, selector: ".voices" },
  { name: "the dedication on Diego's wall", component: Voices, selector: "figure.wall" },
];

describe.each(unchanged)("$name is unchanged", ({ component, selector }) => {
  let built: HTMLElement;
  const reference = fromLive(selector);

  beforeAll(async () => {
    const rendered = await render(component);
    const el = rendered.querySelector(selector);
    if (!el) throw new Error(`${selector} not found in the build`);
    built = el;
  });

  it("has the live build's visible text", () => {
    expect(text(built)).toBe(text(reference));
  });

  it("has the live build's hrefs and srcs, in order", () => {
    expect(refs(built)).toEqual(refs(reference));
  });
});

describe("the Film's published content is unchanged", () => {
  let built: HTMLElement;
  const reference = fromLive("section#filme");

  beforeAll(async () => {
    built = await render(Film);
  });

  it("keeps the synopsis to the character", () => {
    expect(text(built.querySelector(".syn p")!)).toBe(text(reference.querySelector(".syn p")!));
  });

  it("keeps the published credits, and adds only the production line", () => {
    const pairs = (el: HTMLElement): string[] =>
      el.querySelectorAll("dt,dd").map((e) => text(e));
    // Spec 0002 moves the header's old byline here as the first row; the rest is as published.
    expect(pairs(built).slice(2)).toEqual(pairs(reference));
    expect(pairs(built).slice(0, 2)).toEqual(["Produção", "Guilherme Simões · UFMG · 2026"]);
  });

  it("keeps the live heading and id", () => {
    expect(built.querySelector("section")!.getAttribute("id")).toBe("filme");
    expect(text(built.querySelector("#filme-h")!)).toBe(text(reference.querySelector("#filme-h")!));
  });

  it("renders nothing for repercussão or exibições while they are empty", () => {
    expect(built.querySelectorAll(".film-list")).toHaveLength(0);
  });
});
