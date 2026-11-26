# Spec 0002: Documentário de Rua

Status: amended draft (2026-11-26), awaiting the Spec Gate. First accepted 2026-11-26 (commit
`fc56a1e`); amended the same day for the owner's decisions 12 and 14, which reverse what the
accepted version specified. Vocabulary: [GLOSSARY.md](../../GLOSSARY.md) and Fractory's (Spec,
Ticket, Run). Follows [Spec 0001](0001-rebuild-from-the-live-site.md), which must be built and
passing its parity gate first.

## What changed in this amendment

- **Decision 12 — no new page.** The site stays a single page. The briefing's "abas" are nav
  anchors that scroll to sections, and the sections keep the names they carry online. The accepted
  version moved the Film's content to `/filmes/entre-a-lei-e-a-rua`; that route is gone. See
  [ADR 0002](../adr/0002-the-site-is-one-page-and-a-film-is-a-section.md), which supersedes
  [ADR 0001](../adr/0001-films-are-a-route-over-data.md).
- **Decision 12's consequence for briefing item 8.** The Film's production information, history,
  synopsis, repercussão and the spaces where it is being shown expand the existing `#filme`
  section in place, rather than filling a page of its own.
- **Decision 14 — the donation copy waits.** The `#participe` section is built at full visual
  quality so the owner can judge the design, with its wording visibly marked as provisional, and
  it must not be deployed in that state.

## Goal

The site stops being a showcase for one film and becomes the Project's site: a place to be
presented to *Documentário de Rua*, watch its Stories, and then take part — by helping produce,
by donating, or by joining. The owner's words: "que ele não seja apenas uma vitrine das produções,
mas também um espaço de mobilização, participação e apoio ao projeto."

The Project is renamed throughout. *Entre a Lei e a Rua* keeps its prominence as the featured
Film, in a section of the one page that grows to hold everything the briefing asks about it.

## Non-goals

- Redesigning. The owner likes the visual result; this Spec changes words and sections, not the
  design language. The hero photo, typography, tokens and components stay.
- Rewriting the Film's content. The synopsis, credits, five Voices, Diego's wall, the timeline and
  the law section keep every character they have online.
- Adding routes. One page, as it is today. See ADR 0002.
- Building forms. Forms are external and linked; this Spec only places the buttons.
- Choosing a domain. Separate decision; see Open questions.
- A CMS. Content stays typed data.
- Settling the donation wording. Decision 14 holds it; this Spec builds the section's shape.

## Solution

### Identity

*Documentário de Rua* is the site's name everywhere: `<title>`, Open Graph, the header byline, the
hero. The byline becomes `Documentário de Rua · Guilherme Simões`; UFMG and 2026 move into the
`#filme` section, where they are accurate. The header takes a logo slot that falls back to a text
wordmark, so nothing waits on the artwork.

The hero keeps the overpass photo, the two-line title treatment and the location tag exactly as
built; only the words change, to *Documentário de Rua*. *Entre a Lei e a Rua* is named immediately
below, where the player already sits — "Assista o documentário completo no YouTube" is unchanged.

### Sections

One page, in this order. Every section name is the one already published; the new sections are the
only new names.

1. Header — logo/wordmark, byline, nav of anchors, YouTube and Instagram icons.
2. Hero — photo, Project title, the featured Film's player, film facts, the existing pills.
3. `#sobre` — the presentation (new copy below). New section.
4. `#canal` — "Mais histórias da rua", unchanged: the 11-minute video, four Shorts, three social
   cards, and the call to subscribe.
5. `#participe` — one section holding the three calls to action, with `#ajude`, `#apoie` and
   `#faca-parte` as anchors inside it. New section, and the one decision 14 holds.
6. `#filme` — "Ouvir quem mora na rua", expanded: the synopsis and credits as published, plus the
   Film's production information, its history, its repercussão and the spaces where it is being
   shown. The last two render nothing while empty.
7. `#vozes` — the five Voices, unchanged.
8. `#viaduto` — Diego's wall and the 2009–2026 timeline, unchanged.
9. `#lei` — the law section, unchanged.
10. Footer — credits, as built, renamed.

Nothing moves out of the page, so `#canal`, `#apoie`, `#filme`, `#vozes`, `#viaduto` and `#lei`
all keep working for anyone who saved a deep link.

### New copy (pt-BR, for the owner's review)

Quoted from the briefing, cut to length, not reworded.

**`#sobre` — "O que é o Documentário de Rua"**

> O projeto surgiu a partir do lançamento do documentário de TCC de Guilherme Simões, *Entre a Lei
> e a Rua*, e hoje continua utilizando o audiovisual como ferramenta de transformação social.
>
> A proposta é contar histórias, expor realidades muitas vezes invisibilizadas e transformar
> visibilidade em solidariedade, contribuindo também para a garantia de direitos das pessoas que
> participam do projeto.

**`#ajude` — "Ajude a produzir mais histórias de rua com Guilherme"**

> Quer ajudar a fazer as próximas produções? Câmera, edição, som — ou uma história que precisa ser
> contada. Preencha o formulário e vamos conversar.

Button: "Quero ajudar a produzir" → production form. Disabled while no URL is set.

**`#apoie` — "Doe para o Documentário de Rua e ajude a transformar visibilidade em solidariedade"**

> Sua contribuição mantém o trabalho audiovisual, amplia as produções e fortalece as ações de
> transformação social e de garantia de direitos das pessoas que fazem parte do projeto.

PIX card as built: key or "a definir" with the button disabled.

**`#faca-parte` — "Faça parte do Documentário de Rua"**

> O Documentário de Rua é uma construção coletiva. Inscreva-se para participar das ações do
> projeto.

Button: "Quero fazer parte" → membership form. Disabled while no URL is set.

### `#participe` is a preview until the owner fixes the words — decision 14

The three calls to action are built at full visual quality: real layout, real type, real spacing,
the drafts above in place as the copy. The owner judges the design from the real thing, then
replaces the wording.

So the section carries an unmissable marker saying its copy is still to be confirmed, in the page
itself and not only in a comment. The marker is a one-line change to remove, and the build is not
deployed while it is there. That marker going away is the owner approving the words.

### What the donation funds — needs the owner's confirmation

The live `#apoie` promises the money to the people on the street: "Wagner busca água de carrinho
todos os dias. O barraco de Charles pegou fogo e ele ficou só com a roupa do corpo. Em breve, uma
contribuição via PIX vai poder ajudar quem vive na rua em Belo Horizonte", under "Destino e chave
em confirmação". The briefing promises it to the productions. Those are different promises to the
same donor, and the first is already published with Wagner's and Charles's names on it.

This Spec takes the briefing's framing: the PIX funds the Project, and the Wagner/Charles sentences
leave the ask and stay where they belong, among the Voices. One line keeps the link explicit — the
productions exist to secure those people's rights. **Guilherme confirms this before the first
deploy.** It is one paragraph of data to change if he decides the PIX reaches the people directly,
or splits. Decision 14 is why the section can be built and seen before this is answered.

## User stories

1. As a visitor, I want the site to tell me what Documentário de Rua is before it asks me for
   anything, so that I know what I would be supporting.
2. As a visitor, I want *Entre a Lei e a Rua* still front and centre, so that the film I came for
   is at the top.
3. As a visitor, I want the film's section to go deeper than the trailer — how it was made, its
   synopsis, its repercussion, where it is being shown — without leaving the page.
4. As a visitor, I want the nav to scroll me to a section rather than load a page, so that I never
   lose my place.
5. As a visitor who wants to help make films, I want a form for that, so that I can offer my work.
6. As a visitor who wants to donate, I want to know what my money does, so that I give knowingly.
7. As a visitor who wants to join the project, I want a form for that, so that I can take part
   without owning a camera.
8. As a visitor, I want the five Voices still on the page, so that the people the project is about
   are not behind a click.
9. As someone who shared any link into this site, including a deep link to a section, I want it to
   keep working and keep its preview, so that nothing I posted breaks.
10. As a visitor on a phone, I want the nav to still read at 390px, so that the header is usable.
11. As the owner, I want the forms, the PIX key and the logo to be one-line changes, so that I can
    set them when they exist without touching markup.
12. As the owner, I want the film's testimonies provably unchanged, so that nobody "improves" them
    while the page is reorganised.
13. As the owner, I want to see the participation section built for real before I settle its
    wording, so that I judge the design and the words separately.
14. As the owner, I want it impossible to deploy while that wording is provisional, so that a
    draft never goes out as a promise.
15. As the owner, I want nothing deployed until I have seen it, so that the rename goes out when I
    say so.

## Implementation decisions

- **Route:** `/` only, static. See ADR 0002.
- **Film data:** `Film` stays typed data with title, synopsis, credits, production information,
  history, repercussão and exibições. Repercussão and exibições render nothing while empty. The
  data shape is what survives from ADR 0001; only its rendering target changed.
- **Rename:** the Project name, byline, `<title>`, Open Graph and `theme-color` come from one
  `site.ts` constant block, so no string is repeated.
- **Share card:** one card, the Project's. There is no second page to give one to.
- **Logo:** a `Wordmark` component renders the logo image when `site.logo` is set and the text
  wordmark otherwise. Same fallback pattern as the PIX key.
- **Forms:** `site.forms.production` and `site.forms.membership`, each `string | null`. A null URL
  renders the button disabled with the reason, never a dead link. Opened with
  `target="_blank" rel="noopener"`. No form library, no backend — see `AGENTS.md`.
- **Anchors:** every id the live page has is kept, `#apoie` included, now inside `#participe`. The
  hero's existing "Doe via PIX" pill still lands on the donation card. No redirect script is
  needed, because nothing moved.
- **Nav:** anchors only, smooth-scrolling where the visitor has not asked for reduced motion. Its
  composition is an open question below: the published nav is five items and this Spec adds two
  sections.
- **Provisional marker:** one flag in `site.ts` turns the `#participe` draft notice on. While it
  is on, the build is not deployed. Turning it off is the owner's approval of the copy.
- **Moved content:** nothing moves between pages, so the Film's content keeps its section and its
  markup. `#filme` gains blocks; it does not get rebuilt.
- **Sandbox:** `sandcastle:documentario-de-rua`, same Dockerfile.

## Testing decisions

- **Content parity (the important one):** the vitest test from Spec 0001 keeps comparing one page
  with `reference/live/index.html`, now with an explicit allowlist: the Project name, the byline,
  `<title>`, the Open Graph tags, the `#apoie` paragraph, and the new `#sobre`, `#participe` and
  expanded-`#filme` blocks. Everything outside the allowlist must still be byte-identical. The
  allowlist is the diff, reviewed in the PR. This is what protects the testimonies.
- **Visual parity against the reference is retired** once this Spec lands, and replaced by
  Playwright screenshot baselines of the one page at 390×844 and 1280×800, captured when this
  Spec's first Run is approved.
- **Anchors:** a test asserts that every id the live page carries still exists in the build, so no
  deep link breaks.
- **Disabled states:** tests that with no PIX key, no production form URL and no membership form
  URL, each control renders disabled with its reason, and that with values injected each works.
- **Provisional marker:** a test asserts the notice renders while the flag is on and disappears
  when it is off, so neither state can be shipped by accident.
- **Empty Film lists:** a test asserts repercussão and exibições render nothing when their data is
  empty, and render when it is not.
- **Privacy:** the Spec 0001 test still holds — no request to a YouTube host before the click.
- **Head:** the page's `<title>`, description and OG image are the Project's.

## Open questions

- **The nav's composition.** The published nav is "Assista, Apoie, O filme, Vozes, A lei" — five
  items, which already fills the header at 390px. This Spec adds `#sobre` and folds `#apoie` into
  `#participe`. Keeping every name and adding "Sobre" makes six. The likely answer is "Sobre,
  Assista, Participe, O filme, Vozes, A lei" with "Apoie" becoming "Participe", but that renames a
  nav item, which decision 12 said not to do. **Owner to settle at the Spec Gate.**
- **The donation's destination.** Above. Blocks the first deploy, nothing else.
- **The PIX key.** Still unset. Ships disabled.
- **The two form URLs.** Owner creates them; ship disabled until then.
- **The logo.** In progress with Mari. Ships as the text wordmark.
- **The domain.** `entre-a-lei-e-a-rua.esquerda-nas-ruas.com.br` is wrong for the Project. A new
  hostname with the old one redirecting, decided in an ADR when picked. Inherited from Spec 0001's
  deployment question, still open.
- **A second Film.** ADR 0002 does not decide where it goes. Not needed until one exists.

## Resolved since the accepted version

- **"Mais histórias da rua" vs "de rua".** The live heading says *da*; the briefing writes *de*.
  Decision 12 keeps the published names, so it stays *da*.
