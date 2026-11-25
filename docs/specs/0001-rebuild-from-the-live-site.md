# Spec 0001: Rebuild the site from the live build

Status: accepted (2026-11-25). Vocabulary: Fractory's glossary (Spec, Ticket, Run).

## Goal

The site of the documentary *Entre a Lei e a Rua* is live at
https://entre-a-lei-e-a-rua.esquerda-nas-ruas.com.br/, but its source code was lost. The owner
wants the source back: a maintainable project that builds a page a visitor cannot tell apart from
the one online today, so the site can be changed again (the PIX key, new videos) and redeployed.

The production build, mirrored into `reference/live/`, is the target. The earlier artifact draft
(`reference/design-draft.html`) only explains intent.

## Non-goals

- Redesigning the page or changing any of its copy.
- Deploying. The rebuild ends with a `dist/` that can replace what is online; how it is published
  is an open question below.
- Setting the PIX key: it is still "a definir" online and stays so.
- Adding analytics, a CMS, other pages or languages.

## Solution

Running `pnpm build` produces a static site in `dist/`: one page in Brazilian Portuguese, with
the same sections, copy, images, links, fonts, colours and responsive layout as the live page,
and the same two behaviours:

- **Player:** the hero shows the film's thumbnail with a play button and its duration (29:43).
  Clicking it swaps in the YouTube nocookie embed of video `iLqNWQIXITs`, autoplaying. Nothing
  loads from YouTube before the click.
- **PIX copy:** the support section shows the PIX key, or "a definir" with a disabled "Copiar
  chave" button while no key is set. With a key, the button copies it and reads "Chave copiada"
  for 2.5 seconds.

The sections, in order: header (credit line, section nav, YouTube and Instagram icons); hero
(title over the overpass photo, square crop under 640px; "Assista o documentário completo no
YouTube"; player; film facts; calls to subscribe, follow and donate); channel ("Mais histórias da
rua": the 11-minute video, four Shorts, three social cards); support ("Do filme para a rua", PIX
card); the film ("Ouvir quem mora na rua", synopsis and credits list); five voices; Diego's wall
with its dedication; the overpass timeline 2009–2026; the law (PL 174/2025 to Lei 12.003/2026,
the 0,03% figure, the rights list); footer credits. Title, description, Open Graph tags and theme
colour match the live `<head>`.

A visual test serves `reference/live/` and the new `dist/` side by side and compares screenshots
at 390px and 1280px wide. The rebuild is done when they match.

## User stories

1. As a visitor, I want the page to look exactly as it does today, so that nothing I knew changes.
2. As a visitor, I want every text on the page unchanged, so that the film's testimonies are quoted faithfully.
3. As a visitor on a phone, I want the same mobile layout, including the square hero crop, so that the page reads well at 390px.
4. As a visitor, I want to start the film from the page with one click, so that I watch without leaving.
5. As a visitor, I want nothing loaded from YouTube until I press play, so that the page is light and private.
6. As a visitor, I want every link (YouTube channel, videos, Shorts, Instagram profiles, section anchors) to go where it goes today, so that following the project works.
7. As a visitor, I want the PIX button disabled while there is no key, so that I never copy a wrong one.
8. As a visitor, once a key is set, I want one click to copy it and a confirmation, so that donating is easy.
9. As a visitor with reduced motion, I want the animations off, so that the page is comfortable.
10. As someone sharing the link, I want the same title, description and preview image, so that the share card is unchanged.
11. As the owner, I want the copy and lists in typed data files, so that changing a video or adding the PIX key is a one-line change.
12. As the owner, I want the PIX key in one place in configuration, so that setting it later needs no markup change.
13. As the owner, I want a test that compares the new build with the live one, so that "identical" is checked by code, not by eye.
14. As the owner, I want `pnpm build` to produce a static `dist/` with the same paths for images, so that it can replace the live files.
15. As the owner, I want the project to build and test inside the Fractory sandbox, so that Runs can build it.

## Implementation decisions

- **Stack: Astro, static output, React islands for the player and the PIX copy**, as the live
  build shows (`astro-island`, `client="visible"`, React runtime). pnpm, TypeScript strict.
- **Content module:** typed data for the header nav, the film facts and credits, the channel
  (feature video and four Shorts, each with id, title, duration and thumbnail), social links, the
  five voices (quote with its highlighted words, name, note), the timeline rows (year, Charles's
  side, Jardim Angola's side, the 2026 row spanning both), the law steps, the rights list and the
  footer. Copy is taken verbatim from `reference/live/index.html`.
- **Styles:** recovered from `reference/live/_astro/index.*.css` (de-minified and split per
  component), keeping the design tokens (`--ink`, `--paper`, `--sign`, `--tarp`, …) as CSS
  custom properties. The draft's CSS comments explain the intent.
- **Images:** copied from `reference/live/img/` to `public/img/` with the same paths.
- **Islands:**
  - `YouTubePlayer` takes `videoId`, `title`, `thumbnail`, `thumbnailAlt` and `duration`. Before
    the click it renders a button with the image, the play icon and the duration. After the
    click it renders an iframe of
    `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0` with
    `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
    and `allowFullScreen`.
  - `PixCopy` takes `pixKey: string | null`; null shows "a definir" and a disabled button.
- **Configuration:** the PIX key is read from one constant in the content module, null for now.
- **Visual test:** Playwright serves both `reference/live/` and `dist/` and screenshots each full
  page at 390×844 and 1280×800 with reduced motion and the fonts loaded. The two must match
  within a small pixel tolerance, fixed in the test.

## Testing decisions

- **Seam:** the built page. Tests read `dist/` or drive it in a browser; none test component
  internals.
- **Visual parity (main test):** the Playwright comparison above, at both widths. This is what
  says the rebuild is done.
- **Content parity:** a vitest test extracts the visible text and every `href`/`src` from
  `reference/live/index.html` and from `dist/index.html` and asserts they are equal, so copy and
  links are checked exactly, independent of pixels.
- **Behaviour:** Playwright clicks the player and asserts the iframe URL and that no request to a
  YouTube host happened before the click. It asserts the PIX button is disabled with no key and,
  with a key injected in a test build, that clicking writes it to the clipboard and shows "Chave
  copiada".
- **Head:** a test compares `<title>`, the description, the Open Graph tags and `theme-color`.

## Open questions

- **Deployment.** The live site is served by Cloudflare (static, Astro output), but how it was
  published (a Cloudflare Pages project with git integration, `wrangler pages deploy`, or
  something else) is unknown, and no Cloudflare tooling is set up on this machine. To settle
  before going live; not needed for the rebuild.
- **CI.** The repository has no CI, so Fractory merges a Run's PR without checks. Whether to add a
  workflow (and a runner) that runs the tests on each PR.
- **Pixel tolerance.** The exact threshold is set by the first Run that writes the visual test,
  low enough to catch a wrong colour or spacing, high enough for font anti-aliasing.
