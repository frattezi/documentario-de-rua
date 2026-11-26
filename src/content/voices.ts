// The five Voices and the dedication on Diego's wall.
// Every quote is verbatim from reference/live/index.html, including which words are highlighted.
// These are the testimonies the site exists to carry: never reworded, never re-punctuated.

/**
 * A run of a quote. `plain` is unmarked text, `mark` is highlighted on the sign yellow block,
 * and `yellow` is set in the sign colour without a block.
 */
export type QuotePart =
  | { kind: "plain"; text: string }
  | { kind: "mark"; text: string }
  | { kind: "yellow"; text: string };

/** A testimony: the quote, who said it, and the note under their name. */
export interface Voice {
  quote: readonly QuotePart[];
  name: string;
  note: string;
}

export const voicesSection = {
  eyebrow: "Quem fala no filme",
  heading: "Cinco vozes de quem vive na rua",
} as const;

export const voices: readonly Voice[] = [
  {
    quote: [
      { kind: "plain", text: "Moro na rua desde os meus " },
      { kind: "mark", text: "10 anos" },
      { kind: "plain", text: " de idade. Nunca dei trabalho pra ninguém." },
    ],
    name: "Jéssica",
    note: "33 anos",
  },
  {
    quote: [
      { kind: "plain", text: "Eu fico na rua não é porque eu " },
      { kind: "yellow", text: "quero" },
      { kind: "plain", text: ". Se eu tivesse uma " },
      { kind: "mark", text: "casa" },
      { kind: "plain", text: ", estava ótimo." },
    ],
    name: "Leidiane",
    note: "irmã de Jéssica",
  },
  {
    quote: [
      { kind: "plain", text: "Não reparem, que não tem nada de luxo. " },
      { kind: "mark", text: "Mas é meu." },
    ],
    name: "Charles",
    note: "47 anos · pedreiro",
  },
  {
    quote: [
      { kind: "plain", text: "O " },
      { kind: "mark", text: "trabalho" },
      { kind: "plain", text: " é a porta de saída e de " },
      { kind: "yellow", text: "entrada" },
      { kind: "plain", text: "." },
    ],
    name: "Wagner",
    note: "cuida do Jardim Angola",
  },
  {
    quote: [
      { kind: "plain", text: "Aqui é uma casa. Aqui mora gente, mano, " },
      { kind: "mark", text: "mora vida" },
      { kind: "plain", text: "." },
    ],
    name: "Diego",
    note: "10 anos no viaduto",
  },
];

export const wall = {
  label: "Dedicatória escrita na parede do barraco de Diego",
  image: {
    src: "/img/wall.jpg",
    alt: "Parede de concreto com dedicatória escrita à caneta azul para Diego",
  },
  quote: [
    {
      kind: "plain",
      text:
        "Se algum dia eu passar por aqui e não sorrir, lembre-se: é nesse momento que eu preciso de um ",
    },
    { kind: "mark", text: "sorriso teu" },
    { kind: "plain", text: "." },
  ] as readonly QuotePart[],
  credit: "Dedicatória na parede do Diego, Viaduto Angola",
} as const;
