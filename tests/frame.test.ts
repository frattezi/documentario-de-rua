import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Footer from "../src/components/Footer.astro";
import Header from "../src/components/Header.astro";
import Base from "../src/layouts/Base.astro";
import { credits, followLinks } from "../src/content/footer";
import { headerIcons, navItems } from "../src/content/header";

const read = (path: string): string => readFileSync(new URL(path, import.meta.url), "utf8");
const live = parse(read("../reference/live/index.html"));
const liveCss = readFileSync(
  new URL("../reference/live/_astro/index.DuyyY1EI.css", import.meta.url),
  "utf8",
);

function pick(root: HTMLElement, selector: string): HTMLElement {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`${selector} not found`);
  return el;
}

const text = (el: HTMLElement): string => el.textContent.replace(/\s+/g, " ").trim();
const attrs = (el: HTMLElement, name: string): string[] =>
  el.querySelectorAll(`[${name}]`).map((e) => e.getAttribute(name) ?? "");

let container: AstroContainer;
beforeAll(async () => {
  // As in astro.config.mjs, so the whitespace between tags is what the build emits.
  container = await AstroContainer.create({ astroConfig: { compressHTML: true } });
});

describe.each([
  { name: "header", selector: "header", component: Header },
  { name: "footer", selector: "footer", component: Footer },
])("$name", ({ selector, component }) => {
  let built: HTMLElement;
  const reference = pick(live, selector);

  beforeAll(async () => {
    built = pick(parse(await container.renderToString(component)), selector);
  });

  it("has the live page's visible text", () => {
    expect(text(built)).toBe(text(reference));
  });

  it("has every href of the live page", () => {
    expect(attrs(built, "href")).toEqual(attrs(reference, "href"));
    expect(attrs(built, "aria-label")).toEqual(attrs(reference, "aria-label"));
  });

  it("matches the live markup", () => {
    expect(built.outerHTML).toBe(reference.outerHTML);
  });
});

describe("frame data", () => {
  it("renders one link per data entry", async () => {
    const header = parse(await container.renderToString(Header));
    expect(header.querySelectorAll("nav a")).toHaveLength(navItems.length);
    expect(header.querySelectorAll(".icons a")).toHaveLength(headerIcons.length);
    const footer = parse(await container.renderToString(Footer));
    expect(footer.querySelectorAll(".credits > div")).toHaveLength(credits.length);
    expect(footer.querySelectorAll(".follow a")).toHaveLength(followLinks.length);
  });

  it("links every nav item to an in-page section", () => {
    for (const item of navItems) expect(item.href).toMatch(/^#[a-z]+$/);
  });
});

describe("design tokens", () => {
  /** Custom properties declared in the first `:root` rule, whitespace-normalised. */
  function rootTokens(css: string): Record<string, string> {
    const body = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
    const tokens: Record<string, string> = {};
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) {
      tokens[name!] = value!.replace(/\s+/g, " ").replace(/\(\s/g, "(").replace(/\s\)/g, ")").trim();
    }
    return tokens;
  }

  it("declares the live stylesheet's custom properties, under the same names and values", () => {
    const tokens = rootTokens(read("../src/styles/tokens.css"));
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
    expect(tokens).toEqual(rootTokens(liveCss));
  });
});

describe("web fonts", () => {
  it("loads the fonts exactly as the live page does", async () => {
    const head = pick(parse(await container.renderToString(Base)), "head");
    const fontLinks = (root: HTMLElement): string[] =>
      root
        .querySelectorAll("link")
        .filter((l) => /fonts\.(googleapis|gstatic)\.com/.test(l.getAttribute("href") ?? ""))
        .map((l) => l.outerHTML.replace(/crossorigin(="")?/, "crossorigin"));
    expect(fontLinks(pick(live, "head"))).toHaveLength(3);
    expect(fontLinks(head)).toEqual(fontLinks(pick(live, "head")));
  });
});
