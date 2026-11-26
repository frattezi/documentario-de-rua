// The support section, "Do filme para a rua", and its PIX card.
// Copy is verbatim from reference/live/index.html. The key itself lives in ./pix.ts.

export interface SupportSection {
  /** The section's anchor; the hero's "Doe via PIX" call links to it. */
  id: string;
  eyebrow: string;
  heading: string;
  /** The paragraph beside the card. */
  text: string;
  /** The tag under the paragraph, while the destination of the money is being confirmed. */
  pending: string;
  /** The placeholder where the QR code will go. */
  qrPlaceholder: string;
  /** The label above the key. */
  keyLabel: string;
}

export const supportSection: SupportSection = {
  id: "apoie",
  eyebrow: "Apoie",
  heading: "Do filme para a rua",
  text:
    "Wagner busca água de carrinho todos os dias. O barraco de Charles pegou fogo e ele ficou só " +
    "com a roupa do corpo. Em breve, uma contribuição via PIX vai poder ajudar quem vive na rua em " +
    "Belo Horizonte.",
  pending: "Destino e chave em confirmação",
  qrPlaceholder: "QR Code PIX",
  keyLabel: "Chave PIX",
};

/** What the copy button and the key read, in each state. */
export const pixCopyLabels = {
  /** Shown in place of the key while none is configured. */
  noKey: "a definir",
  copy: "Copiar chave",
  copied: "Chave copiada",
} as const;

/** How long the button reads "Chave copiada" after a copy, in milliseconds. */
export const pixCopiedMs = 2500;
