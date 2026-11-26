// The Project's identity, in one place: every name, tag and link that says what this site is.
// No string here is repeated anywhere else (Spec 0002).

/** The Project's name. *Entre a Lei e a Rua* names only the Film, never the Project. */
export const projectName = "Documentário de Rua";

export const site = {
  name: projectName,
  byline: `${projectName} · Guilherme Simões`,
  title: projectName,
  description:
    "Documentário de Rua usa o audiovisual como ferramenta de transformação social: conta histórias de quem vive na rua, transforma visibilidade em solidariedade e contribui para a garantia de direitos.",
  shareImage: "/img/thumb.jpg",
  themeColor: "#0b0b0a",
  /**
   * The logo image, or null while there is none. Null renders the text wordmark, so nothing
   * waits on the artwork.
   */
  logo: null as string | null,
  /**
   * The two external forms. Null renders the button disabled with its reason, never a dead
   * link. Setting one needs no markup change.
   */
  forms: {
    production: null as string | null,
    membership: null as string | null,
  },
  /**
   * While true, the participation section carries a visible notice that its wording is not
   * settled, and the site is not deployed. Turning it off is the owner approving the copy
   * (Spec 0002, decision 14).
   */
  participateCopyIsProvisional: true,
} as const;
