import { expect, test } from "@playwright/test";
import { site } from "../src/content/site";

test("the built page loads", async ({ page }) => {
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  // The site is the Project's (Spec 0002); the Film's title names only the Film.
  await expect(page).toHaveTitle(site.title);
  const image = await page.request.get(site.shareImage);
  expect(image.status()).toBe(200);
});

test("every section of the one page is reachable by its anchor", async ({ page }) => {
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.goto("/");
  // The site stays one page (ADR 0002): each nav item scrolls, none navigates away.
  for (const id of ["sobre", "canal", "participe", "apoie", "filme", "vozes", "viaduto", "lei"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});
