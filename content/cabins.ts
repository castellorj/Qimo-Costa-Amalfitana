/**
 * Categorias de cabine do Variety Voyager — seção "Valores por cabine".
 * Valores por pessoa, em euros. Fonte: proposta Sicília & Costa Amalfitana.
 * Edite aqui para atualizar preços e specs (não passa pelo /admin).
 */
export type Cabin = {
  name: string;
  deck: string;
  price: string;
  image: string;
  specs: { window: string; beds: string; size: string };
};

export const cabins: Cabin[] = [
  {
    name: "Cabine C",
    deck: "Deck inferior · Oceans",
    price: "€ 5.950",
    image: "/images/amalfi/voyager-cabine-c.png",
    specs: { window: "2 escotilhas redondas", beds: "Casal ou solteiro (fixa)", size: "11–15 m²" },
  },
  {
    name: "Cabine B",
    deck: "Deck inferior / principal",
    price: "€ 6.350",
    image: "/images/amalfi/voyager-cabine-b.png",
    specs: { window: "2 escotilhas ou 2 janelas", beds: "Flexível (casal ou solteiro)", size: "11–18 m²" },
  },
  {
    name: "Cabine A",
    deck: "Deck principal · Riviera",
    price: "€ 7.300",
    image: "/images/amalfi/voyager-cabine-a.png",
    specs: { window: "2 janelas retangulares", beds: "Flexível (casal ou solteiro)", size: "12–16 m²" },
  },
  {
    name: "Cabine P",
    deck: "Deck superior · Infinity",
    price: "€ 7.750",
    image: "/images/amalfi/voyager-cabine-p.png",
    specs: { window: "2 janelas retangulares", beds: "Flexível, com sofá em algumas", size: "16–21 m²" },
  },
  {
    name: "Owner's Suite",
    deck: "Deck superior · a mais ampla",
    price: "€ 8.800",
    image: "/images/amalfi/voyager-owners-suite.jpg",
    specs: { window: "4 janelas", beds: "Flexível, com sala de estar", size: "~22 m², a maior" },
  },
];

/** Nota do rodapé da seção de cabines. */
export const cabinsNote =
  "Valores por pessoa, em euros. Navio Variety Voyager · três decks: Oceans (inferior), Riviera (principal) e Infinity (superior). O que muda entre as categorias é a posição no navio, o tipo de janela, a flexibilidade das camas e o espaço — quanto mais alto o deck, mais luz e vista.";
