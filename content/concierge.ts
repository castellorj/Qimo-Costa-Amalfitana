import type { ConciergeSection, ChecklistItem, Experience } from "./types";

/**
 * Concierge QIMO — backbone prático da viagem (guia QIMO, info gerais).
 */
export const conciergeSections: ConciergeSection[] = [
  {
    id: "contatos",
    title: "Contatos",
    items: [
      { label: "Castello Branco (emergências)", value: "+55 21 99855-1501" },
      { label: "Luis Paulo", value: "+55 21 99634-5278" },
      { label: "Katarina Line (escritório)", value: "+385 51 603 400" },
      { label: "Emergência (Croácia)", value: "112" },
      { label: "A bordo", value: "Tour Manager e tripulação · disponíveis 24h" },
    ],
  },
  {
    id: "gorjetas",
    title: "Gorjetas",
    items: [
      { label: "Tour Manager", value: "€50 por pessoa" },
      { label: "Tripulação (serviços e bagagem)", value: "€150 por pessoa" },
      { label: "Guias locais", value: "€1–2 por passeio guiado" },
      { label: "Restaurantes & cafés", value: "10–15% (se não incluído)" },
      { label: "Táxis", value: "até 10% da corrida" },
      { label: "Como funciona", value: "Voluntária; dividida igualmente entre a tripulação" },
    ],
  },
  {
    id: "navio",
    title: "Informações do Navio",
    items: [
      { label: "Embarcação", value: "M/Y QIMO · Katarina Line" },
      { label: "Cabines", value: "On Deck (superior/principal) e Lower Deck (casco)" },
      { label: "Comodidades", value: "Banheiro privativo, A/C, secador, amenities, toalha de praia/pessoa" },
      { label: "Arrumação", value: "Diária; roupa de cama trocada 1×/semana" },
      { label: "Refeições", value: "Mediterrânea e internacional, produto local — informe restrições antes" },
      { label: "Wi-Fi", value: "Cortesia (via satélite); velocidade varia" },
      { label: "Tomadas", value: "Padrão europeu Tipo F · 220V · plugues C/E/F" },
      { label: "Água", value: "A da torneira não é potável; dispenser gratuito — traga garrafa" },
    ],
  },
  {
    id: "chegada",
    title: "Chegada & Embarque em Trogir",
    items: [
      { label: "Embarque", value: "A partir das 14h · porto de Trogir" },
      { label: "Endereço", value: "Obala bana Berislavića 17, 21220 Trogir" },
      { label: "Guarda-volumes", value: "Castelo Kamerlengo · €5 por mala" },
      { label: "Estacionamento", value: "Luka & Ivan €50/sem · Travarica €3/h · Trogir €6/h" },
      { label: "Passaportes", value: "Entregues ao capitão no 1º dia (registro)" },
    ],
  },
  {
    id: "pagamentos",
    title: "Pagamentos & Documentos",
    items: [
      { label: "Moeda", value: "Euro (€)" },
      { label: "Cartões", value: "Visa, Mastercard/Maestro — amplamente aceitos" },
      { label: "Dinheiro", value: "Leve euros para konobas, táxis-barco e adegas (algumas só dinheiro)" },
      { label: "Vistos (UE/UK/US/CA/AU/NZ)", value: "Não exigido" },
      { label: "Brasileiros", value: "Confira as regras vigentes antes do embarque" },
    ],
  },
  {
    id: "conduta",
    title: "Conduta a Bordo",
    items: [
      { label: "Capitão", value: "Pode alterar rota/itinerário por clima ou segurança" },
      { label: "Fumar", value: "Apenas em áreas externas designadas — nunca no mar" },
      { label: "Bebidas", value: "Não trazer a bordo (exceto dieta/medicamentos)" },
      { label: "Swim stop", value: "Proibido pular do navio sem orientação da tripulação" },
      { label: "Silêncio noturno", value: "À meia-noite (antes em Parques Nacionais)" },
      { label: "Sustentabilidade", value: "Proibido jogar lixo no mar; água e energia são limitadas" },
    ],
  },
];

export const checklist: ChecklistItem[] = [
  { label: "Passaporte / documento válido", category: "Documentos" },
  { label: "Seguro viagem", category: "Documentos" },
  { label: "Cartão Visa/Mastercard + euros em espécie", category: "Documentos" },
  { label: "Roupa smart-casual para jantares e clubes", category: "Vestuário" },
  { label: "Um traje para o Captain's Dinner", category: "Vestuário" },
  { label: "Sapatilhas de água (cascalho e ouriços)", category: "Vestuário" },
  { label: "Sapato confortável para as muralhas de pedra", category: "Vestuário" },
  { label: "Maiôs e biquínis (vários)", category: "Vestuário" },
  { label: "Óculos de sol e chapéu", category: "Sol & Mar" },
  { label: "Protetor solar (reef-safe)", category: "Sol & Mar" },
  { label: "Adaptador de tomada Tipo F (europeu)", category: "Essenciais" },
  { label: "Remédios pessoais", category: "Essenciais" },
  { label: "Garrafa reutilizável", category: "Essenciais" },
  { label: "Câmera / power bank", category: "Essenciais" },
  { label: "Reservar fine dining (360, Nautika, LD, Jeny, Gariful)", category: "Reservas" },
  { label: "Moreška em Korčula (sobretudo 29/jul)", category: "Reservas" },
  { label: "Horário do Skywalk Biokovo (20 carros/hora)", category: "Reservas" },
];

/**
 * Experiências QIMO — os momentos de assinatura da viagem.
 */
export const experiences: Experience[] = [
  {
    id: "captains-dinner",
    title: "Captain's Dinner",
    tagline: "A bordo · noite de gala",
    description:
      "O jantar de gala do comandante, servido a bordo sob as estrelas, com os vinhos da península de Pelješac e um menu de assinatura do chef.",
    image: { src: "/images/exp-captains.svg", alt: "Mesa do Captain's Dinner ao anoitecer" },
  },
  {
    id: "sunset-party",
    title: "Sunset Party",
    tagline: "Makarska · convés superior",
    description:
      "Champagne, DJ set e o sol descendo atrás do maciço de Biokovo, no convés superior — a noite mais animada da viagem.",
    image: { src: "/images/exp-sunset.svg", alt: "Sunset Party no convés superior" },
  },
  {
    id: "swim-stops",
    title: "Swim Stops",
    tagline: "Pakleni · Pelješac · Bol",
    description:
      "Paradas de mergulho nas águas mais límpidas do Adriático — das ilhas Pakleni às enseadas de Pelješac e Brač. A escada de banho desce, o mar te espera.",
    image: { src: "/images/exp-swim.svg", alt: "Mergulho nas águas turquesa do Adriático" },
  },
  {
    id: "aftermovie",
    title: "Aftermovie",
    tagline: "Após a viagem",
    description:
      "O filme oficial da experiência QIMO Croatia 2026, com as fotos e vídeos de todos os momentos — disponível aqui após o desembarque.",
    image: { src: "/images/exp-aftermovie.svg", alt: "Aftermovie da experiência QIMO" },
  },
];
