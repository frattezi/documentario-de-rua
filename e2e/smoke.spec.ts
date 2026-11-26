import { expect, test } from "@playwright/test";

test("the built page loads", async ({ page }) => {
  await page.route(
    (url) => url.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Entre a Lei e a Rua — documentário");
  const image = await page.request.get("/img/thumb.jpg");
  expect(image.status()).toBe(200);
});
