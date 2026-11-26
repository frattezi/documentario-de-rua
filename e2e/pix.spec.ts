import { expect, test, type Page } from "@playwright/test";
import { fixturePixKey, pixPort } from "./pix-fixture";

/** Loads a page with requests leaving localhost answered empty, and waits for the PIX island. */
async function open(page: Page, url: string): Promise<void> {
  await page.route(
    (u) => u.hostname !== "localhost",
    (route) => route.fulfill({ status: 204, body: "" }),
  );
  await page.goto(url);
  const island = page.locator("#apoie astro-island");
  await island.scrollIntoViewIfNeeded();
  // The island hydrates when visible; it drops `ssr` once it has.
  await expect(page.locator("#apoie astro-island:not([ssr])")).toBeAttached();
}

test.describe("with no PIX key configured", () => {
  test("the card reads a definir and the button is disabled", async ({ page }) => {
    await open(page, "/#apoie");
    await expect(page.locator("#pixkey")).toHaveText("a definir");
    const button = page.locator("#apoie").getByRole("button", { name: "Copiar chave" });
    await expect(button).toBeDisabled();
    await button.click({ force: true });
    await expect(button).toHaveText("Copiar chave");
  });
});

test.describe("with a PIX key injected in a test build", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("the button copies the key and confirms for 2.5 seconds", async ({ page }) => {
    const start = new Date("2026-11-25T12:00:00Z");
    await page.clock.install({ time: start });
    await open(page, `http://localhost:${pixPort}/#apoie`);
    // From here time moves only when the test moves it.
    await page.clock.pauseAt(new Date(start.getTime() + 60_000));
    await expect(page.locator("#pixkey")).toHaveText(fixturePixKey);

    const button = page.locator("#apoie button.btn");
    await expect(button).toBeEnabled();
    await expect(button).toHaveText("Copiar chave");
    await button.click();

    await expect(button).toHaveText("Chave copiada");
    await expect(button).toHaveClass("btn btn--done");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(fixturePixKey);

    await page.clock.runFor(2_499);
    await expect(button).toHaveText("Chave copiada");
    await page.clock.runFor(1);
    await expect(button).toHaveText("Copiar chave");
    await expect(button).toHaveClass("btn");
  });
});
