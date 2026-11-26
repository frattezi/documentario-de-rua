// How PL 174/2025 became Lei 12.003/2026, the 0,03% figure, and the rights the people
// interviewed ask for. Copy is verbatim from reference/live/index.html.

/**
 * One step on the way to the law. `lead` is the bold opening; `rest` is what follows it, and is
 * kept exactly as published — including the trailing space on the last step.
 */
export interface LawStep {
  /** The marker in the left column: a year or a stage. */
  when: string;
  lead: string;
  rest: string;
}

export const lawSection = {
  eyebrow: "PL 174/2025 → Lei 12.003/2026",
  heading: "Como o projeto virou lei",
  stat: {
    number: "0,03%",
    body:
      "Os cinco participantes do filme representam 0,03% da população em situação de rua estimada em Belo Horizonte. Entre quem conversou com o diretor, a resposta foi a mesma: a internação involuntária não funciona.",
  },
  rightsIntro: "O que as pessoas ouvidas pedem já está garantido na Constituição:",
} as const;

export const lawSteps: readonly LawStep[] = [
  {
    when: "2025",
    lead: "PL 174/2025 é apresentado",
    rest:
      " na Câmara Municipal de BH para regulamentar a internação voluntária e involuntária de usuários de drogas.",
  },
  {
    when: "2º turno",
    lead: "A Câmara aprova o projeto.",
    rest: " Em plenário, vereadores defendem comunidades terapêuticas.",
  },
  {
    when: "Prazo",
    lead: "O prefeito não veta nem sanciona.",
    rest: " A prefeitura não se manifesta sobre o tema.",
  },
  { when: "2026", lead: "A Câmara promulga a Lei 12.003/2026.", rest: " " },
];

export const rights: readonly string[] = [
  "Moradia",
  "Trabalho",
  "Água",
  "Saúde",
  "Cultura",
  "Educação",
  "Dignidade",
];
