// The Film: Entre a Lei e a Rua. Its synopsis and credits are verbatim from
// reference/live/index.html. The production notes, history, repercussão and exibições are the
// Film's own data (ADR 0002) and render nothing while empty, which is their normal state until
// the owner supplies them.

/** One line of the credits list: a role and who or what filled it. */
export interface FilmCredit {
  role: string;
  value: string;
}

/** A mention of the Film somewhere else: press, a festival, a screening write-up. */
export interface Repercussion {
  outlet: string;
  title: string;
  href: string;
}

/** A place and date where the Film is being shown. */
export interface Screening {
  place: string;
  when: string;
}

export const film = {
  eyebrow: "Sobre o filme",
  heading: "Ouvir quem mora na rua",
  synopsis:
    "Em 2025, a Câmara Municipal de Belo Horizonte votou o PL 174/2025, que autoriza a internação involuntária de pessoas em situação de rua usuárias de drogas. O diretor acompanhou audiências e plenárias e viu que a proposta não tinha interesse em dialogar com quem mora na rua. Então foi até o Viaduto Angola e a Avenida dos Andradas para ouvir Jéssica, Leidiane, Charles, Wagner e Diego.",
} as const;

export const filmCredits: readonly FilmCredit[] = [
  { role: "Direção", value: "Guilherme Simões" },
  { role: "Orientação", value: "Prof.ª Dra. Luciana de Oliveira" },
  { role: "Realização", value: "Relações Públicas, FAFICH/UFMG, com o Corisco" },
  { role: "Câmera", value: "iPhone 14 e lapela BOYA BY-M1" },
];

/** Where the Film has been mentioned. Empty until the owner has something to list. */
export const repercussion: readonly Repercussion[] = [];

/** Where the Film is being shown. Empty until the owner has something to list. */
export const screenings: readonly Screening[] = [];
