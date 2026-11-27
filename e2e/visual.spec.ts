import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

// Screenshot baselines of the one page (Spec 0002). Visual parity against reference/live/ is
// retired: the site is no longer a copy of the live page, so the baselines below are the
// approved look, and every later build is compared with them.
//
// Update them only when a page change is intended, and review the new images in the pull request:
//   pnpm test:visual --update-snapshots
//
// The fonts are the ones the page loads from Google Fonts, served from a recording
// (e2e/fonts/fonts.har) so a run neither needs the network nor shifts when Google re-encodes a
// file. Re-record with RECORD_FONTS=1 if the page's font request changes.

/** The two widths the site is judged at: a phone, and a laptop. */
const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

/**
 * How far a screenshot may drift from its baseline and still pass.
 *
 * - `threshold` is how different one pixel's colour may be (0 to 1, in the YIQ space Playwright
 *   compares in) before it counts as changed. At 0.01 a shade as close as the sign yellow moved
 *   from #f6c400 to #f0c000, or the lede grey from #d7d3c9 to #cfcbc1, counts.
 * - `maxDiffPixelRatio` is how many pixels may count as changed: 0.02% of the page, about 900
 *   pixels on the phone page and 2,300 on the desktop one. That is room for anti-aliasing to
 *   flip the edge pixels of a few glyphs, and less than a 2px change to one gap moves (about
 *   0.05% of the page), let alone a recoloured element or a spacing change that shifts
 *   everything after it.
 *
 * Measured in the sandbox image, with the recorded fonts, the unchanged page differs from its
 * baseline by zero pixels, run after run.
 */
const PIXEL_TOLERANCE = { threshold: 0.01, maxDiffPixelRatio: 0.0002 } as const;

const fontsHar = fileURLToPath(new URL("./fonts/fonts.har", import.meta.url));
const FONT_HOST = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

async function open(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Fonts come from the recording; every other request leaving localhost is answered empty.
  await page.route(
    (url) => url.hostname !== "localhost" && !FONT_HOST.test(url.href),
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.routeFromHAR(fontsHar, {
    url: FONT_HOST,
    update: process.env.RECORD_FONTS === "1",
    updateContent: "attach",
    notFound: "abort",
  });
  await page.goto("/");
  // Every image, including the lazy ones below the fold, loaded and decoded.
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const img of images) img.loading = "eager";
    await Promise.all(images.map((img) => img.decode().catch(() => undefined)));
  });
  // The fonts the page asks for, loaded, so no fallback face is captured.
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, "")),
  );
  for (const family of ["Bebas Neue", "Montserrat", "Sora", "IBM Plex Mono"]) {
    expect(loaded).toContain(family);
  }
}

// Full-page captures are heavy: the two run one after the other, in one worker, so they do not
// starve each other (or the rest of the suite) of memory and time out.
test.describe("the page against its baselines", () => {
  test.describe.configure({ mode: "default", timeout: 90_000 });

  for (const viewport of VIEWPORTS) {
    test(`the page at ${viewport.width}x${viewport.height} matches its baseline`, async ({
      page,
    }) => {
      await open(page, viewport);
      await expect(page).toHaveScreenshot(`page-${viewport.name}.png`, {
        fullPage: true,
        animations: "disabled",
        caret: "hide",
        ...PIXEL_TOLERANCE,
      });
    });
  }
});
