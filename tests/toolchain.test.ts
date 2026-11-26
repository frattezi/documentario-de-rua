import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import config from "../astro.config.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe("toolchain", () => {
  it("builds static output", () => {
    expect(config.output).toBe("static");
  });

  it("type-checks strictly", () => {
    const tsconfig = JSON.parse(readFileSync(join(root, "tsconfig.json"), "utf8"));
    expect(tsconfig.extends).toBe("astro/tsconfigs/strict");
  });

  it("serves every live image at the same path, byte for byte", () => {
    // public/ is copied verbatim to the root of dist/, so public/img/x is /img/x.
    const live = join(root, "reference/live");
    const images = files(join(live, "img")).map((f) => relative(live, f));
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(readFileSync(join(root, "public", image)).equals(readFileSync(join(live, image))), image).toBe(true);
    }
  });
});
