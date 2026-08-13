import { proposal, type PastMedia, type FaqTopic, type RoteiroCity } from "@/content/proposal";
import { destinations } from "@/content";
import { cabins as defaultCabins, cabinsNote as defaultCabinsNote, type Cabin } from "@/content/cabins";
import frozenContent from "@/content/base-content.json";
import { PROPOSAL_ID } from "./proposal-id";

/** Roteiro padrão = as escalas do guia, ordenadas por dia (fallback do editor). */
const defaultRoteiro: RoteiroCity[] = [...destinations]
  .sort((a, b) => a.day - b.day)
  .map((d) => ({
    slug: d.slug,
    day: d.day,
    name: d.name,
    tagline: d.tagline,
    photo: d.hero.src,
    intro: d.introduction.join("\n\n"),
    pois: d.pointsOfInterest.map((p) => ({ name: p.name, description: p.description })),
  }));

/**
 * Textos editáveis pelo /admin. O que NÃO está aqui (destinos, restaurantes,
 * vinhos, experiências) continua vindo dos arquivos estáticos.
 */
export type EditableContent = {
  groupName: string;
  vessel: string;
  /** Datas ISO (YYYY-MM-DD). Alimentam o texto exibido e a contagem regressiva. */
  startDate: string;
  endDate: string;
  guestsNote: string;
  heroOverline: string;
  heroKicker: string;
  heroTitle: string;
  heroYear: string;
  heroSubtitle: string;
  heroCities: string;
  heroNights: string;
  waitlistCta: string;
  entryEnabled: boolean;
  entryKicker: string;
  entryTitle: string;
  entrySubtitle: string;
  entryCta: string;
  entryImage: string;
  manifesto: string;
  showManifesto: boolean;
  /** Mostrar as datas (hero, contagem, fim, rodapé). Falso = oculta todas. */
  showDates: boolean;
  pillars: { title: string; body: string }[];
  included: { label: string; detail?: string }[];
  notIncluded: string;
  /** Rótulo antes do valor (ex.: "A partir de"). */
  priceLabel: string;
  /** Valor da viagem. Vazio = mostra "sob consulta". Ex.: "€ 4.900 por pessoa". */
  priceFrom: string;
  priceNote: string;
  faq: { q: string; a: string }[];
  /** Títulos das seções. */
  roteiroKicker: string;
  roteiroTitle: string;
  pastKicker: string;
  pastTitle: string;
  pastSubtitle: string;
  valueKicker: string;
  valueTitle: string;
  faqKicker: string;
  faqTitle: string;
  faqTopics: FaqTopic[];
  finaleTitle: string;
  /** Menu fixo do topo (desktop). Um rótulo por seção. */
  navRoteiro: string;
  navGaleria: string;
  navBarco: string;
  navValores: string;
  navDuvidas: string;
  /** Contagem regressiva: rótulo e as quatro unidades. */
  countdownLabel: string;
  countdownDays: string;
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  /** Roteiro: prefixo do dia, botão do card e rótulo dos destaques no modal. */
  roteiroDayPrefix: string;
  roteiroCardCta: string;
  roteiroHighlightsLabel: string;
  /** Dica de deslizar do carrossel. Use {n} para o número de paradas. */
  roteiroSwipeHint: string;
  /** Valores: texto quando não há preço, e rótulo do box do "não incluído". */
  priceFallback: string;
  notIncludedLabel: string;
  /** Finale: conector entre as noites e o nome da embarcação. */
  finaleAboard: string;
  /** Rodapé. Use {datas} onde o período da viagem deve aparecer. */
  footerNote: string;
  /** Galeria de edições anteriores (fotos + vídeos), gerenciada no /admin. */
  pastEditions: PastMedia[];
  /** Seção da embarcação (categoria do barco). */
  boatKicker: string;
  boatTitle: string;
  /** Capacidade da embarcação, em destaque sob o título. Vazio = oculta. */
  boatCapacity: string;
  boatNote: string;
  boatPhotos: PastMedia[];
  /** Categorias de cabine (nome, deck, preço, specs, foto) — editável no /admin. */
  cabins: Cabin[];
  /** Nota abaixo do carrossel de cabines. */
  cabinsNote: string;
  /** Roteiro completo e editável (dia, cidade, chamada, textos, destaques). */
  roteiro: RoteiroCity[];
  /** LEGADO: fotos do roteiro por cidade (slug → URL). Migrado para `roteiro`. */
  roteiroPhotos: Record<string, string>;
  /** Links do rodapé. Vazio = oculta. */
  instagramUrl: string;
  siteUrl: string;
  /** Prévia do link (WhatsApp/redes). Vazio = usa o texto automático. */
  shareTitle: string;
  shareDescription: string;
  /** Imagem da prévia do link. Vazio = usa a imagem gerada (design 2027). */
  shareImage: string;
};

/** Valores padrão = os textos estáticos atuais (fallback se o banco falhar). */
export const defaults: EditableContent = {
  groupName: proposal.groupName,
  vessel: proposal.vessel,
  startDate: proposal.startDate,
  endDate: proposal.endDate,
  guestsNote: proposal.guestsNote,
  heroOverline: proposal.hero.overline,
  heroKicker: proposal.hero.kicker,
  heroTitle: proposal.hero.title,
  heroYear: proposal.hero.year,
  heroSubtitle: proposal.hero.subtitle,
  heroCities: proposal.hero.cities,
  heroNights: proposal.heroNights,
  waitlistCta: proposal.waitlistCta,
  entryEnabled: proposal.entryEnabled,
  entryKicker: proposal.entryKicker,
  entryTitle: proposal.entryTitle,
  entrySubtitle: proposal.entrySubtitle,
  entryCta: proposal.entryCta,
  entryImage: proposal.entryImage,
  manifesto: proposal.manifesto,
  showManifesto: proposal.showManifesto,
  showDates: true,
  pillars: proposal.pillars,
  included: proposal.included,
  notIncluded: proposal.notIncluded,
  priceLabel: proposal.priceLabel,
  priceFrom: proposal.priceFrom ?? "",
  priceNote: proposal.priceNote,
  faq: proposal.faq,
  roteiroKicker: proposal.headings.roteiroKicker,
  roteiroTitle: proposal.headings.roteiroTitle,
  pastKicker: proposal.headings.pastKicker,
  pastTitle: proposal.headings.pastTitle,
  pastSubtitle: proposal.headings.pastSubtitle,
  valueKicker: proposal.headings.valueKicker,
  valueTitle: proposal.headings.valueTitle,
  faqKicker: proposal.headings.faqKicker,
  faqTitle: proposal.headings.faqTitle,
  faqTopics: proposal.faqTopics,
  finaleTitle: proposal.headings.finaleTitle,
  navRoteiro: "Roteiro",
  navGaleria: "Galeria",
  navBarco: "O barco",
  navValores: "Valores",
  navDuvidas: "Dúvidas",
  countdownLabel: "Faltam",
  countdownDays: "dias",
  countdownHours: "hrs",
  countdownMinutes: "min",
  countdownSeconds: "seg",
  roteiroDayPrefix: "Dia",
  roteiroCardCta: "Conhecer mais",
  roteiroHighlightsLabel: "Destaques",
  roteiroSwipeHint: "Deslize para ver as {n} paradas",
  priceFallback: "Valores sob consulta",
  notIncludedLabel: "Não incluído",
  finaleAboard: "a bordo do",
  footerNote: "Uma experiência privada no mar Egeu · {datas} · por QIMO",
  pastEditions: proposal.pastEditions,
  boatKicker: proposal.boatKicker,
  boatTitle: proposal.boatTitle,
  boatCapacity: "18 a 19 cabines",
  boatNote: proposal.boatNote,
  boatPhotos: proposal.boatPhotos,
  cabins: defaultCabins,
  cabinsNote: defaultCabinsNote,
  roteiro: defaultRoteiro,
  roteiroPhotos: {},
  instagramUrl: proposal.instagramUrl,
  siteUrl: proposal.siteUrl,
  shareTitle: "",
  shareDescription: "",
  shareImage: "",
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Lê os textos do banco (rc2027_content). Blindado como aprendemos no incidente
 * de performance: timeout curto + fallback para os textos estáticos, para um
 * banco lento/indisponível NUNCA derrubar o link compartilhado.
 * Cacheado via ISR (revalidate 60s).
 */
export async function getEditableContent(): Promise<EditableContent> {
  // Cópia independente: lê SÓ a linha desta proposta (PROPOSAL_ID). Enquanto ela
  // não existir no banco, vale o conteúdo aprovado em 21/07/2026 (congelado no
  // repositório) — então nada muda até alguém editar pelo admin.
  // `defaults` primeiro: garante que campos novos (adicionados depois do
  // congelamento) tenham valor, em vez de sair vazios na página.
  const raw = { ...defaults, ...(frozenContent as Partial<EditableContent>) } as EditableContent;
  // Sem `roteiro` explícito, vale o roteiro do guia — e aí as fotos legadas
  // (roteiroPhotos, slug → URL) valem sobre as imagens padrão. É o mesmo que o
  // /admin já fazia ao carregar; a página pública ignorava.
  const base: EditableContent = {
    ...raw,
    roteiro: raw.roteiro.map((city) => ({
      ...city,
      photo: raw.roteiroPhotos?.[city.slug] || city.photo,
    })),
  };
  if (!SUPABASE_URL || !SUPABASE_KEY) return base;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/rc2027_content?id=eq.${encodeURIComponent(PROPOSAL_ID)}&select=data`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        signal: ctrl.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timer);
    if (!res.ok) return base;
    const rows = (await res.json()) as { data?: Partial<EditableContent> }[];
    const data = rows?.[0]?.data;
    if (!data) return base;
    // Overlay campo a campo; listas só substituem se vierem como array.
    return {
      ...base,
      ...data,
      pillars: data.pillars?.length ? data.pillars : base.pillars,
      included: data.included?.length ? data.included : base.included,
      faq: data.faq?.length ? data.faq : base.faq,
      pastEditions: Array.isArray(data.pastEditions) ? data.pastEditions : base.pastEditions,
      boatPhotos: Array.isArray(data.boatPhotos) ? data.boatPhotos : base.boatPhotos,
      faqTopics: Array.isArray(data.faqTopics) ? data.faqTopics : base.faqTopics,
      cabins: Array.isArray(data.cabins) && data.cabins.length ? data.cabins : base.cabins,
      roteiro: Array.isArray(data.roteiro) ? data.roteiro : base.roteiro,
      roteiroPhotos: data.roteiroPhotos ?? base.roteiroPhotos ?? {},
    };
  } catch {
    return base;
  }
}
