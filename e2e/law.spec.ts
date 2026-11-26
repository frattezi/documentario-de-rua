import { expect, test, type Page } from "@playwright/test";

// The law section at both widths: the steps beside the 0,03% figure on a desktop, stacked on a
// phone. tests/law.test.ts checks the markup and the stylesheet against the live build; this
// checks what the browser makes of them.

const open = async (page: Page, width: number) => {
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
};

/** An element's box in page coordinates, so the page's own (smooth) scrolling cannot skew it. */
const box = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
  });

const stepsInOrder = async (page: Page) => {
  await expect(page.locator("#lei ol.steps > li > span")).toHaveText([
    "2025",
    "2º turno",
    "Prazo",
    "2026",
  ]);
  await expect(page.locator("#lei .rights > span")).toHaveText([
    "Moradia",
    "Trabalho",
    "Água",
    "Saúde",
    "Cultura",
    "Educação",
    "Dignidade",
  ]);
};

test("on a desktop the steps sit beside the 0,03% figure", async ({ page }) => {
  await open(page, 1280);
  await stepsInOrder(page);
  const steps = await box(page, "#lei .steps");
  const stat = await box(page, "#lei .stat");
  expect(stat.x).toBeGreaterThan(steps.x + steps.width - 1);
  expect(Math.abs(stat.y - steps.y)).toBeLessThan(1);
  // Each step's marker sits beside its text.
  const when = await box(page, "#lei .steps li:first-child > span");
  const body = await box(page, "#lei .steps li:first-child > div");
  expect(body.x).toBeGreaterThan(when.x + when.width - 1);
  // The figure is set large, in the sign colour, as online.
  const figure = page.locator("#lei .stat .n");
  await expect(figure).toHaveText("0,03%");
  expect(await figure.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBe(140);
});

test("on a phone the steps, the figure and each step's marker stack", async ({ page }) => {
  await open(page, 390);
  await stepsInOrder(page);
  const steps = await box(page, "#lei .steps");
  const stat = await box(page, "#lei .stat");
  expect(stat.y).toBeGreaterThanOrEqual(steps.y + steps.height - 1);
  expect(Math.abs(stat.x - steps.x)).toBeLessThan(1);
  const when = await box(page, "#lei .steps li:first-child > span");
  const body = await box(page, "#lei .steps li:first-child > div");
  expect(body.y).toBeGreaterThanOrEqual(when.y + when.height - 1);
  // The figure shrinks to its floor, and the page does not scroll sideways.
  expect(
    await page.locator("#lei .stat .n").evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBe(88);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
