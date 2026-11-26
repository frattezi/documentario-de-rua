// The overpass timeline, 2009–2026, as the Film reconstructs it from Street View.
// Copy is verbatim from reference/live/index.html, typographic quotes included.

/**
 * One year of the timeline. A row either carries the two sides, or spans both columns with a
 * single cell — which is what the 2026 row does.
 */
export type TimelineRow =
  | { year: string; charles: string; angola: string; span?: false }
  | { year: string; span: true; text: string };

export const timelineSection = {
  eyebrow: "Viaduto Angola, Av. Antônio Carlos",
  heading: "Uma parede chamada de lar",
  lede:
    "O filme reconstrói a história dos dois lados do viaduto com imagens do Google Street View, ano a ano, até as pessoas que hoje moram ali.",
  columns: { year: "Ano", charles: "Lado do Charles", angola: "Lado do Jardim Angola" },
} as const;

export const timeline: readonly TimelineRow[] = [
  { year: "2009", charles: "Ainda não existe viaduto", angola: "Registros da obra" },
  { year: "2011", charles: "Fica pronto para a Copa do Mundo", angola: "Fica pronto" },
  { year: "2014", charles: "", angola: "Pichações contra a Copa" },
  {
    year: "2015",
    charles: "Anúncios imobiliários",
    angola: "Primeira marca de fogueira na parede",
  },
  { year: "2018", charles: "“Lula Livre”", angola: "O barraco solitário de Diego" },
  {
    year: "2019",
    charles: "Convocação de greve e o primeiro barraco",
    angola: "Primeiros vizinhos e primeiras plantas",
  },
  { year: "2021", charles: "Um grafite escrito “esperança”", angola: "" },
  { year: "2022", charles: "O grafite é terminado", angola: "Colocam brita do outro lado" },
  {
    year: "2023",
    charles: "Charles escolhe aquela parede para chamar de lar",
    angola: "Começa o Jardim Angola",
  },
  { year: "2024", charles: "", angola: "O jardim floresce" },
  { year: "2026", span: true, text: "Cá estamos" },
];
