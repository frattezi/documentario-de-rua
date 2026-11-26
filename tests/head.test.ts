import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Index from "../src/pages/index.astro";
import { site } from "../src/content/site";

const live = parse(readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8"));

/** The document-level metadata a browser, a search engine or a link preview reads. */
function head(doc: HTMLElement) {
  const meta = (selector: string) => doc.querySelector(`head ${selector}`)?.getAttribute("content");
  return {
    title: doc.querySelector("head title")?.textContent,
    description: meta('meta[name="description"]'),
    ogTitle: meta('meta[property="og:title"]'),
    ogDescription: meta('meta[property="og:description"]'),
    ogImage: meta('meta[property="og:image"]'),
    og: doc
      .querySelectorAll('head meta[property^="og:"]')
      .map((m) => [m.getAttribute("property"), m.getAttribute("content")]),
    themeColor: meta('meta[name="theme-color"]'),
    lang: doc.querySelector("html")?.getAttribute("lang"),
  };
}

describe("document head", () => {
  let built: HTMLElement;

  beforeAll(async () => {
    const container = await AstroContainer.create({
      astroConfig: { compressHTML: true },
      renderers: await loadRenderers([reactRenderer()]),
    });
    built = parse(await container.renderToString(Index));
  });

  it("names the Project, not the Film", () => {
    const { title, ogTitle, description, ogDescription } = head(built);
    expect(title).toBe(site.name);
    expect(ogTitle).toBe(site.name);
    expect(description).toBe(site.description);
    expect(ogDescription).toBe(site.description);
    // The Film's title names only that Film, never the site itself.
    expect(title).not.toContain("Entre a Lei e a Rua");
  });

  it("keeps the live page's share image, theme colour and language", () => {
    const reference = head(live);
    const { ogImage, themeColor, lang } = head(built);
    expect(ogImage).toBe(reference.ogImage);
    expect(themeColor).toBe(reference.themeColor);
    expect(lang).toBe(reference.lang);
  });

  it("sets every field the live page set, so no link preview loses one", () => {
    const fields = head(built);
    expect(fields.og).toHaveLength(head(live).og.length);
    expect(Object.values(fields).every((v) => v !== undefined)).toBe(true);
  });
});
