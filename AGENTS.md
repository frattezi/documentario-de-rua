# Entre a Lei e a Rua: agent rules

The one-page site of the documentary *Entre a Lei e a Rua* (Guilherme Simões, UFMG, 2026), live at
https://entre-a-lei-e-a-rua.esquerda-nas-ruas.com.br/. Its source was lost; it is being rebuilt
from the production build in [reference/](reference/README.md). Plan:
[docs/specs/0001-rebuild-from-the-live-site.md](docs/specs/0001-rebuild-from-the-live-site.md).

## Stack

- Astro, static output, with React only for the two interactive islands (YouTube player, PIX
  copy). TypeScript strict. pnpm.
- Tests: vitest for content and pure logic; Playwright for the page itself.
- Before committing: `pnpm check && pnpm test && pnpm build` (and `pnpm test:visual` when the page
  changes).

## Rules

- `reference/` is the fixed target: never edit it. Where it and anything else disagree, it wins.
- Site copy is Brazilian Portuguese and is copied verbatim from `reference/live/index.html`. Never
  translate, reword or "fix" it. Code, comments, commits and docs are in English.
- Content (voices, timeline, law steps, videos, credits, links) lives in typed data, not inline
  in markup.
- No new runtime dependencies, trackers or third-party scripts beyond what the live site loads
  (Google Fonts, the YouTube nocookie embed on click).
