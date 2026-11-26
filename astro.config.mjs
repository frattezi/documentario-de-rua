// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const pixModule = fileURLToPath(new URL("./src/content/pix.ts", import.meta.url));

/**
 * Test builds only: when PIX_KEY_FIXTURE is set, src/content/pix.ts is replaced by a module
 * exporting that key, so the browser tests can drive the copy button without a real key ever
 * being committed. Unset (every real build), the plugin does nothing.
 * @param {string | undefined} key
 */
function pixKeyFixture(key) {
  return {
    name: "pix-key-fixture",
    enforce: /** @type {const} */ ("pre"),
    /** @param {string} id */
    load(id) {
      if (key === undefined || id.split("?")[0] !== pixModule) return null;
      return `export const pixKey = ${JSON.stringify(key)};\n`;
    },
  };
}

// Static output with the same paths as the live build: /index.html, /_astro/*, /img/*.
// React only renders the interactive islands (the YouTube player, the PIX copy).
export default defineConfig({
  output: "static",
  build: { inlineStylesheets: "never" },
  compressHTML: true,
  integrations: [react()],
  vite: { plugins: [pixKeyFixture(process.env.PIX_KEY_FIXTURE)] },
});
