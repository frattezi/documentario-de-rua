// @ts-check
import { defineConfig } from "astro/config";

// Static output with the same paths as the live build: /index.html, /_astro/*, /img/*.
export default defineConfig({
  output: "static",
  build: { inlineStylesheets: "never" },
  compressHTML: true,
});
