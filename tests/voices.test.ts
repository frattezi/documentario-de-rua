// The five Voices, checked against the live build beyond their visible text: the section's id
// and heading, the order of the speakers, and which words each quote highlights and how.
// tests/sections.test.ts already compares the region's visible text and links.
import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { parse, type HTMLElement } from "node-html-parser";
import { beforeAll, describe, expect, it } from "vitest";
import Voices from "../src/components/Voices.astro";
import { voices, type QuotePart } from "../src/content/voices";

const live = parse(readFileSync(new URL("../reference/live/index.html", import.meta.url), "utf8"));
const reference = live.querySelector("section#vozes")!;

const text = (el: HTMLElement): string => el.textContent.replace(/\s+/g, " ").trim();

/** A quote's runs as the markup expresses them: plain text, <mark>, or <span class="y">. */
const runs = (cap: HTMLElement): QuotePart[] =>
  cap.childNodes.map((node) => {
    const el = node as HTMLElement;
    if (el.tagName === "MARK") return { kind: "mark", text: el.textContent };
    if (el.tagName === "SPAN" && el.classList.contains("y")) {
      return { kind: "yellow", text: el.textContent };
    }
    if (el.tagName) throw new Error(`unexpected <${el.tagName.toLowerCase()}> in a quote`);
    return { kind: "plain", text: node.textContent };
  });

const liveVoices = reference.querySelectorAll("article.voice");

describe("the five Voices", () => {
  let built: HTMLElement;

  beforeAll(async () => {
    const container = await AstroContainer.create({ astroConfig: { compressHTML: true } });
    built = parse(await container.renderToString(Voices)).querySelector("section#vozes")!;
  });

  it("render at the live id, under the live heading", () => {
    expect(built).toBeTruthy();
    expect(built.getAttribute("aria-labelledby")).toBe(reference.getAttribute("aria-labelledby"));
    expect(text(built.querySelector("#vozes-h")!)).toBe(text(reference.querySelector("#vozes-h")!));
  });

  it("are five, in the live order", () => {
    const names = (el: HTMLElement) => el.querySelectorAll("article.voice .who b").map(text);
    expect(names(built)).toEqual(names(reference));
    expect(names(built)).toHaveLength(5);
  });

  it("highlight each quote exactly as the live page does", () => {
    const quotes = (el: HTMLElement) => el.querySelectorAll("article.voice p.cap").map((p) => p.innerHTML);
    expect(quotes(built)).toEqual(quotes(reference));
  });

  it("show each name and note as the live page does", () => {
    const who = (el: HTMLElement) =>
      el.querySelectorAll("article.voice .who").map((w) => w.innerHTML);
    expect(who(built)).toEqual(who(reference));
  });
});

describe("the Voices data", () => {
  it("carries the live quotes byte for byte, with their highlighted words", () => {
    expect(voices.map((v) => v.quote)).toEqual(liveVoices.map((a) => runs(a.querySelector("p.cap")!)));
  });

  it("carries the live names and notes", () => {
    expect(voices.map(({ name, note }) => ({ name, note }))).toEqual(
      liveVoices.map((a) => ({
        name: a.querySelector(".who b")!.textContent,
        note: a.querySelector(".who small")!.textContent,
      })),
    );
  });

  it("joins each quote into the live sentence, unchanged", () => {
    expect(voices.map((v) => v.quote.map((p) => p.text).join(""))).toEqual(
      liveVoices.map((a) => a.querySelector("p.cap")!.textContent),
    );
  });
});
