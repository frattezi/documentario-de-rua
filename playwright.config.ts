import { defineConfig, devices } from "@playwright/test";
import { fixturePixKey, pixPort } from "./e2e/pix-fixture";

// Browser tests drive the built page: `pnpm build` first, then this serves dist/.
// A second build with a fixture PIX key (dist-pix/) is made and served here for the copy tests.
const port = 4321;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${port}`, ...devices["Desktop Chrome"] },
  webServer: [
    {
      command: `pnpm exec astro preview --port ${port} --ignore-lock`,
      url: `http://localhost:${port}/`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        `pnpm exec astro build --outDir dist-pix && ` +
        `pnpm exec astro preview --outDir dist-pix --port ${pixPort} --ignore-lock`,
      url: `http://localhost:${pixPort}/`,
      env: { PIX_KEY_FIXTURE: fixturePixKey },
      timeout: 180_000,
      reuseExistingServer: false,
    },
  ],
});
