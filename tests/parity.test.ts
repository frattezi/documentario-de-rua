// The parity gate, at the level of the whole page: what Spec 0002 is allowed to change, and
// everything it is not.
//
// The built page is compared with reference/live/index.html as a whole document. Everything the
// allowlist below does not name must be identical, tag for tag, attribute for attribute and
// character for character: that is what protects the testimonies. The allowlist is the diff
// Spec 0002 makes, and nothing more; an entry nobody can justify is visible as an entry.
//
// The regions Spec 0002 leaves alone are also compared component by component in
// tests/sections.test.ts, which runs without a build.
//
// It runs against dist/, so `pnpm build` must have run — `pnpm verify` does them in order.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { NodeType, parse, type HTMLElement, type Node } from "node-html-parser";
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

/**
 * One change Spec 0002 makes to the live page.
 *
 * - With `reference` and `built`, the matched elements are replaced, on each side, by the same
 *   marker: the change may rewrite them, but they must stand in the same place, as many of them.
 * - With `built` alone, the matched elements are new and are left out of the comparison.
 * - With `attribute`, only that attribute of the matched elements may differ; the elements, their
 *   other attributes and their content are still compared.
 * - `keep` names parts of a replaced region that must still match the live page exactly, compared
 *   by their content, wherever the change moved them.
 *
 * Every entry must match something, unless it is `optional` and says why: an entry that matches
 * nothing is an entry nobody needs.
 */
interface Change {
  /** What Spec 0002 changed, in a line. */
  change: string;
  /** Which of the changes the Spec allows it falls under. */
  allowedAs:
    | "the Project name"
    | "the header byline"
    | "<title> and the Open Graph tags"
    | "the #apoie paragraph"
    | "the new #sobre section"
    | "the new #participe section"
    | "the blocks that expand #filme";
  reference?: string;
  built?: string;
  attribute?: string;
  keep?: readonly { reference: string; built: string }[];
  optional?: string;
}

/** Everything Spec 0002 changes on the live page. Anything else that differs fails the test. */
const spec0002Changes: readonly Change[] = [
  {
    change: "The page's title is the Project's",
    allowedAs: "<title> and the Open Graph tags",
    reference: "head > title",
    built: "head > title",
  },
  {
    change: "The page's description is the Project's, for search engines and link previews",
    allowedAs: "<title> and the Open Graph tags",
    reference: 'head > meta[name="description"]',
    built: 'head > meta[name="description"]',
    attribute: "content",
  },
  {
    change: "The share card's title is the Project's",
    allowedAs: "<title> and the Open Graph tags",
    reference: 'head > meta[property="og:title"]',
    built: 'head > meta[property="og:title"]',
    attribute: "content",
  },
  {
    change: "The share card's description is the Project's",
    allowedAs: "<title> and the Open Graph tags",
    reference: 'head > meta[property="og:description"]',
    built: 'head > meta[property="og:description"]',
    attribute: "content",
  },
  {
    change: "The byline names the Project, beside the logo slot's text wordmark",
    allowedAs: "the header byline",
    reference: "header > span.by",
    built: "header > span.brand",
  },
  {
    change: "The hero's accessible title is the Project's name",
    allowedAs: "the Project name",
    reference: "h1#t",
    built: "h1#t",
    attribute: "aria-label",
  },
  {
    change: "The hero's two-line title treatment spells the Project's name",
    allowedAs: "the Project name",
    reference: "h1#t .ov__line",
    built: "h1#t .ov__line",
  },
  {
    change: "The featured Film is named below the Project's title, where the player sits",
    allowedAs: "the Project name",
    built: ".hero > .wrap > span.featured",
  },
  {
    change: "The nav gains the presentation's anchor",
    allowedAs: "the new #sobre section",
    built: 'header nav > a[href="#sobre"]',
  },
  {
    change: "The presentation of the Project",
    allowedAs: "the new #sobre section",
    built: "main > section#sobre",
  },
  {
    change:
      "#apoie becomes the donation call inside #participe, beside the other two calls; its " +
      "eyebrow and the PIX card are as published",
    allowedAs: "the new #participe section",
    reference: "main > section#apoie",
    built: "main > section#participe",
    keep: [
      { reference: "section#apoie .eyebrow", built: "#participe #apoie > .eyebrow" },
      { reference: "section#apoie .pixcard", built: "#participe #apoie > .pixcard" },
    ],
  },
  {
    change:
      "The Wagner and Charles sentences leave the donation ask and stay among the Voices, as " +
      "published",
    allowedAs: "the #apoie paragraph",
    built: "section#vozes > .wrap > p.lede",
    keep: [{ reference: "section#apoie .pix p", built: "section#vozes > .wrap > p.lede" }],
  },
  {
    change: "The credits open with the production line the header's byline used to carry",
    allowedAs: "the blocks that expand #filme",
    built: "section#filme .syn dl > :nth-child(1), section#filme .syn dl > :nth-child(2)",
  },
  {
    change: "The Film's repercussão and exibições",
    allowedAs: "the blocks that expand #filme",
    built: "section#filme .film-list",
    optional: "both lists render nothing while their data is empty (ADR 0002)",
  },
];

const VOID = new Set(
  "area base br col embed hr img input link meta source track wbr".split(" "),
);

const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/**
 * What only the build tool decides, not the page: the content hash in an asset's file name and
 * the uid of an island. Neither is something a visitor reads or links to.
 */
const withoutBuildNoise = (name: string, value: string): string =>
  name === "uid" ? "" : value.replace(/(\/_astro\/[\w-]+)\.[\w-]{8}\.(js|css)/g, "$1.$2");

/**
 * Astro's island runtime, which the framework inlines once per page. It is the build tool's code,
 * not the page's, and it changes with Astro's version; that it is present is still compared.
 */
const islandRuntime = "customElements.define(`astro-island`";
const withoutRuntime = (text: string): string =>
  text.includes(islandRuntime) ? "⟨Astro's island runtime⟩" : text;

interface Marks {
  replaced: Map<HTMLElement, string>;
  attributes: Map<HTMLElement, Set<string>>;
}

/**
 * The document as a list of tokens, one per tag, text or comment. Attributes are written in one
 * canonical form (`alt` and `alt=""` are the same attribute), and nothing else is normalised:
 * whitespace, entities and order all count.
 */
function tokens(node: Node, marks: Marks, out: string[] = []): string[] {
  for (const child of node.childNodes) {
    if (child.nodeType === NodeType.TEXT_NODE) {
      out.push(escapeText(withoutRuntime(child.text)));
    } else if (child.nodeType === NodeType.COMMENT_NODE) {
      out.push(`<!--${child.rawText}-->`);
    } else if (child.nodeType === NodeType.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const marker = marks.replaced.get(el);
      if (marker !== undefined) {
        if (marker !== "") out.push(marker);
        continue;
      }
      const tag = el.rawTagName.toLowerCase();
      const allowed = marks.attributes.get(el);
      const attrs = Object.entries(el.attributes)
        .map(([name, value]) => {
          const v = allowed?.has(name) ? "⟨allowlisted⟩" : withoutBuildNoise(name, value);
          return ` ${name}="${escapeAttr(v)}"`;
        })
        .join("");
      out.push(`<${tag}${attrs}>`);
      if (!VOID.has(tag)) {
        tokens(el, marks, out);
        out.push(`</${tag}>`);
      }
    }
  }
  return out;
}

const documentOf = (html: string): HTMLElement =>
  parse(html, { comment: true, blockTextElements: { script: true, style: true } });

interface Comparison {
  reference: string[];
  built: string[];
  /** Entries that matched nothing on a side they name. */
  unused: string[];
  /** `keep` parts that no longer match the live page. */
  kept: { change: string; reference: string; built: string }[];
}

/** Compares two documents, letting through exactly the changes listed. */
function compare(referenceHtml: string, builtHtml: string, changes: readonly Change[]): Comparison {
  const ref = documentOf(referenceHtml);
  const bld = documentOf(builtHtml);
  const refMarks: Marks = { replaced: new Map(), attributes: new Map() };
  const bldMarks: Marks = { replaced: new Map(), attributes: new Map() };
  const unused: string[] = [];
  const kept: Comparison["kept"] = [];
  const inner = (root: HTMLElement, selector: string) => {
    const el = root.querySelector(selector);
    return el ? tokens(el, { replaced: new Map(), attributes: new Map() }).join("") : `(no ${selector})`;
  };

  for (const entry of changes) {
    const marker = `<!--allowlisted: ${entry.change}-->`;
    const sides = [
      [ref, entry.reference, refMarks],
      [bld, entry.built, bldMarks],
    ] as const;
    for (const [root, selector, marks] of sides) {
      if (selector === undefined) continue;
      const matched = root.querySelectorAll(selector);
      if (matched.length === 0 && entry.optional === undefined) unused.push(`${entry.change} (${selector})`);
      for (const el of matched) {
        if (entry.attribute !== undefined) {
          const set = marks.attributes.get(el) ?? new Set<string>();
          set.add(entry.attribute);
          marks.attributes.set(el, set);
        } else {
          // An element only the build has is new: it leaves no marker to line up.
          marks.replaced.set(el, entry.reference === undefined ? "" : marker);
        }
      }
    }
    for (const part of entry.keep ?? []) {
      const was = inner(ref, part.reference);
      const now = inner(bld, part.built);
      if (was !== now) kept.push({ change: entry.change, reference: was, built: now });
    }
  }

  return { reference: tokens(ref, refMarks), built: tokens(bld, bldMarks), unused, kept };
}

describe("the built page against the live build", () => {
  if (!existsSync(builtPath)) {
    it("needs a build", () => {
      throw new Error("dist/index.html is missing — run `pnpm build`, or `pnpm verify`");
    });
    return;
  }

  const built = body(builtPath);
  const reference = body(referencePath);
  const builtHtml = readFileSync(builtPath, "utf8");
  const referenceHtml = readFileSync(referencePath, "utf8");

  describe("content parity, with Spec 0002's changes allowlisted", () => {
    const result = compare(referenceHtml, builtHtml, spec0002Changes);

    it("is identical to the live page everywhere the allowlist does not name", () => {
      expect(result.built).toEqual(result.reference);
    });

    it("keeps, inside each change, the parts the live page published", () => {
      expect(result.kept).toEqual([]);
    });

    it("has no allowlist entry that matches nothing", () => {
      expect(result.unused).toEqual([]);
    });

    // The comparison must catch what it exists to catch. Each case alters the build outside the
    // allowlist, the way a well-meant edit would, and the page must then fail.
    const tampered: { name: string; edit: (html: string) => string }[] = [
      {
        name: "one character of a Voice's testimony",
        edit: (html) => {
          const doc = documentOf(html);
          const quote = doc.querySelectorAll(".voice .cap")[2]!;
          quote.set_content(quote.innerHTML.replace(/a/, "á"));
          return doc.toString();
        },
      },
      {
        name: "a Voice's speaker note",
        edit: (html) => {
          const doc = documentOf(html);
          const note = doc.querySelector(".voice .who small")!;
          note.set_content(`${note.text}.`);
          return doc.toString();
        },
      },
      {
        name: "a step of the law section",
        edit: (html) => html.replace("2º turno", "2.º turno"),
      },
      {
        name: "a year of the timeline",
        edit: (html) => html.replace(">2009<", ">2010<"),
      },
      {
        name: "Diego's wall",
        edit: (html) => {
          const doc = documentOf(html);
          doc.querySelector("figure.wall figcaption small")!.set_content("Diego");
          return doc.toString();
        },
      },
      {
        name: "a link the live page offers",
        edit: (html) => html.replace("https://www.youtube.com/@guilhermesimoesdias", "https://youtube.com/"),
      },
      {
        name: "an attribute outside the allowlist",
        edit: (html) => html.replace('aria-labelledby="lei-h"', 'aria-labelledby="lei"'),
      },
      {
        name: "whitespace between two tags",
        edit: (html) => html.replace("</section><section", "</section> <section"),
      },
      {
        name: "a removed section",
        edit: (html) => {
          const doc = documentOf(html);
          doc.querySelector("section#viaduto")!.remove();
          return doc.toString();
        },
      },
      {
        name: "the PIX card inside #participe",
        edit: (html) => html.replace("QR Code PIX", "QR code PIX"),
      },
      {
        name: "the Wagner and Charles sentences, now among the Voices",
        edit: (html) => html.replace("busca água de carrinho", "busca água"),
      },
    ];

    it("still passes when the build is only parsed and written back, so the cases below test their edit", () => {
      const r = compare(referenceHtml, documentOf(builtHtml).toString(), spec0002Changes);
      expect(r.built).toEqual(r.reference);
      expect(r.kept).toEqual([]);
    });

    it.each(tampered)("fails when the build changes $name", ({ edit }) => {
      const edited = edit(builtHtml);
      expect(edited).not.toBe(builtHtml);
      const r = compare(referenceHtml, edited, spec0002Changes);
      const passes = JSON.stringify(r.built) === JSON.stringify(r.reference) && r.kept.length === 0;
      expect(passes).toBe(false);
    });

    it("fails when an allowlisted region is not where the live page had it", () => {
      // Moving the participation section after the Film keeps every entry matched, but breaks
      // the order the markers must line up in.
      const doc = documentOf(builtHtml);
      const participe = doc.querySelector("section#participe")!;
      const film = doc.querySelector("section#filme")!;
      participe.remove();
      film.insertAdjacentHTML("afterend", participe.outerHTML);
      const r = compare(referenceHtml, doc.toString(), spec0002Changes);
      expect(r.built).not.toEqual(r.reference);
    });

    it("lists only the changes Spec 0002 makes", () => {
      expect(new Set(spec0002Changes.map((c) => c.allowedAs))).toEqual(
        new Set([
          "the Project name",
          "the header byline",
          "<title> and the Open Graph tags",
          "the #apoie paragraph",
          "the new #sobre section",
          "the new #participe section",
          "the blocks that expand #filme",
        ]),
      );
    });
  });

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
