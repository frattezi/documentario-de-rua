// The three calls to action. Copy is quoted from the owner's briefing (Spec 0002).
//
// The wording is NOT settled: the owner asked for the section to be built so he can judge the
// design, and will fix the words afterwards (decision 14). While
// `site.participateCopyIsProvisional` is true the section says so on the page, and the site is
// not deployed.

/** Which control a call renders: an external form, or the PIX card. */
export type CallKind = "form" | "pix";

/** One call to action inside the participation section. */
export interface Call {
  /** The anchor id, kept from the live page where there was one. */
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  kind: CallKind;
  /** The button's label, for a form call. */
  action?: string;
  /** Which form URL in `site.forms` this call opens. */
  form?: "production" | "membership";
}

export const participate = {
  eyebrow: "Participe",
  heading: "Faça parte do Documentário de Rua",
  /** Shown while the wording is still the owner's to settle. */
  provisionalNotice:
    "Prévia: os textos desta seção ainda serão definidos pelo projeto. O site não é publicado neste estado.",
} as const;

export const calls: readonly Call[] = [
  {
    id: "ajude",
    eyebrow: "Ajude a produzir",
    heading: "Ajude a produzir mais histórias de rua com Guilherme",
    body:
      "Quer ajudar a fazer as próximas produções? Câmera, edição, som — ou uma história que precisa ser contada. Preencha o formulário e vamos conversar.",
    kind: "form",
    action: "Quero ajudar a produzir",
    form: "production",
  },
  {
    id: "apoie",
    eyebrow: "Apoie",
    heading:
      "Doe para o Documentário de Rua e ajude a transformar visibilidade em solidariedade",
    body:
      "Sua contribuição mantém o trabalho audiovisual, amplia as produções e fortalece as ações de transformação social e de garantia de direitos das pessoas que fazem parte do projeto.",
    kind: "pix",
  },
  {
    id: "faca-parte",
    eyebrow: "Faça parte",
    heading: "Faça parte do Documentário de Rua",
    body:
      "O Documentário de Rua é uma construção coletiva. Inscreva-se para participar das ações do projeto.",
    kind: "form",
    action: "Quero fazer parte",
    form: "membership",
  },
];

/** Why a form button is disabled, shown next to it so the state is never a dead link. */
export const formPendingReason = "Formulário em preparação";
