import { expect, test, type Page } from "@playwright/test";

// A visitor who prefers reduced motion gets the page with its animations off: nothing animates on
// load, nothing transitions on hover, and the nav jumps rather than scrolls.

const open = async (page: Page, reducedMotion: "reduce" | "no-preference") => {
  await page.emulateMedia({ reducedMotion });
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.goto("/");
};

/** Every element, or pseudo-element, that would animate or transition. */
const moving = (page: Page) =>
  page.evaluate(() => {
    const found: string[] = [];
    const moves = (s: CSSStyleDeclaration) =>
      s.animationName !== "none" ||
      s.transitionDuration.split(",").some((d) => parseFloat(d) > 0);
    for (const el of document.querySelectorAll("*")) {
      for (const pseudo of [null, "::before", "::after"]) {
        if (moves(getComputedStyle(el, pseudo))) {
          found.push(`${el.tagName.toLowerCase()}.${el.className}${pseudo ?? ""}`);
        }
      }
    }
    return found;
  });

test.describe("with reduced motion", () => {
  test("nothing on the page animates or transitions", async ({ page }) => {
    await open(page, "reduce");
    expect(await moving(page)).toEqual([]);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });

  test("the nav does not smooth-scroll", async ({ page }) => {
    await open(page, "reduce");
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).toBe("auto");
  });
});

test.describe("without a preference", () => {
  test("the hero still animates, so the test above is not vacuous", async ({ page }) => {
    await open(page, "no-preference");
    expect(await moving(page)).toEqual(
      expect.arrayContaining([expect.stringMatching(/^span\.type/), expect.stringMatching(/^div\.player/)]),
    );
  });
});
