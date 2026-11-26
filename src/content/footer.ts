// The footer: the Film's credits, the three profiles to follow, and the closing note.
// Copy is verbatim from reference/live/index.html.

/** One credit block: a role and who or what filled it. */
export interface Credit {
  role: string;
  value: string;
}

/** A profile drawn as a pill in the footer, with its handle as the label. */
export interface FollowLink {
  /** The pill variant: `pill--yt`, `pill--ig` or `pill--ghost`. */
  style: "yt" | "ig" | "ghost";
  icon: "yt" | "ig";
  handle: string;
  href: string;
}

export const credits: readonly Credit[] = [
  { role: "Direção, roteiro e fotografia", value: "Guilherme Simões" },
  { role: "Participantes", value: "Charles, Leidiane, Jéssica, Wagner e Diego" },
  { role: "Edição", value: "CapCut Pro e Adobe Premiere Pro" },
  {
    role: "Fontes",
    value:
      "TV Globo / MG1 (12/03/2026) e Câmara Municipal de BH, 87ª Reunião Ordinária",
  },
];

export const followLinks: readonly FollowLink[] = [
  {
    style: "yt",
    icon: "yt",
    handle: "@guilhermesimoesdias",
    href: "https://www.youtube.com/@guilhermesimoesdias?sub_confirmation=1",
  },
  {
    style: "ig",
    icon: "ig",
    handle: "@guilhermesimoes.rp",
    href: "https://www.instagram.com/guilhermesimoes.rp/",
  },
  {
    style: "ghost",
    icon: "ig",
    handle: "@corisco_ufmg",
    href: "https://www.instagram.com/corisco_ufmg/",
  },
];

/** The closing note: the Film's title and what it was made for. */
export const closing = {
  title: "Entre a Lei e a Rua",
  note:
    "Trabalho de Conclusão de Curso em Relações Públicas, Faculdade de Filosofia e Ciências Humanas, Universidade Federal de Minas Gerais.",
} as const;
