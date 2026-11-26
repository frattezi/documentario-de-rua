// The hero: the Film's title over the overpass photo, its player, its facts and the three calls.
// Copy is verbatim from reference/live/index.html.

/** The overpass photo behind the title, in its two crops. */
export interface HeroPhoto {
  /** The wide crop, shown above 640px. */
  wide: { src: string; width: number; height: number };
  /** The square crop, shown at 640px and below. */
  square: { src: string; width: number; height: number };
  /** The media query that switches to the square crop. */
  squareMedia: string;
}

/** What the YouTube player island needs to show the Film and then play it. */
export interface FilmVideo {
  /** YouTube video id. */
  videoId: string;
  /** The Film's title, used in the player's accessible name and the iframe title. */
  title: string;
  thumbnail: string;
  thumbnailAlt: string;
  /** As shown on the thumbnail, e.g. "29:43". */
  duration: string;
}

/** The line under the player: what the Film is, then where and when it was made. */
export interface FilmFacts {
  kind: string;
  place: string;
}

/** A call to action under the player, drawn as a pill. External calls open in a new tab. */
export interface HeroCall {
  /** The pill variant: `pill--yt`, `pill--ig` or `pill--pix`. */
  style: "yt" | "ig" | "pix";
  /** The logo from the icon sprite shown before the label, if any. */
  icon?: "yt" | "ig";
  label: string;
  href: string;
  external: boolean;
}

export const heroTitle = {
  /** The accessible name of the h1. */
  label: "Entre a Lei e a Rua",
  /** The two lines of the title treatment. */
  lines: ["Entre a Lei", "e a Rua"],
  tag: {
    start: "Viaduto Angola",
    /** Hidden on narrow screens. */
    optional: " · Av. Antônio Carlos",
    end: " · Belo Horizonte",
  },
} as const;

export const heroPhoto: HeroPhoto = {
  wide: { src: "/img/overpass.jpg", width: 1920, height: 880 },
  square: { src: "/img/overpass-sq.jpg", width: 880, height: 880 },
  squareMedia: "(max-width: 640px)",
};

export const watchLine = "Assista o documentário completo no YouTube";

export const filmVideo: FilmVideo = {
  videoId: "iLqNWQIXITs",
  title: "Entre a Lei e a Rua",
  thumbnail: "/img/thumb.jpg",
  thumbnailAlt: "Wagner em frente à lona azul do Jardim Angola, sob o viaduto, com o título do filme",
  duration: "29:43",
};

export const filmFacts: FilmFacts = {
  kind: "Curta-metragem documental · 30 min",
  place: "Belo Horizonte, MG · Gravado em maio de 2025",
};

export const heroCalls: readonly HeroCall[] = [
  {
    style: "yt",
    icon: "yt",
    label: "Inscreva-se no canal",
    href: "https://www.youtube.com/@guilhermesimoesdias?sub_confirmation=1",
    external: true,
  },
  {
    style: "ig",
    icon: "ig",
    label: "Siga no Instagram",
    href: "https://www.instagram.com/guilhermesimoes.rp/",
    external: true,
  },
  { style: "pix", label: "Doe via PIX", href: "#apoie", external: false },
];
