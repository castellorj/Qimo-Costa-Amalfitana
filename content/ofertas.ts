import type { Offer } from "./types";

/**
 * Ofertas QIMO — espaço de patrocinadores/parceiros.
 *
 * Conteúdo PLACEHOLDER, pronto para ser substituído pelos anúncios reais dos
 * patrocinadores. Para cada oferta: troque `sponsor`, `title`, `description`,
 * a imagem (public/images/photos/… ou /images/oferta-*.svg) e o `cta`.
 * A primeira com `featured: true` aparece em destaque no topo.
 */
export const offers: Offer[] = [
  {
    id: "champagne",
    sponsor: "Parceiro · Champagne",
    category: "Boas-vindas",
    title: "Champagne de boas-vindas a bordo",
    description:
      "Uma garrafa selecionada do nosso parceiro, gelada e à sua espera na cabine no embarque. Cortesia exclusiva para os hóspedes QIMO.",
    image: { src: "/images/oferta-featured.svg", alt: "Champagne de boas-vindas a bordo" },
    cta: { label: "Resgatar com o concierge", href: "/concierge" },
    featured: true,
  },
  {
    id: "relojoaria",
    sponsor: "Boutique Parceira",
    category: "Alta Relojoaria",
    title: "Atelier privado em Dubrovnik",
    description:
      "Visita reservada à boutique parceira na cidade velha, com champagne e atendimento dedicado. Mediante agendamento.",
    image: { src: "/images/oferta-1.svg", alt: "Alta relojoaria — atelier privado" },
    cta: { label: "Agendar visita", href: "/concierge" },
  },
  {
    id: "transfer-heli",
    sponsor: "Parceiro de Aviação",
    category: "Transfers VIP",
    title: "Transfer de helicóptero Split ⇄ iate",
    description:
      "Chegue e parta pelos ares, com vista da costa dálmata. Tarifa especial para hóspedes QIMO.",
    image: { src: "/images/oferta-2.svg", alt: "Transfer de helicóptero" },
    cta: { label: "Reservar", href: "/concierge" },
  },
  {
    id: "spa",
    sponsor: "Bem-estar Parceiro",
    category: "Spa & Bem-estar",
    title: "Massagem a bordo ao pôr do sol",
    description:
      "Terapeuta a bordo para um ritual relaxante no convés, ao fim da tarde. Vagas limitadas por dia.",
    image: { src: "/images/oferta-3.svg", alt: "Spa e bem-estar a bordo" },
    cta: { label: "Agendar", href: "/concierge" },
  },
  {
    id: "resortwear",
    sponsor: "Moda Parceira",
    category: "Resortwear",
    title: "Cápsula de verão a bordo",
    description:
      "Seleção de resortwear do parceiro disponível para experimentar e adquirir durante a viagem.",
    image: { src: "/images/oferta-4.svg", alt: "Resortwear de verão" },
    cta: { label: "Ver seleção", href: "/concierge" },
  },
  {
    id: "vinho",
    sponsor: "Vinícola Parceira",
    category: "Degustação",
    title: "Degustação privativa em Pelješac",
    description:
      "Prova reservada de Dingač e Pošip na adega parceira, com harmonização. Cortesia para hóspedes QIMO.",
    image: { src: "/images/oferta-5.svg", alt: "Degustação privativa de vinhos" },
    cta: { label: "Reservar", href: "/concierge" },
  },
];

export function getFeaturedOffer() {
  return offers.find((o) => o.featured) ?? offers[0];
}
