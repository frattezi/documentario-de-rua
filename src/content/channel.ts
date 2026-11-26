// The channel section, "Mais histórias da rua". Copy is verbatim from reference/live/index.html.
// Adding a video is a data change: append to `shorts` (or replace `feature`) and drop its
// thumbnail in public/img/channel/.

export interface FeatureVideo {
  /** YouTube video id. */
  id: string;
  title: string;
  description: string;
  /** As shown on the badge, e.g. "11:00". */
  duration: string;
  thumbnail: string;
  thumbnailAlt: string;
}

/** A Short: a vertical YouTube Shorts piece. */
export interface Short {
  /** YouTube video id. */
  id: string;
  title: string;
  thumbnail: string;
  /** Empty when the title next to the thumbnail already describes it. */
  thumbnailAlt: string;
}

export type SocialNetwork = "youtube" | "instagram";

export interface SocialCard {
  network: SocialNetwork;
  href: string;
  handle: string;
  description: string;
  /** Call to action, e.g. "Inscrever-se". */
  action: string;
}

export const youtubeWatchUrl = (id: string): string => `https://www.youtube.com/watch?v=${id}`;
export const youtubeShortUrl = (id: string): string => `https://www.youtube.com/shorts/${id}`;

export const channelSection = {
  id: "canal",
  eyebrow: "No canal",
  heading: "Mais histórias da rua",
  allVideos: {
    label: "Ver todos os vídeos",
    href: "https://www.youtube.com/@guilhermesimoesdias/videos",
  },
  watchLabel: "Assistir no YouTube",
  shortsBadge: "Shorts",
  followHeading: "Siga o projeto",
} as const;

export const feature: FeatureVideo = {
  id: "f7amWksAY9c",
  title: "Documentário de rua: Wagner Lúcio, Jardim Angola",
  description:
    "Onze minutos com Wagner, que cuida do jardim, dos cachorros e dos vizinhos embaixo do viaduto na Avenida Antônio Carlos.",
  duration: "11:00",
  thumbnail: "/img/channel/video-f7amWksAY9c.jpg",
  thumbnailAlt: "Cena do documentário de rua sobre Wagner Lúcio no Jardim Angola",
};

export const shorts: readonly Short[] = [
  {
    id: "AvZZ9C2lMKw",
    title: "Diego era o morador mais antigo do Viaduto Angola. 10 anos no local.",
    thumbnail: "/img/channel/short-AvZZ9C2lMKw.jpg",
    thumbnailAlt: "",
  },
  {
    id: "Kgbrbiua76E",
    title: "Jéssica e Leidiane são irmãs. Vivem nas ruas desde a infância.",
    thumbnail: "/img/channel/short-Kgbrbiua76E.jpg",
    thumbnailAlt: "",
  },
  {
    id: "MSDpd7DT90w",
    title:
      "Você dorme em paz enquanto a chuva cai ou passa a noite acordado, com medo de perder tudo?",
    thumbnail: "/img/channel/short-MSDpd7DT90w.jpg",
    thumbnailAlt: "",
  },
  {
    id: "ajWlL9Wayic",
    title: "Daniel segue firme nas ruas de Belo Horizonte.",
    thumbnail: "/img/channel/short-ajWlL9Wayic.jpg",
    thumbnailAlt: "",
  },
];

export const socialCards: readonly SocialCard[] = [
  {
    network: "youtube",
    href: "https://www.youtube.com/@guilhermesimoesdias?sub_confirmation=1",
    handle: "@guilhermesimoesdias",
    description: "O filme completo e os cortes com cada personagem",
    action: "Inscrever-se",
  },
  {
    network: "instagram",
    href: "https://www.instagram.com/guilhermesimoes.rp/",
    handle: "@guilhermesimoes.rp",
    description: "O diretor, bastidores e novidades",
    action: "Seguir",
  },
  {
    network: "instagram",
    href: "https://www.instagram.com/corisco_ufmg/",
    handle: "@corisco_ufmg",
    description: "Coletivo e Pesquisa em Contexto de Risco, UFMG",
    action: "Seguir",
  },
];
