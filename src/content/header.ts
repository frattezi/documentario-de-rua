// The header: the Project's mark, the byline, the section nav and the two social icons.
//
// The nav is anchors only: the site is one page (ADR 0002). Every section name is the one
// already published; "Sobre" is the only new item, because #sobre is a new section.

/** A nav item. Every one is an anchor on this page. */
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

export const nav: readonly NavItem[] = [
  { label: "Sobre", href: "#sobre" },
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
