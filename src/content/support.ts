// The support section: what the PIX is for, and the key itself.
// Copy is verbatim from reference/live/index.html.

export const support = {
  eyebrow: "Apoie",
  heading: "Do filme para a rua",
  body:
    "Wagner busca água de carrinho todos os dias. O barraco de Charles pegou fogo e ele ficou só com a roupa do corpo. Em breve, uma contribuição via PIX vai poder ajudar quem vive na rua em Belo Horizonte.",
  /** Shown while the destination and the key are both unconfirmed. */
  pending: "Destino e chave em confirmação",
  qrLabel: "QR Code PIX",
  keyLabel: "Chave PIX",
} as const;

/**
 * The PIX key, or null while there is none. Null renders "a definir" with the copy button
 * disabled, so a visitor can never copy a wrong key. Setting it needs no markup change.
 */
export const pixKey: string | null = null;
