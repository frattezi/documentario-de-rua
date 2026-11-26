import { expect, test, type Page, type Request } from "@playwright/test";

const EMBED = "https://www.youtube-nocookie.com/embed/iLqNWQIXITs?autoplay=1&rel=0";
const ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
const YOUTUBE_HOST =
  /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be|ytimg\.com|googlevideo\.com|ggpht\.com|ytstatic\.com)$/;

const isYouTube = (request: Request): boolean => YOUTUBE_HOST.test(new URL(request.url()).hostname);

/**
 * Loads the page recording every request. Requests leaving localhost are answered empty, so the
 * test never depends on the network; they are still recorded.
 */
async function open(page: Page): Promise<Request[]> {
  const requests: Request[] = [];
  page.on("request", (request) => requests.push(request));
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.goto("/");
  // The island hydrates when visible; it drops `ssr` once it has.
  await expect(page.locator(".player astro-island:not([ssr])")).toBeAttached();
  return requests;
}

const player = (page: Page) =>
  page.getByRole("button", { name: "Assistir Entre a Lei e a Rua (29:43)" });

test("shows the thumbnail, a play button and the duration before any click", async ({ page }) => {
  await open(page);
  const button = player(page);
  await expect(button).toBeVisible();
  await expect(button.locator("img")).toHaveAttribute("src", "/img/thumb.jpg");
  await expect(button.locator(".play svg")).toBeVisible();
  await expect(button.locator(".dur")).toHaveText("29:43");
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("requests nothing from YouTube before the click, then embeds the film", async ({ page }) => {
  const requests = await open(page);
  await page.waitForLoadState("networkidle");
  // Scroll the whole page, so lazy images and late islands get their chance to load too.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => window.scrollTo(0, 0));

  expect(requests.filter(isYouTube).map((r) => r.url())).toEqual([]);

  await player(page).click();

  const iframe = page.locator(".player iframe");
  await expect(iframe).toHaveAttribute("src", EMBED);
  await expect(iframe).toHaveAttribute("allow", ALLOW);
  await expect(iframe).toHaveAttribute("allowfullscreen", "");
  await expect(iframe).toHaveAttribute("title", "Entre a Lei e a Rua");
  await expect.poll(() => requests.filter(isYouTube).map((r) => r.url())).toContain(EMBED);
  await expect(player(page)).toHaveCount(0);
});

test("plays from the keyboard", async ({ page }) => {
  await open(page);
  await player(page).focus();
  await expect(player(page)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".player iframe")).toHaveAttribute("src", EMBED);
});

test("reaches the player with Tab", async ({ page }) => {
  await open(page);
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    if (await player(page).evaluate((el) => el === document.activeElement)) break;
  }
  await expect(player(page)).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.locator(".player iframe")).toHaveAttribute("src", EMBED);
});

for (const { width, height, crop } of [
  { width: 390, height: 844, crop: "/img/overpass-sq.jpg" },
  { width: 1280, height: 800, crop: "/img/overpass.jpg" },
]) {
  test(`shows the ${crop} crop of the overpass at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page);
    const photo = page.locator(".ov__photo img");
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname))
      .toBe(crop);
    const box = await page.locator(".ov").boundingBox();
    if (width <= 640) expect(Math.round(box!.height)).toBe(Math.round(box!.width));
    else expect(box!.height).toBeLessThan(box!.width);
  });
}
