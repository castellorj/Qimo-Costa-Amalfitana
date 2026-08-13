/**
 * QIMO Croatia Experience 2026 — Content Layer Types
 * ---------------------------------------------------
 * This is the single source of truth for all editorial content.
 * It is intentionally framework-agnostic and serialisable so it can be
 * swapped 1:1 for a Supabase / Sanity backend later without touching the UI.
 *
 * Mapping to a future Supabase schema is documented in /content/SCHEMA.md
 */

export type Coordinates = {
  lat: number;
  lng: number;
};

export type ImageAsset = {
  /** Remote or local URL. Swap for Supabase Storage / signed URL later. */
  src: string;
  alt: string;
  /** Optional photographer / credit for editorial captions. */
  credit?: string;
};

export type PriceRange = "€" | "€€" | "€€€" | "€€€€";

export type RestaurantCategory =
  | "michelin"
  | "fine-dining"
  | "beach-club"
  | "sunset"
  | "wine-bar"
  | "traditional";

export type GrapeVariety =
  | "Plavac Mali"
  | "Dingač"
  | "Postup"
  | "Pošip"
  | "Grk"
  | "Bogdanuša";

export interface PointOfInterest {
  /** Id estável (qimo_pois.id) para associar a galeria de fotos. */
  id?: string;
  name: string;
  description: string;
  coordinates?: Coordinates;
  /** Foto de capa do ponto. */
  photo?: string;
  /** Galeria do ponto (qimo_item_photos) — alimenta o botão "Fotos". */
  gallery?: ImageAsset[];
}

export interface Restaurant {
  id: string;
  name: string;
  /** Slug of the destination it belongs to, for cross-linking. */
  destinationSlug: string;
  category: RestaurantCategory;
  priceRange: PriceRange;
  description: string;
  image: ImageAsset;
  coordinates?: Coordinates;
  phone?: string;
  website?: string;
  /** e.g. "1 Michelin Star", "Bib Gourmand" */
  distinction?: string;
  /** Galeria do restaurante (qimo_item_photos) — alimenta o botão "Fotos". */
  gallery?: ImageAsset[];
}

export interface PracticalInfo {
  label: string;
  value: string;
}

export interface Destination {
  /** stable slug, also the route segment: /destinos/[slug] */
  slug: string;
  /** Day index in the itinerary, 1-based. */
  day: number;
  /** ISO date for that day of the voyage. */
  date: string;
  name: string;
  /** Short evocative kicker, e.g. "The Stone Garden of the Adriatic" */
  tagline: string;
  /** One-line route shown on the dashboard, e.g. "Korčula → Dubrovnik" */
  route?: string;
  hero: ImageAsset;
  /** Long-form editorial introduction. Markdown-free paragraphs. */
  introduction: string[];
  pointsOfInterest: PointOfInterest[];
  restaurantIds: string[];
  gallery: ImageAsset[];
  practical: PracticalInfo[];
  /** Oculta a seção "Informações práticas" desta cidade (toggle no admin). */
  hidePractical?: boolean;
  coordinates: Coordinates;
  /** Average high temperature in °C for late July, for the dashboard. */
  tempC: number;
  /** Local sunset time HH:MM for late July. */
  sunset: string;
  /** Código de condição WMO, preenchido em runtime pelo clima ao vivo. */
  weatherCode?: number;
}

export interface ScheduleEvent {
  time: string; // "18:00"
  title: string;
  detail?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  destinationSlug: string;
  /** Curated timeline of the day aboard. */
  schedule: ScheduleEvent[];
}

export interface Winery {
  /** Id estável (qimo_wineries.id) para associar a galeria de fotos. */
  id?: string;
  name: string;
  region: string;
  badge?: string;
  description: string;
  /** Site oficial da vinícola — alimenta o botão "Site". */
  website?: string;
  /** Galeria da vinícola (qimo_item_photos) — alimenta o botão "Fotos". */
  gallery?: ImageAsset[];
}

export interface WineRegion {
  slug: string;
  name: string;
  island: boolean;
  coordinates: Coordinates;
  history: string;
  grapes: string[];
  wineries: Winery[];
  experiences: string[];
  image: ImageAsset;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  kind: "prato" | "ingrediente" | "tecnica" | "lugar";
}

export interface ShoppingItem {
  id?: string;
  name: string;
  category: string;
  badge?: string;
  description: string;
  /** Foto de capa do item (editável na ficha). */
  image?: ImageAsset;
  /** Fotos do item (galeria por item), exibidas no botão "Fotos". */
  gallery?: ImageAsset[];
}

export interface ConciergeContact {
  label: string;
  value: string;
  href?: string;
}

export interface ConciergeSection {
  id: string;
  title: string;
  /** Free-form lines rendered as an editorial list. */
  items: { label: string; value: string }[];
}

export interface ChecklistItem {
  label: string;
  category: string;
}

export interface Experience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: ImageAsset;
}

export interface Offer {
  id: string;
  /** Nome do patrocinador/parceiro. */
  sponsor: string;
  /** Categoria do anúncio, ex.: "Champagne", "Transfers", "Bem-estar". */
  category: string;
  /** Chamada da oferta. */
  title: string;
  description: string;
  image: ImageAsset;
  /** Ação (resgatar com o concierge, site do parceiro, etc.). */
  cta?: { label: string; href: string };
  /** Destaque grande no topo da página. */
  featured?: boolean;
  /** Formulário de captação de lead (ex.: cotação de seguro). Quando ativo,
   *  o card mostra um botão que abre um formulário e envia ao parceiro. */
  form?: {
    cta: string;          // texto do botão (ex.: "Solicitar cotação")
    intro?: string;       // texto curto acima dos campos
    fields: string[];     // rótulos dos campos (ex.: ["Nome", "Telefone", "Destino"])
  };
}

export interface Tip {
  id: string;
  /** Título curto da dica. */
  title: string;
  /** Texto da dica — uma a duas frases. */
  body: string;
  /** Dia da viagem (1..N) ou null/0 = geral (todos os dias). */
  day?: number | null;
}

export interface Trip {
  title: string;
  subtitle: string;
  startDate: string; // ISO
  endDate: string; // ISO
  /** Human label, e.g. "25 Julho — 1 Agosto" */
  dateLabel: string;
  year: number;
  vessel: string;
  hero: ImageAsset;
  /** Frase grande na home antes da viagem ("Falta pouco…"). */
  countdownMessage?: string;
  /** Mostrar a frase/“Hoje” pré-viagem só até esta data (YYYY-MM-DD). */
  countdownUntil?: string | null;
  /** Texto explicativo opcional, exibido abaixo da frase. */
  countdownNote?: string | null;
}
