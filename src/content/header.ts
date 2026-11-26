// The page header: the credit line, the section nav and the social icons.
// Copy is verbatim from reference/live/index.html.

export interface NavItem {
  label: string;
  /** In-page anchor of the section, e.g. "#canal". */
  href: string;
}

export interface IconLink {
  icon: "yt" | "ig";
  /** Accessible name of the icon-only link. */
  label: string;
  href: string;
}

export const byline = "Guilherme Simões · UFMG · 2026";

export const navLabel = "Seções";

export const navItems: readonly NavItem[] = [
  { label: "Assista", href: "#canal" },
  { label: "Apoie", href: "#apoie" },
  { label: "O filme", href: "#filme" },
  { label: "Vozes", href: "#vozes" },
  { label: "A lei", href: "#lei" },
];

export const headerIcons: readonly IconLink[] = [
  { icon: "yt", label: "YouTube", href: "https://www.youtube.com/@guilhermesimoesdias" },
  { icon: "ig", label: "Instagram", href: "https://www.instagram.com/guilhermesimoes.rp/" },
];
