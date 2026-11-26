// The law section, checked against the live build beyond the region's visible text: the id and
// heading, every step from PL 174/2025 to Lei 12.003/2026 in order with its bold lead, the 0,03%
// figure's emphasis, the rights in order, the typed data itself, and the stylesheet at every
// width. tests/sections.test.ts already compares the region's visible text and links.
import { readdirSync, readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Law from "../src/components/Law.astro";
import { lawSection, lawSteps, rights, type LawStep } from "../src/content/law";

const root = new URL("../", import.meta.url);
const live = parse(readFileSync(new URL("reference/live/index.html", root), "utf8"));
const reference = live.querySelector("section#lei")!;

const text = (el: HTMLElement): string => el.textContent.replace(/\s+/g, " ").trim();

/** The section's steps, read back into the shape of the typed data. */
const steps = (section: HTMLElement): LawStep[] =>
  section.querySelectorAll("ol.steps > li").map((li) => {
    const when = li.querySelector(":scope > span")!;
    const body = li.querySelector(":scope > div")!;
    const lead = body.querySelector(":scope > b")!;
    // The lead opens the step; what follows it is plain text, kept as published.
    expect(body.firstChild).toBe(lead);
    expect(body.querySelectorAll("*")).toHaveLength(1);
    return { when: when.textContent, lead: lead.textContent, rest: body.textContent.slice(lead.textContent.length) };
  });

const rightsOf = (section: HTMLElement): string[] =>
  section.querySelectorAll("p.rights > span").map((span) => span.textContent);

describe("the law section", () => {
  let built: HTMLElement;

  beforeAll(async () => {
    const container = await AstroContainer.create({ astroConfig: { compressHTML: true } });
    const section = parse(await container.renderToString(Law)).querySelector("section#lei");
    if (!section) throw new Error("section#lei not found in the build");
    built = section;
  });

  it("is the live markup, tag for tag", () => {
    expect(built.outerHTML).toBe(reference.outerHTML);
  });

  it("keeps the live id, heading and eyebrow", () => {
    expect(built.getAttribute("id")).toBe("lei");
    expect(built.getAttribute("aria-labelledby")).toBe("lei-h");
    expect(text(built.querySelector("h2#lei-h")!)).toBe("Como o projeto virou lei");
    expect(text(built.querySelector("h2#lei-h")!)).toBe(text(reference.querySelector("h2#lei-h")!));
    expect(text(built.querySelector(".eyebrow")!)).toBe(text(reference.querySelector(".eyebrow")!));
  });

  it("renders every step from PL 174/2025 to Lei 12.003/2026, in order", () => {
    const published = steps(reference);
    expect(published).toHaveLength(4);
    expect(published[0]!.lead).toContain("PL 174/2025");
    expect(published.at(-1)!.lead).toContain("Lei 12.003/2026");
    expect(steps(built)).toEqual(published);
  });

  it("gives the 0,03% figure the live emphasis: its own display number beside its paragraph", () => {
    const stat = (section: HTMLElement) => section.querySelector(".law > .stat")!;
    expect(stat(built).childNodes.map((n) => n.toString())).toEqual(
      stat(reference).childNodes.map((n) => n.toString()),
    );
    expect(stat(built).querySelector(":scope > span.n")!.textContent).toBe("0,03%");
    // Inside the paragraph the figure is plain text, as online.
    expect(stat(built).querySelector("p")!.querySelectorAll("*")).toHaveLength(0);
    // Steps on the left, the figure on the right.
    expect(built.querySelector(".law")!.children.map((c) => c.classNames)).toEqual(["steps", "stat"]);
  });

  it("lists the same rights, in the same order, and names them all for screen readers", () => {
    expect(rightsOf(built)).toEqual(rightsOf(reference));
    expect(built.querySelector("p.rights")!.getAttribute("aria-label")).toBe(
      reference.querySelector("p.rights")!.getAttribute("aria-label"),
    );
    // Dignidade closes the list: the stylesheet paints the last one in the sign colour.
    expect(rightsOf(built).at(-1)).toBe("Dignidade");
  });
});

describe("the law section's typed data", () => {
  it("carries the live steps", () => {
    expect([...lawSteps]).toEqual(steps(reference));
  });

  it("carries the live rights, in order", () => {
    expect([...rights]).toEqual(rightsOf(reference));
  });

  it("carries the live heading, figure and copy", () => {
    expect(lawSection.eyebrow).toBe(reference.querySelector(".eyebrow")!.textContent);
    expect(lawSection.heading).toBe(reference.querySelector("#lei-h")!.textContent);
    expect(lawSection.stat.number).toBe(reference.querySelector(".stat .n")!.textContent);
    expect(lawSection.stat.body).toBe(reference.querySelector(".stat p")!.textContent);
    expect(lawSection.rightsIntro).toBe(reference.querySelector(".rights-intro")!.textContent);
  });
});

/** The law section's own classes. `.lede` and `.eyebrow` are shared, and checked elsewhere. */
const lawSelector = /^\.(law|steps|stat|rights|rights-intro)\b/;

/**
 * Every rule in a minified stylesheet that styles the law section, one per selector, prefixed
 * with the media query it sits in (if any): `@media (width<=860px) .law{…}`.
 */
const lawRules = (css: string): string[] => {
  const out: string[] = [];
  const walk = (block: string, media: string) => {
    for (let i = 0; i < block.length; ) {
      const open = block.indexOf("{", i);
      if (open < 0) break;
      const head = block.slice(i, open).trim();
      if (head.startsWith("@media")) {
        let depth = 0;
        let end = open;
        for (; end < block.length; end++) {
          if (block[end] === "{") depth++;
          if (block[end] === "}" && --depth === 0) break;
        }
        walk(block.slice(open + 1, end), `${head} `);
        i = end + 1;
        continue;
      }
      const close = block.indexOf("}", open);
      const body = block.slice(open + 1, close).trim();
      for (const selector of head.split(",").map((s) => s.trim())) {
        if (lawSelector.test(selector)) out.push(`${media}${selector}{${body}}`);
      }
      i = close + 1;
    }
  };
  walk(css, "");
  return out.sort();
};

/** Our hand-written CSS, reduced to the live build's minified form for the properties used here. */
const minify = (css: string): string =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\(width <= (\d+px)\)/g, "(width<=$1)")
    .replace(/@media\(/g, "@media (")
    .replace(/\b0\.(\d)/g, ".$1")
    .trim();

describe("the law section's stylesheet", () => {
  const liveCss = readdirSync(new URL("reference/live/_astro/", root))
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(new URL(`reference/live/_astro/${f}`, root), "utf8"))
    .join("");
  const ours = minify(
    readdirSync(new URL("src/styles/", root))
      .map((f) => readFileSync(new URL(`src/styles/${f}`, root), "utf8"))
      .join("\n"),
  );

  it("has the live build's rules, at full width and inside each media query", () => {
    const published = lawRules(liveCss);
    expect(published.some((r) => r.startsWith("@media (width<=860px) .law{"))).toBe(true);
    expect(published.some((r) => r.startsWith("@media (width<=520px) .steps li{"))).toBe(true);
    expect(lawRules(ours)).toEqual(published);
  });
});
