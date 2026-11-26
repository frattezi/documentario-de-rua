// The page footer: the credits, the follow buttons and the closing line.
// Copy is verbatim from reference/live/index.html.

export interface Credit {
  role: string;
  names: string;
}

export interface FollowLink {
  icon: "yt" | "ig";
  /** Button style: the network's colour, or the outlined one. */
  variant: "yt" | "ig" | "ghost";
  label: string;
  href: string;
}

export const credits: readonly Credit[] = [
  { role: "Direção, roteiro e fotografia", names: "Guilherme Simões" },
  { role: "Participantes", names: "Charles, Leidiane, Jéssica, Wagner e Diego" },
  { role: "Edição", names: "CapCut Pro e Adobe Premiere Pro" },
  {
    role: "Fontes",
    names: "TV Globo / MG1 (12/03/2026) e Câmara Municipal de BH, 87ª Reunião Ordinária",
  },
];

export const followLinks: readonly FollowLink[] = [
  {
    icon: "yt",
    variant: "yt",
    label: "@guilhermesimoesdias",
    href: "https://www.youtube.com/@guilhermesimoesdias?sub_confirmation=1",
  },
  {
    icon: "ig",
    variant: "ig",
    label: "@guilhermesimoes.rp",
    href: "https://www.instagram.com/guilhermesimoes.rp/",
  },
  {
    icon: "ig",
    variant: "ghost",
    label: "@corisco_ufmg",
    href: "https://www.instagram.com/corisco_ufmg/",
  },
];

export const footerEnd = {
  title: "Entre a Lei e a Rua",
  note: "Trabalho de Conclusão de Curso em Relações Públicas, Faculdade de Filosofia e Ciências Humanas, Universidade Federal de Minas Gerais.",
} as const;
