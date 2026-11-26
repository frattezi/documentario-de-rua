import { defineConfig, devices } from "@playwright/test";

// Browser tests drive the built page: `pnpm build` first, then this serves dist/.
const port = 4321;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${port}`, ...devices["Desktop Chrome"] },
  webServer: {
    command: `pnpm exec astro preview --port ${port} --ignore-lock`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env.CI,
  },
});
