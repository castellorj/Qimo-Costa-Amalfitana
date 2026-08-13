import type { Restaurant, RestaurantCategory } from "./types";

/**
 * Guia Gastronômico — todos os endereços do guia QIMO Croatia 2026.
 * Categorias mapeadas aos 6 filtros do módulo. As descrições preservam o
 * conteúdo editorial do guia. O mapa de cada card usa busca por nome+cidade
 * (Google Maps), então coordenadas são opcionais.
 */

/**
 * Imagem de AMBIENTE por categoria (fotografia profissional do Pexels,
 * curada para o registro Aman/CNT — terraços, vista, beach clubs, konobas).
 * São ilustrativas do estilo de cada casa, não o estabelecimento exato
 * (priorizando o ambiente, conforme a direção editorial QIMO). Cada
 * restaurante recebe uma foto distinta do pool da sua categoria, em rodízio.
 * Pools em /public/images/photos/rest/, créditos em content/rest-photos.json.
 */
const POOL_SIZE: Record<RestaurantCategory, number> = {
  michelin: 7,
  "fine-dining": 10,
  "beach-club": 5,
  sunset: 5,
  "wine-bar": 3,
  traditional: 9,
};
const AMBIENT_ALT: Record<RestaurantCategory, string> = {
  michelin: "Ambiente de alta gastronomia à beira-mar",
  "fine-dining": "Terraço de fine dining com vista para o Adriático",
  "beach-club": "Beach club mediterrâneo sobre águas turquesa",
  sunset: "Terraço ao pôr do sol",
  "wine-bar": "Seleção de vinhos da Dalmácia",
  traditional: "Konoba dálmata tradicional",
};
const catCount: Partial<Record<RestaurantCategory, number>> = {};
function ambient(category: RestaurantCategory) {
  const n = (catCount[category] = (catCount[category] ?? 0) + 1) - 1;
  const idx = n % POOL_SIZE[category];
  return { src: `/images/photos/rest/${category}-${idx}.jpg`, alt: AMBIENT_ALT[category] };
}

type R = Omit<Restaurant, "image"> & { image?: Restaurant["image"] };

function make(list: R[]): Restaurant[] {
  return list.map((r) => ({ ...r, image: r.image ?? ambient(r.category) }));
}

export const restaurants: Restaurant[] = make([
  // ---------------- TROGIR ----------------
  {
    id: "konoba-trs", name: "Konoba TRS", destinationSlug: "trogir",
    category: "michelin", priceRange: "€€€", distinction: "Guia Michelin",
    description:
      "No Guia Michelin; terraço sob parreira num edifício de 500 anos. Bacalhau, tataki de atum, massa com vitela e trufas, vinho da casa. Almoço/jantar · ótimo custo-benefício.",
  },
  {
    id: "don-dino", name: "Restaurant Don Dino", destinationSlug: "trogir",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Fine dining de referência; fama pelo melhor atum da cidade e sushi. Tagliatelle negro, pašticada. Almoço/jantar · reserva recomendada · bom para grupos.",
  },
  {
    id: "mare-ciovo", name: "Restaurant Mare (Čiovo)", destinationSlug: "trogir",
    category: "michelin", priceRange: "€€€", distinction: "Guia Michelin",
    description:
      "No Guia Michelin, no Bifora Heritage Hotel (séc. XIV); chef Robert Predag Zmire, cozinha contemporânea, pátio de pedra. Jantar · reserva recomendada.",
  },
  {
    id: "dionis", name: "Restaurant Dionis", destinationSlug: "trogir",
    category: "traditional", priceRange: "€€€",
    description:
      "Na orla, vista da promenade e do mar; peixe, scampi e frutos do mar. Almoço/jantar/sunset · reserva recomendada.",
  },
  {
    id: "kamerlengo-rest", name: "Restaurant Kamerlengo", destinationSlug: "trogir",
    category: "traditional", priceRange: "€€€",
    description:
      "Um dos mais antigos; a melhor grelha local — escolha o peixe e o preparo. Rožada, škampi na buzara. Jantar · pátio de pedra.",
  },
  {
    id: "olive-trogir", name: "Restaurant Olive", destinationSlug: "trogir",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Junto à Catedral de São Lourenço; clássico elegante, peixe fresco, massa caseira, vinhos croatas. Almoço/jantar · reserva recomendada.",
  },

  // ---------------- HVAR ----------------
  {
    id: "gariful", name: "Gariful", destinationSlug: "hvar",
    category: "traditional", priceRange: "€€€€",
    description:
      "Ícone do jet set na Riva desde 1981, reduto de celebridades. Lagosta com massa, piso-aquário, carta de champanhes; terraço VIP. Sunset/jantar · reserva obrigatória · “dress to impress”.",
  },
  {
    id: "mediterraneo", name: "Mediterraneo Dine & Wine", destinationSlug: "hvar",
    category: "michelin", priceRange: "€€€", distinction: "Guia Michelin",
    description:
      "Único no Guia Michelin de Hvar; familiar desde 1953, em pátio florido. Ribeye maturado 60 dias, gregada, ostras ao limão. Jantar · reserva obrigatória · smart casual.",
  },
  {
    id: "zori", name: "Zori — Timeless (Palmižana)", destinationSlug: "hvar",
    category: "fine-dining", priceRange: "€€€€",
    description:
      "Fine dining das Pakleni; família Kovačević desde 1947, chef Siniša Jevrosimov. Chega-se de barco (~10 min). Almoço longo/jantar · reserva obrigatória.",
  },
  {
    id: "laganini", name: "Laganini (Palmižana)", destinationSlug: "hvar",
    category: "beach-club", priceRange: "€€€€",
    description:
      "Beach club-restaurante há 50+ anos; Ceviche Laganini e pôr do sol sobre Vinogradišće. ~25 min de táxi-barco. Sunset · reserva obrigatória · €150–200/pessoa.",
  },
  {
    id: "san-marco", name: "San Marco — Palace Elisabeth", destinationSlug: "hvar",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Fine dining sobre a Loggia; terraço atribuído à Imperatriz Sisi, vista do porto. Creme de lavanda com figos. Sunset/jantar · reserva recomendada · Leading Hotels.",
  },
  {
    id: "beach-club-hvar", name: "Beach Club Hvar", destinationSlug: "hvar",
    category: "beach-club", priceRange: "€€€",
    description:
      "O beach club mais elegante a pé da cidade (~15 min); decoração azul e branco sobre a água, mediterrâneo leve. Almoço/tarde · reserva recomendada.",
  },
  {
    id: "dalmatino", name: "Dalmatino", destinationSlug: "hvar",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Queridinho da cidade velha; carpaccio de polvo, massa com trufa negra, filet mignon; rakija de cortesia. Jantar · reserva obrigatória · ruela de pedra.",
  },
  {
    id: "maestro-hvar", name: "Maestro", destinationSlug: "hvar",
    category: "traditional", priceRange: "€€",
    description:
      "Konoba de 10 mesas atrás da Catedral; três irmãos, dois pescadores. Polvo (carpaccio/grelhado) e peixe do dia. Jantar · reserva recomendada.",
  },
  {
    id: "totos", name: "Toto's (Palmižana)", destinationSlug: "hvar",
    category: "traditional", priceRange: "€€€",
    description:
      "Alternativa relaxada das Pakleni (família Meneghello); peixe grelhado entre palmeiras, mantém-se a mesa o dia todo. Almoço com banho de mar.",
  },
  {
    id: "carpe-diem", name: "Carpe Diem Beach (Marinkovac)", destinationSlug: "hvar",
    category: "sunset", priceRange: "€€€",
    description:
      "Beach club-festa lendário; DJs até a madrugada, chega-se de barco. Mais social que gastronômico. Tarde/noite · reserva recomendada.",
  },
  {
    id: "hula-hula", name: "Hula Hula", destinationSlug: "hvar",
    category: "sunset", priceRange: "€€€",
    description:
      "Beach club à beira-mar, instituição do pôr do sol de Hvar. Mais social que gastronômico — spritz, música e o sol no horizonte. Sunset descontraído.",
  },

  // ---------------- KORČULA ----------------
  {
    id: "ld-restaurant", name: "LD Restaurant (Lešić Dimitri)", destinationSlug: "korcula",
    category: "michelin", priceRange: "€€€€", distinction: "1★ Michelin",
    description:
      "Único estrelado da ilha (1★ desde 2020); chef Marko Gajski, terraço sobre a muralha. Sommelier Dinko Lozica (Michelin Award 2025). Jantar · reserva obrigatória · salas privativas.",
  },
  {
    id: "filippi", name: "Restaurant Filippi", destinationSlug: "korcula",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Primeiro fine dining da ilha; mesas sobre a água na promenade. Carpaccio de polvo, risoto negro, provas de Pošip e Grk. Almoço/jantar · chegada por barco.",
  },
  {
    id: "konoba-mate", name: "Konoba Mate (Pupnat)", destinationSlug: "korcula",
    category: "michelin", priceRange: "€€", distinction: "Bib Gourmand · Estrela Verde",
    description:
      "Bib Gourmand + Estrela Verde; família Farac, garden-to-table a 11 km. Ravioli de queijo de cabra, pašticada de 14h. Jantar · reserva obrigatória · transfer.",
  },
  {
    id: "adio-mare", name: "Konoba Adio Mare", destinationSlug: "korcula",
    category: "traditional", priceRange: "€€€",
    description:
      "Familiar desde 1974, junto à casa de Marco Polo. Scampi na buzara, brodet, pašticada, makaruni. Jantar (turnos 19h/21h) · reserva obrigatória.",
  },
  {
    id: "lole", name: "LoLe Wine & Tapas Bar", destinationSlug: "korcula",
    category: "wine-bar", priceRange: "€€",
    description:
      "Na escadaria de pedra; tapas de partilha e foco total em vinhos croatas (Grk e Pošip). Aperitivo/jantar · poucas mesas · reserva recomendada.",
  },
  {
    id: "aterina", name: "Konoba Aterina", destinationSlug: "korcula",
    category: "traditional", priceRange: "€€",
    description:
      "Taverna acima do porto com forte oferta vegetariana (raro na ilha); polvo, makaruni com vitela. Almoço/jantar · reserva recomendada.",
  },
  {
    id: "maslina", name: "Konoba Maslina", destinationSlug: "korcula",
    category: "traditional", priceRange: "€€",
    description:
      "A caminho de Lumbarda, sem firulas; pašticada, makaruni e figos com chocolate. Refúgio das multidões. Almoço/jantar · reserva recomendada.",
  },
  {
    id: "marco-polo-kor", name: "Konoba Marco Polo", destinationSlug: "korcula",
    category: "traditional", priceRange: "€€",
    description:
      "Familiar, junto à praça principal, em homenagem ao ilustre filho da ilha. Frutos do mar, grelhados e massas. Almoço/jantar · charmoso e casual.",
  },

  // ---------------- DUBROVNIK ----------------
  {
    id: "restaurant-360", name: "Restaurant 360°", destinationSlug: "dubrovnik",
    category: "michelin", priceRange: "€€€€", distinction: "1★ Michelin",
    website: "https://360dubrovnik.com",
    description:
      "Único estrelado de Dubrovnik (1★ desde 2018); chef Marijo Curić, sobre as muralhas e o porto antigo. 450+ rótulos, 70 a copo. Só jantar · reserva obrigatória · reabre 27/03/2026.",
  },
  {
    id: "nautika", name: "Nautika", destinationSlug: "dubrovnik",
    category: "fine-dining", priceRange: "€€€€",
    website: "https://nautikarestaurant.com",
    description:
      "O clássico de prestígio (edifício de 1881), vista de Lovrijenac e Bokar; eleito um dos mais românticos do mundo. Lagosta de Vis. Sunset/jantar · peça a “primeira fila”.",
  },
  {
    id: "proto", name: "Proto", destinationSlug: "dubrovnik",
    category: "traditional", priceRange: "€€€",
    description:
      "Frutos do mar desde 1886, terraço escondido no 1º andar; ostras de Ston, škampi na buzara, peixe do dia. Almoço/jantar · reserva recomendada.",
  },
  {
    id: "restaurant-dubrovnik", name: "Restaurant Dubrovnik", destinationSlug: "dubrovnik",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Terraço discreto sobre os telhados; vieiras com porcini, figos em Prošek; menus de 5 e 9 tempos. Almoço/jantar · reserva recomendada.",
  },
  {
    id: "stara-loza", name: "Stara Loza", destinationSlug: "dubrovnik",
    category: "fine-dining", priceRange: "€€€",
    description:
      "No Prijeko Palace (500 anos); rooftop íntimo de 16 lugares sobre os telhados. Sunset/jantar · reserva obrigatória (rooftop ~€120, sem elevador).",
  },
  {
    id: "above-5", name: "Above 5 Rooftop", destinationSlug: "dubrovnik",
    category: "fine-dining", priceRange: "€€€€",
    description:
      "No ponto mais alto da cidade velha; menus de 3/5 tempos, massa em bisque de lagosta. Início da noite · reserva obrigatória · sobem-se 5 andares.",
  },
  {
    id: "marco-polo-dub", name: "Restaurant Marco Polo", destinationSlug: "dubrovnik",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Pátio tranquilo na Lučarica, refúgio das multidões; cozinha inspirada na Rota da Seda, atum em crosta de gergelim. Menus de grupo e privatização (10–30).",
  },
  {
    id: "banje-beach", name: "Banje Beach", destinationSlug: "dubrovnik",
    category: "beach-club", priceRange: "€€€",
    description:
      "Beach club icônico junto ao porto antigo, vista da cidade murada e de Lokrum; vira clube à noite. Almoço/sunset · eventos e casamentos (30+).",
  },
  {
    id: "coral-beach", name: "Coral Beach Club", destinationSlug: "dubrovnik",
    category: "beach-club", priceRange: "€€€",
    description:
      "Em Babin Kuk/Lapad; pôr do sol a oeste, cabanas e DJ. Mediterrâneo e coquetéis. Dia/sunset · chegada por barco · gasto mínimo para cabanas.",
  },
  {
    id: "cave-bar-more", name: "Cave Bar More", destinationSlug: "dubrovnik",
    category: "sunset", priceRange: "€€€",
    description:
      "Bar dentro de uma caverna natural com acesso ao mar (Hotel More, Lapad). Coquetéis e mergulho. Dia/sunset · ambiente único.",
  },
  {
    id: "panorama", name: "Panorama Restaurant & Bar", destinationSlug: "dubrovnik",
    category: "sunset", priceRange: "€€€",
    description:
      "No topo do Monte Srđ (teleférico); vista aérea da cidade murada e das ilhas. Cozinha dálmata. Pôr do sol · reserva recomendada.",
  },
  {
    id: "buza-bar", name: "Buža Bar", destinationSlug: "dubrovnik",
    category: "sunset", priceRange: "€€",
    description:
      "Não é um restaurante, é um rito: atravessa-se um “buraco na muralha” (buža) para um bar cravado nas rochas, sobre o mar aberto. Um spritz ao pôr do sol e banho a partir das pedras.",
  },

  // ---------------- MAKARSKA ----------------
  {
    id: "jeny", name: "Restaurant Jeny (Tučepi)", destinationSlug: "makarska",
    category: "michelin", priceRange: "€€€€", distinction: "Guia Michelin",
    description:
      "A melhor mesa da Riviera (no Guia desde 2018); família Čović, terraço a ~250 m. Só menus degustação (7 tempos €150). Jantar · reserva obrigatória · transfer do hotel.",
  },
  {
    id: "arta-larga", name: "Arta Larga by Gastro Diva", destinationSlug: "makarska",
    category: "fine-dining", priceRange: "€€€",
    description:
      "O criativo chef-driven dentro da cidade, na rua Kalalarga; mediterrâneo tradicional com técnica moderna e ótimo produto. Jantar · reserva recomendada.",
  },
  {
    id: "riva-makarska", name: "Restaurant Riva", destinationSlug: "makarska",
    category: "traditional", priceRange: "€€€",
    description:
      "Na promenade; peixe desembarcado de manhã e cortado à mesa, maior carta de vinhos croatas de Makarska. Almoço/jantar · terraço de pinheiros · jantar privado.",
  },
  {
    id: "jez", name: "Restaurant Jež", destinationSlug: "makarska",
    category: "traditional", priceRange: "€€€",
    description:
      "Favorito local do chef Jadran Grančić; sopa de camarão famosa, peixe-espada, pão caseiro. Almoço/jantar · reserva recomendada.",
  },
  {
    id: "cvit-soli", name: "Cvit Soli", destinationSlug: "makarska",
    category: "fine-dining", priceRange: "€€€",
    description:
      "Beira-mar, do café ao jantar; Wellington de lombo, risoto de camarão, peixe em crosta de sal. Sunset/jantar · ~€45–50/pessoa.",
  },
  {
    id: "the-above", name: "The Above Rooftop", destinationSlug: "makarska",
    category: "fine-dining", priceRange: "€€€",
    description:
      "No 7º andar do Aminess Khalani 5*; vista de Brač e do Biokovo, releituras dálmatas, música ao vivo. Sunset/jantar · reserva recomendada.",
  },
  {
    id: "hrpina", name: "Restaurant Hrpina", destinationSlug: "makarska",
    category: "traditional", priceRange: "€€€",
    description:
      "Instituição familiar (50 anos), no centro histórico; famosa pela peka (encomende com 24h). Almoço/jantar · reserva recomendada.",
  },
  {
    id: "kalalarga", name: "Konoba Kalalarga", destinationSlug: "makarska",
    category: "traditional", priceRange: "€€",
    description:
      "Taverna atmosférica do centro; peixe do dia por peso (~€85/kg). Almoço/jantar · confirme o valor na chegada.",
  },
  {
    id: "peskera", name: "Peškera", destinationSlug: "makarska",
    category: "traditional", priceRange: "€€",
    description:
      "Sourcing local e tradição dálmata; peixe e mariscos frescos. Almoço/jantar · bom atendimento a grupos.",
  },
  {
    id: "buba-beach", name: "Buba Beach Bar", destinationSlug: "makarska",
    category: "beach-club", priceRange: "€€",
    description:
      "Enseada de seixos; DJ ao meio-dia, espreguiçadeiras e clima de festa ao pôr do sol (não é fine dining). Dia/sunset.",
  },
]);

export function getRestaurant(id: string) {
  return restaurants.find((r) => r.id === id);
}

export function getRestaurantsForDestination(slug: string) {
  return restaurants.filter((r) => r.destinationSlug === slug);
}

export const restaurantCategories: { id: RestaurantCategory; label: string }[] = [
  { id: "michelin", label: "Michelin" },
  { id: "fine-dining", label: "Fine Dining" },
  { id: "beach-club", label: "Beach Clubs" },
  { id: "sunset", label: "Sunset Spots" },
  { id: "wine-bar", label: "Wine Bars" },
  { id: "traditional", label: "Tradicional Croata" },
];
