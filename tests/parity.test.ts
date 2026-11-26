// The parity gate: the whole built page against the whole live build. This is what says the
// rebuild is faithful (Spec 0001). The reference is the target and is never edited to make this
// pass — where the two differ, the build is what changes.
//
// It runs against dist/, so `pnpm build` must have run. The test says so rather than failing
// obscurely.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse, type HTMLElement } from "node-html-parser";
import { describe, expect, it } from "vitest";

const built = fileURLToPath(new URL("../dist/index.html", import.meta.url));
const reference = fileURLToPath(new URL("../reference/live/index.html", import.meta.url));

const body = (path: string): HTMLElement => {
  const el = parse(readFileSync(path, "utf8")).querySelector("body");
  if (!el) throw new Error(`no <body> in ${path}`);
  return el;
};

/** Visible text, whitespace collapsed. Icons, scripts and styles carry none. */
const text = (el: HTMLElement): string => {
  const copy = parse(el.outerHTML);
  copy.querySelectorAll("svg,script,style,noscript,template").forEach((e) => e.remove());
  return copy.textContent.replace(/\s+/g, " ").trim();
};

/**
 * Every href and src in document order. The build's own hashed asset paths (`/_astro/…`) are
 * excluded: they are generated names, and the live build's differ by construction.
 */
const refs = (el: HTMLElement): string[] =>
  el
    .querySelectorAll("[href],[src]")
    .map((e) => e.getAttribute("href") ?? e.getAttribute("src") ?? "")
    .filter((v) => v !== "" && !v.startsWith("/_astro/"));

/** Every id in document order: a deep link that works today must still work. */
const ids = (el: HTMLElement): string[] =>
  el.querySelectorAll("[id]").map((e) => e.getAttribute("id") ?? "");

describe("the built page against the live build", () => {
  if (!existsSync(built)) {
    it("needs a build", () => {
      throw new Error("dist/index.html is missing — run `pnpm build` before `pnpm test`");
    });
    return;
  }

  const a = body(built);
  const b = body(reference);

  it("has the same visible text, to the character", () => {
    expect(text(a)).toBe(text(b));
  });

  it("has the same hrefs and srcs, in the same order", () => {
    expect(refs(a)).toEqual(refs(b));
  });

  it("has the same ids, in the same order", () => {
    expect(ids(a)).toEqual(ids(b));
  });

  it("requests nothing from a YouTube host before the player is clicked", () => {
    const html = readFileSync(built, "utf8");
    const iframes = parse(html).querySelectorAll("iframe");
    expect(iframes).toHaveLength(0);
    expect(html).not.toContain("youtube-nocookie.com/embed");
  });
});
