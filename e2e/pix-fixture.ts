// The PIX key injected into the test build (PIX_KEY_FIXTURE, see astro.config.mjs). It is never
// part of a real build: dist/ is always built with the key in src/content/pix.ts.
export const fixturePixKey = "00020126-chave-de-teste-nao-usar";

/** Where the test build with the fixture key is served. */
export const pixPort = 4322;
