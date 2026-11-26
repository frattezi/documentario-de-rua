import { readFileSync } from "node:fs";
import { getContainerRenderer as reactRenderer } from "@astrojs/react/container-renderer";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Support from "../src/components/Support.astro";
import { pixKey } from "../src/content/pix";

const live = readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8");

function section(html: string): HTMLElement {
  const el = parse(html).querySelector("section#apoie");
  if (!el) throw new Error("section#apoie not found");
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
    .replace(/<astro-island[^>]*>/, "<astro-island>");

describe("support section", () => {
  let built: HTMLElement;
  const reference = section(live);

  beforeAll(async () => {
    const container = await AstroContainer.create({
      // As in astro.config.mjs, so the whitespace between tags is what the build emits.
      astroConfig: { compressHTML: true },
      renderers: await loadRenderers([reactRenderer()]),
    });
    built = section(await container.renderToString(Support));
  });

  it("uses the live heading and id", () => {
    expect(built.getAttribute("id")).toBe("apoie");
    expect(text(built.querySelector("#apoie-h")!)).toBe("Do filme para a rua");
    expect(built.getAttribute("aria-labelledby")).toBe(reference.getAttribute("aria-labelledby"));
  });

  it("has the live page's visible text", () => {
    expect(text(built)).toBe(
      "ApoieDo filme para a rua" +
        "Wagner busca água de carrinho todos os dias. O barraco de Charles pegou fogo e ele ficou só " +
        "com a roupa do corpo. Em breve, uma contribuição via PIX vai poder ajudar quem vive na rua em " +
        "Belo Horizonte.Destino e chave em confirmação" +
        "QR Code PIXChave PIXa definirCopiar chave",
    );
    expect(text(built)).toBe(text(reference));
  });

  it("has every href and src of the live page", () => {
    expect(attrs(built, "href")).toEqual(attrs(reference, "href"));
    expect(attrs(built, "src")).toEqual(attrs(reference, "src"));
  });

  it("matches the live markup", () => {
    expect(markup(built)).toBe(markup(reference));
  });

  it("has no PIX key configured, so the card reads a definir and the button is disabled", () => {
    expect(pixKey).toBeNull();
    expect(text(built.querySelector("#pixkey")!)).toBe("a definir");
    const button = built.querySelector("button.btn")!;
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(text(button)).toBe("Copiar chave");
  });

  it("passes the configured key to the copy island", () => {
    const props = JSON.parse(built.querySelector("astro-island")!.getAttribute("props")!);
    expect(props).toEqual({ pixKey: [0, pixKey] });
    expect(props).toEqual(JSON.parse(reference.querySelector("astro-island")!.getAttribute("props")!));
  });
});
