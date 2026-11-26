import { expect, test, type Page } from "@playwright/test";

// The overpass timeline at both widths: two columns on a desktop, stacked rows on a phone, with
// the 2026 row spanning both sides either way. tests/timeline.test.ts checks the markup and the
// stylesheet against the live build; this checks what the browser makes of them.

const open = async (page: Page, width: number) => {
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
};

/** A cell's box in page coordinates, so the page's own (smooth) scrolling cannot skew it. */
const box = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
  });

test("on a desktop the timeline is a table of two sides, 2026 spanning both", async ({ page }) => {
  await open(page, 1280);
  await expect(page.locator(".tl thead")).toBeVisible();
  const charles = await box(page, ".tl tbody tr:first-child td:nth-child(2)");
  const angola = await box(page, ".tl tbody tr:first-child td:nth-child(3)");
  // Side by side, on one line.
  expect(angola.x).toBeGreaterThan(charles.x + charles.width - 1);
  expect(Math.abs(angola.y - charles.y)).toBeLessThan(1);
  // The 2026 cell starts at Charles's column and ends at Jardim Angola's.
  const now = await box(page, ".tl tr.now td[colspan='2']");
  expect(Math.abs(now.x - charles.x)).toBeLessThan(1);
  expect(Math.abs(now.x + now.width - (angola.x + angola.width))).toBeLessThan(1);
});

test("on a phone the timeline stacks each year's sides, labelled", async ({ page }) => {
  await open(page, 375);
  await expect(page.locator(".tl thead")).toBeHidden();
  const year = await box(page, ".tl tbody tr:first-child td:first-child");
  const charles = await box(page, ".tl tbody tr:first-child td:nth-child(2)");
  const angola = await box(page, ".tl tbody tr:first-child td:nth-child(3)");
  // One under the other, both beside the year.
  expect(angola.y).toBeGreaterThanOrEqual(charles.y + charles.height - 1);
  expect(Math.abs(angola.x - charles.x)).toBeLessThan(1);
  expect(charles.x).toBeGreaterThan(year.x + year.width - 1);
  // Each side names itself, since the column heads are gone.
  const label = await page
    .locator(".tl tbody tr:first-child td:nth-child(2)")
    .evaluate((td) => getComputedStyle(td, "::before").content);
  expect(label).toBe('"Lado do Charles"');
  // An empty side is dropped rather than shown as a dash.
  await expect(page.locator(".tl tbody tr:nth-child(3) td:nth-child(2)")).toBeHidden();
  // The page does not scroll sideways.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.locator(".tl tr.now td[colspan='2']")).toHaveText("Cá estamos");
});
