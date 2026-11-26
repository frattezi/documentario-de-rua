# Spec 0002: Documentário de Rua

Status: accepted (2026-11-26). Vocabulary: [GLOSSARY.md](../../GLOSSARY.md) and Fractory's (Spec,
Ticket, Run). Follows [Spec 0001](0001-rebuild-from-the-live-site.md), which must be built and
passing its parity gate first.

## Goal

The site stops being a showcase for one film and becomes the Project's site: a place to be
presented to *Documentário de Rua*, watch its Stories, and then take part — by helping produce,
by donating, or by joining. The owner's words: "que ele não seja apenas uma vitrine das produções,
mas também um espaço de mobilização, participação e apoio ao projeto."

The Project is renamed throughout. *Entre a Lei e a Rua* keeps its prominence as the featured
Film and gains a page of its own.

## Non-goals

- Redesigning. The owner likes the visual result; this Spec changes words, sections and routes,
  not the design language. The hero photo, typography, tokens and components stay.
- Rewriting the Film's content. The synopsis, credits, five Voices, Diego's wall, the timeline and
  the law section move pages without a character changing.
- Building forms. Forms are external and linked; this Spec only places the buttons.
- Choosing a domain. Separate decision; see Open questions.
- A CMS. Content stays typed data.

## Solution

### Identity

*Documentário de Rua* is the site's name everywhere: `<title>`, Open Graph, the header byline, the
hero. The byline becomes `Documentário de Rua · Guilherme Simões`; UFMG and 2026 move to the Film
page, where they are accurate. The header takes a logo slot that falls back to a text wordmark, so
nothing waits on the artwork.

The hero keeps the overpass photo, the two-line title treatment and the location tag exactly as
built; only the words change, to *Documentário de Rua*. *Entre a Lei e a Rua* is named immediately
below, where the player already sits — "Assista o documentário completo no YouTube" is unchanged.

### Pages

**Home**, in order:

1. Header — logo/wordmark, byline, nav (`Sobre, Assista, Participe, O filme`), YouTube and
   Instagram icons.
2. Hero — photo, Project title, the featured Film's player, film facts, the existing pills.
3. `#sobre` — the presentation (new copy below).
4. `#canal` — "Mais histórias da rua", unchanged: the 11-minute video, four Shorts, three social
   cards, and the call to subscribe.
5. `#participe` — one section holding the three calls to action side by side, with `#ajude`,
   `#apoie` and `#faca-parte` as anchors inside it.
6. `#vozes` — the five Voices, unchanged, kept on the home page.
7. Footer — credits, as built, renamed.

**`/filmes/entre-a-lei-e-a-rua`** — the Film page: the old `<title>`, description and `thumb.jpg`
as its own share card; synopsis and credits (from `#filme`), Diego's wall and the 2009–2026
timeline (from `#viaduto`), the law section (from `#lei`), plus "repercussão" and "exibições" as
lists that render nothing while empty. Generated from `Film` data — see
[ADR 0001](../adr/0001-films-are-a-route-over-data.md).

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
or splits.

## User stories

1. As a visitor, I want the site to tell me what Documentário de Rua is before it asks me for
   anything, so that I know what I would be supporting.
2. As a visitor, I want *Entre a Lei e a Rua* still front and centre, so that the film I came for
   is one click from the top.
3. As a visitor, I want a page about the film — how it was made, its synopsis, its repercussion,
   where it is being shown — so that I can go deeper than the trailer.
4. As a visitor who wants to help make films, I want a form for that, so that I can offer my work.
5. As a visitor who wants to donate, I want to know what my money does, so that I give knowingly.
6. As a visitor who wants to join the project, I want a form for that, so that I can take part
   without owning a camera.
7. As a visitor, I want the five Voices still on the home page, so that the people the project is
   about are not one click away.
8. As someone who shares the old link, I want it to keep working and keep its preview, so that
   nothing I posted breaks.
9. As a visitor on a phone, I want a nav of four items, so that the header still reads at 390px.
10. As the owner, I want the forms, the PIX key and the logo to be one-line changes, so that I can
    set them when they exist without touching markup.
11. As the owner, I want the film's testimonies provably unchanged after moving pages, so that
    nobody "improves" them in transit.
12. As the owner, I want nothing deployed until I have seen it, so that the rename goes out when I
    say so.

## Implementation decisions

- **Routes:** `/` and `/filmes/[slug]`, static. `src/content/films.ts` holds `Film` data; the first
  entry is `entre-a-lei-e-a-rua`.
- **Rename:** the Project name, byline, `<title>`, Open Graph and `theme-color` come from one
  `site.ts` constant block, so no string is repeated.
- **Logo:** `src/components/Wordmark.astro` renders the logo image when
  `site.logo` is set and the text wordmark otherwise. Same fallback pattern as the PIX key.
- **Forms:** `site.forms.production` and `site.forms.membership`, each `string | null`. A null URL
  renders the button disabled with the reason, never a dead link. Opened with
  `target="_blank" rel="noopener"`. No form library, no backend — see `AGENTS.md`.
- **Moved content:** the data modules for synopsis, credits, Voices, wall, timeline and law steps
  are unchanged; only which page imports them changes. The home page owns the Voices; the Film page
  does not repeat them.
- **Anchors:** `#apoie` keeps its id so the hero's existing "Doe via PIX" pill and any shared link
  still land on the donation card, now inside `#participe`.
- **Old anchors:** `#filme`, `#viaduto` and `#lei` leave the home page. The Film page carries
  those same ids, and the nav item "O filme" links to it. No client-side redirect for them: it
  would mean shipping a script to rescue deep links that are barely shared, while the links that
  *are* shared — the site itself and `#apoie` — keep working. A visitor following an old `#lei`
  link lands on the home page top.
- **Sandbox:** `sandcastle:documentario-de-rua`, same Dockerfile.

## Testing decisions

- **Content parity (the important one):** the vitest test from Spec 0001 is re-pointed — it asserts
  that the Film's copy and hrefs in the new build (home + Film page, combined) are byte-identical
  to `reference/live/index.html` for everything except an explicit allowlist: the Project name, the
  byline, `<title>`, the Open Graph tags, and the `#apoie` paragraph. The allowlist is the diff,
  reviewed in the PR. This is what protects the testimonies.
- **Visual parity is retired** to Playwright screenshot baselines of both pages at 390×844 and
  1280×800, captured once this Spec's first Run is approved.
- **Disabled states:** tests that with no PIX key, no production form URL and no membership form
  URL, each control renders disabled with its reason, and that with values injected each works.
- **Privacy:** the Spec 0001 test still holds — no request to a YouTube host before the click, on
  both pages.
- **Head:** the Film page's `<title>`, description and OG image equal the live site's; the home
  page's are the Project's.

## Open questions

- **The donation's destination.** Above. Blocks the first deploy, nothing else.
- **The PIX key.** Still unset. Ships disabled.
- **The two form URLs.** Owner creates them; ship disabled until then.
- **The logo.** In progress with Mari. Ships as the text wordmark.
- **The domain.** `entre-a-lei-e-a-rua.esquerda-nas-ruas.com.br` is wrong for the Project. A new
  hostname with the old one redirecting, decided in an ADR when picked. Inherited from Spec 0001's
  deployment question, still open.
- **"Mais histórias da rua" vs "de rua".** The live heading says *da*; the briefing writes *de*.
  Kept as published; owner to confirm.
