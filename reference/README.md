# Reference

The site's source code was lost. These files are what survives, and the rebuild is measured
against them.

- `live/`: the production build mirrored from
  https://entre-a-lei-e-a-rua.esquerda-nas-ruas.com.br/ on 2026-11-25 (Astro output: `index.html`,
  `_astro/` CSS and island JS, `img/`, `robots.txt`). **This is the source of truth.** Serve it
  with any static server to compare: `npx serve reference/live`.
- `design-draft.html`: an earlier single-file design from a Claude artifact. Older than the live
  site (it links a different video, among other differences). Use it only to read intent, such as
  the CSS comments; where it and `live/` disagree, `live/` wins.

Never edit these files: they are the fixed target.
