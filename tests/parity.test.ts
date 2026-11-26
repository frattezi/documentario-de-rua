// The parity gate, at the level of the whole page: what Spec 0002 is allowed to change, and
// everything it is not.
//
// The regions themselves are compared character by character in tests/sections.test.ts. This
// file checks the page they add up to: that no deep link broke, that every link the live page
// offered still exists, that the Film's content survived the reorganisation, and that the
// Project's identity did replace the Film's.
//
// It runs against dist/, so `pnpm build` must have run — `pnpm verify` does them in order.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse, type HTMLElement } from "node-html-parser";
import { describe, expect, it } from "vitest";
import { site } from "../src/content/site";

const builtPath = fileURLToPath(new URL("../dist/index.html", import.meta.url));
const referencePath = fileURLToPath(new URL("../reference/live/index.html", import.meta.url));

const body = (path: string): HTMLElement => {
  const el = parse(readFileSync(path, "utf8")).querySelector("body");
  if (!el) throw new Error(`no <body> in ${path}`);
  return el;
};

const text = (el: HTMLElement): string => {
  const copy = parse(el.outerHTML);
  copy.querySelectorAll("svg,script,style,noscript,template").forEach((e) => e.remove());
  return copy.textContent.replace(/\s+/g, " ").trim();
};

/** Every href and src, ignoring the build's own hashed asset paths. */
const refs = (el: HTMLElement): string[] =>
  el
    .querySelectorAll("[href],[src]")
    .map((e) => e.getAttribute("href") ?? e.getAttribute("src") ?? "")
    .filter((v) => v !== "" && !v.startsWith("/_astro/"));

/**
 * Every id in the page, except the uids Astro generates for an island: those are build output,
 * not something a visitor can link to.
 */
const ids = (el: HTMLElement): string[] =>
  el
    .querySelectorAll("[id]")
    .filter((e) => e.rawTagName !== "astro-island")
    .map((e) => e.getAttribute("id") ?? "");

describe("the built page against the live build", () => {
  if (!existsSync(builtPath)) {
    it("needs a build", () => {
      throw new Error("dist/index.html is missing — run `pnpm build`, or `pnpm verify`");
    });
    return;
  }

  const built = body(builtPath);
  const reference = body(referencePath);

  it("keeps every id the live page has, so no shared deep link breaks", () => {
    // The site stays one page (ADR 0002): nothing moved to a route of its own, so every
    // anchor a visitor may have saved still lands where it landed.
    for (const id of ids(reference)) expect(ids(built)).toContain(id);
  });

  it("keeps #apoie, which the hero's PIX pill and shared links point at", () => {
    const apoie = built.querySelector("#apoie");
    expect(apoie).not.toBeNull();
    expect(apoie!.closest("#participe")).not.toBeNull();
  });

  it("keeps every link and image the live page offered", () => {
    for (const ref of refs(reference)) expect(refs(built)).toContain(ref);
  });

  it("keeps the Film's testimonies, to the character", () => {
    const voices = text(reference.querySelector(".voices")!);
    expect(text(built)).toContain(voices);
  });

  it("keeps the law section and the timeline, to the character", () => {
    for (const selector of ["section#lei", "section#viaduto"]) {
      expect(text(built)).toContain(text(reference.querySelector(selector)!));
    }
  });

  it("names the Project where the Film used to name the site", () => {
    expect(text(built)).toContain(site.name);
    // The Film is still named — as the Film.
    expect(text(built)).toContain("Entre a Lei e a Rua");
  });

  it("adds the presentation and the three calls to action", () => {
    for (const id of ["sobre", "participe", "ajude", "apoie", "faca-parte"]) {
      expect(ids(built)).toContain(id);
    }
  });

  it("requests nothing from a YouTube host before the player is clicked", () => {
    const html = readFileSync(builtPath, "utf8");
    expect(parse(html).querySelectorAll("iframe")).toHaveLength(0);
    expect(html).not.toContain("youtube-nocookie.com/embed");
  });

  it("ships nothing that looks real while it is not", () => {
    const html = readFileSync(builtPath, "utf8");
    // No PIX key, no form URLs: every such control must be disabled, never a dead link.
    expect(site.forms.production).toBeNull();
    expect(site.forms.membership).toBeNull();
    const buttons = parse(html).querySelectorAll("button.btn");
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) expect(button.hasAttribute("disabled")).toBe(true);
  });

  it("says on the page that the participation copy is provisional, while it is", () => {
    const draft = parse(readFileSync(builtPath, "utf8")).querySelector(".draft");
    expect(site.participateCopyIsProvisional).toBe(true);
    expect(draft).not.toBeNull();
    expect(text(draft!)).toContain("ainda serão definidos");
  });
});
