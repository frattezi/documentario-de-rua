# Films are a generic route over typed data, not hand-written pages

Status: accepted (2026-11-26)

The owner's briefing asks for "uma página própria" for *Entre a Lei e a Rua* — and, separately,
that the "Mais histórias da rua" section keep growing with the Project's next productions. One
hand-written page would satisfy the first request today and contradict the second one as soon as a
second Film exists: either it gets rebuilt as a template then, or the first Film's URL becomes the
odd one out while later Films live somewhere else.

So `/filmes/[slug]` is generated from `Film` data from the start, and the first Film is simply
`/filmes/entre-a-lei-e-a-rua`. A Film's "repercussão" and "exibições" are lists that render
nothing when empty, which is the normal state of a Film that has just been released.

## Consequences

- Adding a Film is a data entry, not a page. This is the point.
- `reference/live/` has no equivalent page, so the Film page cannot be pixel-compared against it.
  Its *content* is still checked against the reference, because synopsis, credits, Voices, the
  wall, the timeline and the law section all move there from the live one-pager (Spec 0002).
- The home page keeps only the Voices of that material; the rest is reachable one click away. A
  visitor who today scrolls to the law section will need that click.
