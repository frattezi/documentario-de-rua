# Documentário de Rua: agent rules

The site of **Documentário de Rua**, Guilherme Simões's ongoing documentary project about people
living on the street. It grew out of his UFMG final-year film *Entre a Lei e a Rua*, whose
one-page site is live at https://entre-a-lei-e-a-rua.esquerda-nas-ruas.com.br/ and whose source
was lost.

Vocabulary: [GLOSSARY.md](GLOSSARY.md) — Project, Film, Short, Story, Voice, Supporter,
Collaborator, Participant. Use those words in code, data and docs.

Two plans, in order:

1. [docs/specs/0001-rebuild-from-the-live-site.md](docs/specs/0001-rebuild-from-the-live-site.md)
   — recover the lost source from [reference/](reference/README.md), proven by pixel parity.
   Accepted. Builds, but is never deployed.
2. [docs/specs/0002-documentario-de-rua.md](docs/specs/0002-documentario-de-rua.md) — rename the
   project, add the presentation and the three calls to action, and expand the Film's section. The
   site stays one page ([ADR 0002](docs/adr/0002-the-site-is-one-page-and-a-film-is-a-section.md)).
   The first deploy is this one's.

## Stack

- Astro, static output, with React only for the interactive islands (YouTube player, PIX copy).
  TypeScript strict. pnpm.
- Tests: vitest for content and pure logic; Playwright for the pages themselves.
- Before committing: `pnpm check && pnpm test && pnpm build` (and `pnpm test:visual` when a page
  changes).

## Rules

- `reference/` is the fixed target: never edit it.
  - For Spec 0001 it wins over everything: the rebuild is measured against it.
  - After Spec 0001 it stays authoritative for the **Film's** content only — synopsis, credits,
    the five Voices, Diego's wall, the timeline, the law section — wherever that content now
    lives. Project-level identity (name, byline, `<title>`, Open Graph, headings) and the new
    sections are governed by Spec 0002, which deliberately departs from `reference/`.
- Site copy is Brazilian Portuguese.
  - Copy that exists in `reference/live/index.html` is reproduced verbatim. Never translate,
    reword or "fix" it.
  - New copy comes from the owner's briefing, quoted as closely as length allows, and is reviewed
    by the owner. Agents do not write or rewrite site copy on their own.
  - Code, comments, commits and docs are in English.
- The Project's name is *Documentário de Rua* everywhere on the site. *Entre a Lei e a Rua* names
  only that one Film. Spec 0001 and `reference/` keep the old name: they are records of the site
  as it was.
- Content (voices, timeline, law steps, films, shorts, credits, links) lives in typed data, not
  inline in markup.
- No new runtime dependencies, trackers or third-party scripts beyond what the live site loads
  (Google Fonts, the YouTube nocookie embed on click). Forms are external, opened in a new tab.
- Anything awaiting a fact from the owner (the PIX key, a form URL, the logo) renders a disabled
  or fallback state. Never ship a placeholder that looks real.
