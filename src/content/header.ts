// The header: the byline, the section nav and the two social icons.
// Copy is verbatim from reference/live/index.html.

/** A nav item. Every one is an anchor on this page: the site is one page (ADR 0002). */
export interface NavItem {
  label: string;
  /** The id it scrolls to, with its hash. */
  href: string;
}

/** A social profile drawn as an icon in the header. */
export interface SocialIcon {
  /** The logo from the icon sprite. */
  icon: "yt" | "ig";
  /** The accessible name, since the link has no text. */
  label: string;
  href: string;
}

export const byline = "Guilherme Simões · UFMG · 2026";

export const nav: readonly NavItem[] = [
  { label: "Assista", href: "#canal" },
  { label: "Apoie", href: "#apoie" },
  { label: "O filme", href: "#filme" },
  { label: "Vozes", href: "#vozes" },
  { label: "A lei", href: "#lei" },
];

export const navLabel = "Seções";

export const socialIcons: readonly SocialIcon[] = [
  { icon: "yt", label: "YouTube", href: "https://www.youtube.com/@guilhermesimoesdias" },
  { icon: "ig", label: "Instagram", href: "https://www.instagram.com/guilhermesimoes.rp/" },
];
