import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Index from "../src/pages/index.astro";

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

  it("is the live page's head", () => {
    expect(head(built)).toEqual(head(live));
  });

  it("has every field the live page sets", () => {
    const reference = head(live);
    expect(reference.title).toBe("Entre a Lei e a Rua — documentário");
    expect(reference.og).toHaveLength(3);
    expect(Object.values(reference).every((v) => v !== undefined)).toBe(true);
  });
});
