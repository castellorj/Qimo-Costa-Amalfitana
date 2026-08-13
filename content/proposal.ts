/**
 * QIMO Croatia Experience 2027 — Camada editável da PROPOSTA
 * =========================================================
 * Este é o ÚNICO arquivo que você edita para atualizar a proposta de 2027.
 * Tudo aqui são placeholders prontos para você trocar pelos dados reais:
 * datas, "a partir de", o que está incluído, fotos do barco, depoimentos e FAQ.
 *
 * O conteúdo rico (destinos, restaurantes, vinhos, experiências) vem dos
 * arquivos copiados do guia (content/destinations.ts, etc.) e não precisa ser
 * mexido aqui.
 */

export type IncludedItem = { label: string; detail?: string };
export type Pillar = { title: string; body: string };
export type BoatFeature = { title: string; body: string; image: string };
export type Testimonial = { quote: string; author: string; role?: string };
export type FaqItem = { q: string; a: string };
/** Mídia das edições anteriores (galeria). Para vídeo, preencha `href` com o
 *  link do YouTube/Vimeo (ou do arquivo). `src` é a foto/thumbnail. */
export type PastMedia = { type: "photo" | "video"; src: string; alt: string; href?: string };
/** Tópico da seção "Principais dúvidas". `body` = linhas "Rótulo: valor". */
export type FaqTopic = { title: string; enabled: boolean; body: string };

/** Uma escala do roteiro, totalmente editável no /admin. */
export type RoteiroCity = {
  slug: string;
  day: number;
  name: string;
  tagline: string;
  photo: string;
  /** Introdução em parágrafos, separados por linha em branco (\n). */
  intro: string;
  pois: { name: string; description: string }[];
};

export const proposal = {
  /* ---- Marca & datas ------------------------------------------------- */
  /** Nome do grupo/viagem (aparece no título da aba, og e rodapé). */
  groupName: "QIMO Sicília & Costa Amalfitana",
  year: 2027,
  vessel: "Variety Voyager",
  /** Datas reais da viagem — fonte da verdade para exibição e contagem
   *  regressiva. Editáveis no /admin. */
  startDate: "2027-07-14",
  endDate: "2027-07-21",
  /** Texto de duração exibido ao lado das datas (ex.: "7 noites"). */
  heroNights: "7 noites",
  guestsNote: "Grupo fechado · por convite",
  /** Texto do botão de inscrição na lista exclusiva (final da página). */
  waitlistCta: "Quero entrar na lista exclusiva do grupo",

  /* ---- Tela de entrada (splash de exclusividade) -------------------- */
  entryEnabled: true,
  entryKicker: "Apresentação exclusiva",
  entryTitle: "Grupo Débora XXX",
  entrySubtitle: "",
  entryCta: "Saber mais detalhes",
  entryImage: "/images/hero-dubrovnik.svg",

  /* ---- Títulos das seções (editáveis no /admin) --------------------- */
  headings: {
    roteiroKicker: "O roteiro",
    roteiroTitle: "Sete escalas pela Dalmácia",
    pastKicker: "Edições anteriores",
    pastTitle: "Como foram as viagens",
    pastSubtitle: "Fotos e vídeos de quem já viveu essa experiência.",
    valueKicker: "A viagem",
    valueTitle: "Valor & inclusões",
    faqKicker: "Antes de embarcar",
    faqTitle: "Principais dúvidas",
    finaleTitle: "O Adriático espera",
  },

  /* ---- Principais dúvidas (copiado do concierge do guia) ------------
   * Cada tópico: liga/desliga (enabled) + texto. Edite/oculte no /admin. */
  faqTopics: [
    {
      title: "Contatos",
      enabled: false,
      body:
        "Castello Branco: +55 21 99855-1501\nLuis Paulo (LP): +55 21 99634-5278\nEmergência (Croácia): 112\nA bordo: Tour Manager e tripulação · disponíveis 24h",
    },
    {
      title: "Embarque em Trogir",
      enabled: true,
      body:
        "Embarque: A partir das 14h · porto de Trogir\nEndereço: Obala bana Berislavića 17, 21220 Trogir\nGuarda-volumes: Castelo Kamerlengo · €5 por mala\nEstacionamento: Luka & Ivan €50/sem · Travarica €3/h · Trogir €6/h\nPassaportes: Entregues ao capitão no 1º dia (registro)",
    },
    {
      title: "Informações dos barcos",
      enabled: true,
      body:
        "Comodidades: Banheiro privativo, A/C, secador, amenities, toalha de praia por pessoa\nArrumação: Diária; roupa de cama trocada 1×/semana\nRefeições: Mediterrânea e internacional, produto local — informe restrições antes\nWi-Fi: Cortesia (via satélite); velocidade varia\nTomadas: Padrão europeu Tipo F · 220V · plugues C/E/F\nÁgua: A da torneira não é potável; dispenser gratuito — traga garrafa",
    },
    {
      title: "Rotina a Bordo",
      enabled: true,
      body:
        "Roteiro: Pode alterar rota/itinerário por clima ou segurança\nFumar: Apenas em áreas externas designadas — nunca no mar\nBebidas: É proibido levar bebidas a bordo (exceto dieta/medicamentos)\nSwim stop: É proibido pular do navio, sob risco de cancelamento da viagem sem devolução de valores\nSilêncio noturno: À meia-noite (antes em Parques Nacionais)\nSustentabilidade: Proibido jogar lixo no mar; água e energia são limitadas\nDia a dia:\n07h — o barco zarpa\nManhã — navegação com café a bordo (cerca de 2h a 2h30)\nAté ~14h — parada em ilha, enseada ou praia para nadar e curtir o mar\nAlmoço — mais ~2h de navegação\n15h30–16h — chegada ao destino final\nNoite — atracados: todos saem à vontade para passear, jantar e tomar um drink, com retorno até as 7h do dia seguinte\nDurante o dia, o barco e o mar; à noite, uma cidade diferente da Croácia.",
    },
    {
      title: "Gorjetas",
      enabled: true,
      body:
        "Tour Manager: €50 por pessoa\nTripulação (serviços e bagagem): €150 por pessoa\nGuias locais: €1–2 por passeio guiado\nRestaurantes & cafés: 10–15% (se não incluído)\nTáxis: até 10% da corrida\nComo funciona: Voluntária; dividida igualmente entre a tripulação",
    },
    {
      title: "Pagamentos & Documentos",
      enabled: true,
      body:
        "Moeda: Euro (€)\nCartões: Visa, Mastercard/Maestro — amplamente aceitos\nDinheiro: Leve euros para konobas, táxis-barco e adegas (algumas só dinheiro)\nVistos (UE/UK/US/CA/AU/NZ): Não exigido\nBrasileiros: Confira as regras vigentes antes do embarque",
    },
    {
      title: "Sobre o Guia",
      enabled: true,
      body:
        "As sugestões apresentadas têm caráter exclusivamente informativo e inspiracional, cabendo ao viajante decidir livremente sua programação e realizar diretamente eventuais contratações.",
    },
  ] as FaqTopic[],

  /* ---- A embarcação (categoria do barco) ---------------------------- */
  boatKicker: "A embarcação",
  boatTitle: "A categoria do grupo",
  boatNote:
    "Este é um exemplo da categoria de barco escolhida para o grupo. Alguns detalhes podem variar conforme a embarcação designada.",
  /** Fotos do barco (upload no /admin). Placeholders — troque pelas reais. */
  boatPhotos: [
    { type: "photo", src: "/images/exp-sunset.svg", alt: "Convés ao pôr do sol" },
    { type: "photo", src: "/images/exp-captains.svg", alt: "Jantar a bordo" },
    { type: "photo", src: "/images/hero-hvar.svg", alt: "A bordo pela costa" },
    { type: "photo", src: "/images/exp-swim.svg", alt: "Parada para banho" },
  ] as PastMedia[],

  /* ---- Hero ---------------------------------------------------------- */
  hero: {
    // Capa: a costa italiana vista do mar. Sem foto de pessoa, por opção do dono
    // (evita risco de imagem/likeness). Troque por outra paisagem se quiser.
    image: "/images/amalfi/hero-desktop-01.jpg",
    overline: "La Dolce Vita sul Mare — de Malta à Costa Amalfitana", // usado só no preview do link (og)
    kicker: "La Dolce Vita sul Mare",
    title: "Sicília & Costa Amalfitana",
    year: "2027",
    subtitle: "Sete noites entre Malta, a Sicília, as Ilhas Eólias e a Costa Amalfitana",
    cities: "Valletta · Siracusa · Taormina · Lipari · Stromboli · Capri · Positano · Amalfi · Sorrento · Nápoles",
  },

  /* ---- Manifesto (frase grande) ------------------------------------- */
  manifesto:
    "Acordar ancorado numa enseada de água cristalina — e a Dalmácia inteira à sua frente.",
  /** Mostrar a frase do manifesto no início (toggle no /admin). */
  showManifesto: false,

  /* ---- Por que esta viagem é única (pilares) ------------------------ */
  pillars: [
    { title: "Um iate só do grupo", body: "Sem multidões. O mar no seu ritmo." },
    { title: "Rota curada", body: "Sete escalas escolhidas uma a uma." },
    { title: "Concierge dedicado", body: "Cada detalhe cuidado, do início ao fim." },
    { title: "Momentos de assinatura", body: "Jantar do comandante, sunset, swim stops." },
  ] as Pillar[],

  /* ---- O Barco (narrativa em blocos) -------------------------------- */
  boat: {
    intro:
      "O M/Y QIMO não é um meio de transporte — é o endereço da viagem. Um iate de charter privado onde cada dia começa e termina a bordo.",
    features: [
      {
        title: "Cabines",
        body: "On Deck e Lower Deck, todas com banheiro privativo, ar-condicionado e amenities. Arrumação diária.",
        image: "/images/hero-hvar.svg",
      },
      {
        title: "Conveses & Sun Deck",
        body: "Espreguiçadeiras ao sol, sombra para o almoço e o melhor lugar do mundo para ver o dia cair sobre o mar.",
        image: "/images/exp-sunset.svg",
      },
      {
        title: "Mesa a bordo",
        body: "Cozinha mediterrânea de produto local, vinhos da Dalmácia e o Captain's Dinner servido sob as estrelas.",
        image: "/images/exp-captains.svg",
      },
      {
        title: "O mar à porta",
        body: "A escada de banho desce direto na água. Swim stops nas Pakleni, em Pelješac e em Brač, sempre que o azul chamar.",
        image: "/images/exp-swim.svg",
      },
    ] as BoatFeature[],
    /** Suba aqui as fotos reais do M/Y QIMO quando tiver. */
    gallery: [
      "/images/hero-hvar.svg",
      "/images/exp-sunset.svg",
      "/images/exp-captains.svg",
      "/images/exp-swim.svg",
    ],
  },

  /* ---- Galeria de edições anteriores (fotos + vídeos) --------------
   * PLACEHOLDERS: troque pelos vídeos/fotos reais das edições passadas.
   * Para vídeos, cole o link em `href` (YouTube/Vimeo) e uma thumbnail em `src`. */
  pastEditions: [
    { type: "video", src: "/images/exp-aftermovie.svg", alt: "Aftermovie — edição anterior", href: "" },
    { type: "photo", src: "/images/hero-dubrovnik.svg", alt: "Edição anterior · Dubrovnik" },
    { type: "photo", src: "/images/exp-sunset.svg", alt: "Sunset Party — edição anterior" },
    { type: "video", src: "/images/exp-captains.svg", alt: "Captain's Dinner — vídeo", href: "" },
    { type: "photo", src: "/images/hero-hvar.svg", alt: "Edição anterior · Hvar" },
    { type: "photo", src: "/images/exp-swim.svg", alt: "Swim stop — edição anterior" },
    { type: "photo", src: "/images/hero-bol.svg", alt: "Edição anterior · Bol" },
    { type: "photo", src: "/images/hero-korcula.svg", alt: "Edição anterior · Korčula" },
  ] as PastMedia[],

  /* ---- O que está incluído (EDITAR com o pacote real 2027) ---------- */
  included: [
    { label: "7 noites a bordo do M/Y QIMO", detail: "cabine privativa com banheiro" },
    { label: "Pensão a bordo", detail: "café, almoços e jantares selecionados" },
    { label: "Captain's Dinner & Sunset Party", detail: "momentos de assinatura QIMO" },
    { label: "Swim stops diários", detail: "nas melhores águas do Adriático" },
    { label: "Tour Manager & tripulação", detail: "acompanhamento 24h" },
    { label: "Wi-Fi de cortesia a bordo", detail: "via satélite" },
    { label: "Concierge QIMO", detail: "da reserva ao desembarque" },
    { label: "Aftermovie oficial", detail: "o filme da sua viagem" },
  ] as IncludedItem[],
  /** Deixe claro o que NÃO está incluso, para não gerar objeção depois. */
  notIncluded: "Passagens aéreas, seguro viagem, gorjetas e taxas portuárias. Consulte o concierge.",

  /* ---- Preço (opcional; deixe null para não exibir valor) ----------- */
  /** Rótulo antes do valor (ex.: "A partir de", "Investimento", "Valor"). */
  priceLabel: "A partir de",
  priceFrom: null as string | null, // ex.: "€ 4.900 por pessoa"
  priceNote: "Valores e condições sob consulta ao concierge.",

  /* ---- Depoimentos (troque por citações reais de edições anteriores)  */
  testimonials: [
    {
      quote:
        "Foi a viagem mais bem cuidada que já fizemos. Cada dia parecia impossível de superar — e o dia seguinte superava.",
      author: "Edição anterior",
      role: "Hóspede QIMO",
    },
    {
      quote:
        "Ter o barco só para o nosso grupo mudou tudo. Acordar numa enseada deserta e cair na água antes do café não tem preço.",
      author: "Edição anterior",
      role: "Hóspede QIMO",
    },
  ] as Testimonial[],

  /* ---- FAQ (objeções antes da reserva) ------------------------------ */
  faq: [
    {
      q: "Para quem é esta viagem?",
      a: "Um grupo fechado de viajantes experientes que valorizam privacidade, conforto e curadoria. Famílias, casais e amigos são bem-vindos.",
    },
    {
      q: "Como são as cabines?",
      a: "Todas com banheiro privativo, ar-condicionado, secador e amenities. Há categorias On Deck (superior) e Lower Deck. A arrumação é diária.",
    },
    {
      q: "O roteiro pode mudar?",
      a: "O comandante pode ajustar a rota por clima ou segurança, sempre buscando o melhor da experiência. As escalas-âncora se mantêm.",
    },
    {
      q: "O que preciso levar?",
      a: "Roupa smart-casual para jantares, um traje para o Captain's Dinner, sapatilhas de água e o essencial de sol e mar. Enviamos um checklist completo após a reserva.",
    },
    {
      q: "Como funciona a reserva?",
      a: "É simples: chame no WhatsApp ou deixe o seu contato. Retornamos com todos os detalhes — datas, cabines e valores — para acertar tudo com calma, sem compromisso.",
    },
  ] as FaqItem[],

  /* ---- Contato / reserva -------------------------------------------- */
  /** E-mail que recebe os pedidos de reserva (via FormSubmit). TROCAR. */
  leadEmail: "castellorj@gmail.com",
  whatsapp: "+55 21 99545-3817",
  whatsappNote: "Fale com um especialista QIMO",
  /** Links do rodapé (editáveis no /admin). Vazio = oculta o ícone. */
  instagramUrl: "https://instagram.com/qimobr",
  siteUrl: "https://qimobr.com",
};

/** Link do WhatsApp já formatado para o CTA. */
export const whatsappUrl = `https://wa.me/${proposal.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Olá! Tenho interesse na QIMO Sicília & Costa Amalfitana (jul 2027). Podem me enviar mais informações?"
)}`;
