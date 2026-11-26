# The site is one page, and a Film is a section of it

Status: accepted (2026-11-26). Supersedes
[ADR 0001](0001-films-are-a-route-over-data.md).

ADR 0001 read the briefing's "uma página própria" for *Entre a Lei e a Rua* as a route, and chose
`/filmes/[slug]` generated from `Film` data so that the second Film would not need the page
rebuilt. The owner has since decided the opposite: the site stays a **single page**, the briefing's
"abas" are nav anchors that scroll to sections, and the sections keep the names they carry online
— "O filme", "Vozes", "A lei", "Mais histórias da rua".

The decision is the owner's and is about how the site should feel, not about how the data is
shaped: one page that a visitor scrolls, where the Film they came for is a scroll away rather than
a click away, and where no name they have already seen changes.

ADR 0001 is superseded rather than edited: it records a decision that was genuinely made, acted on
in Spec 0002, and then reversed.

## What survives from ADR 0001

The `Film` type. A Film is still a Film in the Project's model (`GLOSSARY.md`), still typed data
with a title, synopsis, credits and screenings, and a second Film is still a data entry. What
changes is only where that data renders: into the `#filme` section of the one page, not into a
route of its own. "Repercussão" and "exibições" remain lists that render nothing while empty,
which is the normal state of a Film just released.

## Consequences

- There is one route, `/`. No `/filmes/[slug]`, no second share card, no second set of visual
  baselines.
- The `#filme`, `#viaduto`, `#lei` and `#vozes` anchors never leave the page, so every deep link
  that exists today keeps landing where it landed. The old-anchor problem ADR 0001 created
  disappears with it, and no redirect script is needed.
- Spec 0001's whole-page comparison against `reference/live/index.html` stays a like-for-like
  comparison: one page against one page, with no content split across routes to recombine.
- The Film's extra material from the briefing — production information, its history, repercussão
  and the spaces where it is being shown — expands `#filme` in place rather than filling a page.
  A section that grows long is the cost of this decision, and is accepted.
- A second Film will need a decision this ADR does not make: whether it becomes another section,
  an entry in "Mais histórias da rua", or the moment the Project revisits routing. Nothing here
  forecloses it, because the data stays typed.
