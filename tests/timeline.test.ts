// Diego's wall and the overpass timeline, checked against the live build beyond the region's
// visible text: where the wall sits, the timeline's rows and columns, the spanning 2026 row, the
// typed data itself, and the stylesheet that collapses the two columns on a phone.
// tests/sections.test.ts already compares both regions' visible text and links.
import { readdirSync, readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Timeline from "../src/components/Timeline.astro";
import Voices from "../src/components/Voices.astro";
import { timeline, timelineSection, type TimelineRow } from "../src/content/timeline";

const root = new URL("../", import.meta.url);
const live = parse(readFileSync(new URL("reference/live/index.html", root), "utf8"));

const text = (el: HTMLElement): string => el.textContent.replace(/\s+/g, " ").trim();

const render = async (component: Parameters<AstroContainer["renderToString"]>[0]) => {
  const container = await AstroContainer.create({ astroConfig: { compressHTML: true } });
  return parse(await container.renderToString(component));
};

/** A timeline's body rows, read back into the shape of the typed data. */
const rows = (table: HTMLElement): TimelineRow[] =>
  table.querySelectorAll("tbody tr").map((tr) => {
    const [year, ...sides] = tr.querySelectorAll("td");
    if (sides.length === 1 && sides[0]!.getAttribute("colspan") === "2") {
      return { year: text(year!), span: true, text: text(sides[0]!) };
    }
    expect(sides).toHaveLength(2);
    return { year: text(year!), charles: text(sides[0]!), angola: text(sides[1]!) };
  });

/** Every rule in a minified stylesheet whose selector mentions `.tl`, as `selector{body}`. */
const tlRules = (css: string): string[] =>
  [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) => /\.tl\b/.test(selector!))
    .map(([, selector, body]) => `${selector!.trim()}{${body!.trim()}}`);

/** Every `@media (width<=640px)` block in a minified stylesheet, as [whole block, its body]. */
const phoneBlocks = (css: string): [string, string][] => {
  const blocks: [string, string][] = [];
  const head = "@media (width<=640px){";
  for (let start = css.indexOf(head); start >= 0; start = css.indexOf(head, start + 1)) {
    const open = start + head.length - 1;
    let depth = 0;
    for (let i = open; i < css.length; i++) {
      if (css[i] === "{") depth++;
      if (css[i] === "}" && --depth === 0) {
        blocks.push([css.slice(start, i + 1), css.slice(open + 1, i)]);
        break;
      }
    }
  }
  return blocks;
};

/** The `.tl` rules that apply only on a phone. */
const phoneRules = (css: string): string[] => phoneBlocks(css).flatMap(([, body]) => tlRules(body));

/** The `.tl` rules that apply at every width. */
const wideRules = (css: string): string[] =>
  tlRules(phoneBlocks(css).reduce((rest, [block]) => rest.replace(block, ""), css));

/** Our hand-written CSS, reduced to the live build's minified form for the properties used here. */
const minify = (css: string): string =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\(width <= (\d+px)\)/g, "(width<=$1)")
    .replace(/\b0\.(\d)/g, ".$1")
    .replace(/ \/ /g, "/")
    .trim();

describe("Diego's wall", () => {
  let built: HTMLElement;
  const reference = live.querySelector("figure.wall")!;

  beforeAll(async () => {
    built = (await render(Voices)).querySelector("figure.wall")!;
  });

  it("renders the live figure exactly: photo, dedication, highlighting and credit", () => {
    expect(built).toBeTruthy();
    expect(built.outerHTML).toBe(reference.outerHTML);
  });

  it("sits where the live page puts it, right after the Voices and without an id of its own", () => {
    // The live figure has no id: it is reached through #vozes, which it closes.
    expect(reference.getAttribute("id")).toBeUndefined();
    expect(built.getAttribute("id")).toBeUndefined();
    const previous = (el: HTMLElement) => el.previousElementSibling?.getAttribute("id");
    expect(previous(reference)).toBe("vozes");
    expect(previous(built)).toBe("vozes");
  });

  it("ships the photo it points at", () => {
    const src = built.querySelector("img")!.getAttribute("src")!;
    expect(src).toBe("/img/wall.jpg");
    expect(readFileSync(new URL(`public${src}`, root))).toEqual(
      readFileSync(new URL(`reference/live${src}`, root)),
    );
  });
});

describe("the overpass timeline", () => {
  let built: HTMLElement;
  const reference = live.querySelector("section#viaduto")!;

  beforeAll(async () => {
    built = (await render(Timeline)).querySelector("section#viaduto")!;
  });

  it("renders at the live id, under the live heading and column heads", () => {
    expect(built).toBeTruthy();
    expect(built.getAttribute("aria-labelledby")).toBe(reference.getAttribute("aria-labelledby"));
    expect(text(built.querySelector("#viaduto-h")!)).toBe(text(reference.querySelector("#viaduto-h")!));
    const heads = (el: HTMLElement) => el.querySelectorAll("thead th").map(text);
    expect(heads(built)).toEqual(heads(reference));
  });

  it("shows every live year from 2009 to 2026, in order", () => {
    const years = (el: HTMLElement) => rows(el).map((r) => r.year);
    expect(years(built)).toEqual(years(reference));
    expect(years(built)[0]).toBe("2009");
    expect(years(built).at(-1)).toBe("2026");
    expect([...years(built)].sort()).toEqual(years(built));
  });

  it("puts each side's text in its column, empty where the live page leaves it empty", () => {
    expect(rows(built)).toEqual(rows(reference));
  });

  it("labels each side's cell with its column, for the phone layout", () => {
    const labels = (el: HTMLElement) =>
      el.querySelectorAll("tbody tr").map((tr) =>
        tr.querySelectorAll("td").map((td) => td.getAttribute("data-side") ?? null),
      );
    expect(labels(built)).toEqual(labels(reference));
  });

  it("spans the 2026 row across both columns, and only that row", () => {
    const spanning = (el: HTMLElement) =>
      el.querySelectorAll("tbody tr").filter((tr) => tr.querySelector("td[colspan='2']"));
    for (const el of [built, reference]) {
      expect(spanning(el)).toHaveLength(1);
      expect(text(spanning(el)[0]!.querySelector("td")!)).toBe("2026");
      expect(spanning(el)[0]!.classList.contains("now")).toBe(true);
    }
  });

  it("renders the live markup to the character", () => {
    expect(built.outerHTML).toBe(reference.outerHTML);
  });
});

describe("the timeline's data", () => {
  const reference = live.querySelector("section#viaduto table.tl")!;

  it("carries the live rows: year, both sides, and the spanning case", () => {
    expect(timeline).toEqual(rows(reference));
  });

  it("spans only its last row", () => {
    expect(timeline.filter((r) => r.span).map((r) => r.year)).toEqual(["2026"]);
    expect(timeline.at(-1)!.span).toBe(true);
  });

  it("names the columns as the live page does", () => {
    const heads = reference.querySelectorAll("thead th").map(text);
    const { year, charles, angola } = timelineSection.columns;
    expect([year, charles, angola]).toEqual(heads);
  });
});

describe("the timeline's stylesheet", () => {
  const assets = new URL("reference/live/_astro/", root);
  const liveCss = readdirSync(assets)
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(new URL(f, assets), "utf8"))
    .join("");
  const ours = minify(readFileSync(new URL("src/styles/timeline.css", root), "utf8"));

  it("lays the two columns out as the live page does at full width", () => {
    expect(wideRules(ours)).toEqual(wideRules(liveCss));
    expect(wideRules(ours).length).toBeGreaterThan(0);
  });

  it("collapses the columns at the live page's breakpoint, the way it does", () => {
    expect(phoneRules(ours)).toEqual(phoneRules(liveCss));
    expect(phoneRules(ours).length).toBeGreaterThan(0);
  });
});
