import type { Tip } from "./types";

/**
 * Dicas da guia — recomendações curtas e editoriais da anfitriã/guia QIMO,
 * exibidas na Home (Hoje). Conteúdo editável no painel (/admin → "Dicas da guia").
 */
export const tips: Tip[] = [
  {
    id: "calcado",
    title: "Calçado de convés",
    body: "A bordo, prefira sapatos de sola clara e macia — protegem o teca e evitam escorregões. Salto alto fica para os jantares em terra.",
  },
  {
    id: "reservas",
    title: "Avise o concierge na véspera",
    body: "As melhores mesas e as degustações nas adegas esgotam. Um pedido com 24 horas de antecedência garante o lugar.",
  },
  {
    id: "sol",
    title: "Sol da Dalmácia",
    body: "Protetor solar reef-safe e um linho leve para o meio-dia. A luz aqui é generosa — um chapéu vale por toda a viagem.",
  },
  {
    id: "banho",
    title: "O melhor banho é cedo",
    body: "Logo após o café, as enseadas estão mais calmas e translúcidas, antes da chegada dos outros barcos.",
  },
  {
    id: "noites",
    title: "Brisa da noite",
    body: "Os jantares são smart-casual; leve um agasalho leve para o convés ao anoitecer, quando o vento muda.",
  },
];
