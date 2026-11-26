// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Static output with the same paths as the live build: /index.html, /_astro/*, /img/*.
// React only renders the interactive islands (the YouTube player).
export default defineConfig({
  output: "static",
  build: { inlineStylesheets: "never" },
  compressHTML: true,
  integrations: [react()],
});
