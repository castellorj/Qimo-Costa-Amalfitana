import { ChevronDown, Check, Instagram, Globe } from "lucide-react";
import { EditorialImage } from "@/components/ui/editorial-image";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { PastEditions } from "@/components/proposal/past-editions";
import { Countdown } from "@/components/proposal/countdown";
import { BrandLogo } from "@/components/proposal/brand-logo";
import { RoteiroGrid } from "@/components/proposal/roteiro-grid";
import { FaqTopics } from "@/components/proposal/faq-topics";
import { EntryScreen } from "@/components/proposal/entry-screen";
import { cabins, cabinsNote } from "@/content/cabins";
import { proposal } from "@/content/proposal";
import { getEditableContent } from "@/lib/content-remote";
import { formatRange } from "@/lib/date";

// Lê o banco a cada acesso: edições no /admin refletem na hora (sem cache ISR).
export const dynamic = "force-dynamic";
export const revalidate = 0;

function Kicker({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={dark ? "overline-on-dark" : "overline"}>{children}</span>;
}

export default async function Home() {
  const c = await getEditableContent();
  const dateLabel = formatRange(c.startDate, c.endDate);
  const roteiroData = c.roteiro.map((d, i) => ({
    slug: d.slug || `city-${i}`,
    day: d.day,
    name: d.name,
    tagline: d.tagline,
    heroSrc: d.photo,
    heroAlt: d.name,
    introduction: d.intro.split("\n").map((s) => s.trim()).filter(Boolean),
    pois: d.pois.filter((p) => p.name.trim() || p.description.trim()),
  }));
  return (
    <>
      {c.entryEnabled && (
        <EntryScreen
          image={c.entryImage}
          kicker={c.entryKicker}
          title={c.entryTitle}
          subtitle={c.entrySubtitle}
          cta={c.entryCta}
        />
      )}
      <BrandLogo
        nav={{
          roteiro: c.navRoteiro,
          galeria: c.navGaleria,
          barco: c.navBarco,
          valores: c.navValores,
          duvidas: c.navDuvidas,
        }}
      />

      {/* ======================= 1 · INTRO (HERO) ======================= */}
      <section id="topo" className="relative min-h-dvh overflow-hidden bg-deep text-offwhite">
        <EditorialImage
          src={proposal.hero.image}
          alt="A costa italiana vista do mar, ao amanhecer"
          wrapperClassName="absolute inset-0"
          priority
          kenBurns
          sizes="100vw"
        />
        <div className="scrim-hero absolute inset-0" />
        <div className="text-on-photo relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 py-8 text-center">
          <span className="overline-on-dark">{c.heroKicker}</span>
          <h1 className="mt-2 font-cormorant text-6xl font-normal uppercase leading-[0.92] tracking-[0.05em] text-balance drop-shadow-[0_2px_20px_rgba(4,32,60,0.55)] sm:text-8xl">
            {c.heroTitle}
          </h1>
          <p className="mt-3 font-cormorant text-3xl tracking-[0.22em] text-gold-soft sm:text-4xl">
            {c.heroYear}
          </p>
          {c.showDates && (
            <Countdown
              target={c.startDate}
              label={c.countdownLabel}
              units={[c.countdownDays, c.countdownHours, c.countdownMinutes, c.countdownSeconds]}
            />
          )}
          <div className="rule-gold mx-auto my-6 !bg-gold/70" />
          <p className="max-w-md font-cormorant text-xl leading-relaxed text-offwhite/90 sm:text-2xl">
            {c.heroSubtitle}
          </p>
          {(c.showDates || c.heroNights) && (
            <p className="mt-4 font-sans text-sm font-semibold uppercase tracking-wide2 text-gold-soft">
              {c.showDates ? (c.heroNights ? `${dateLabel} · ${c.heroNights}` : dateLabel) : c.heroNights}
            </p>
          )}
          <p className="mt-8 max-w-xs font-sans text-[0.72rem] uppercase leading-relaxed tracking-wide2 text-gold-soft/90 sm:max-w-none sm:text-[0.8rem]">
            {c.heroCities}
          </p>
        </div>
        <a
          href="#roteiro"
          aria-label="Rolar para baixo"
          className="absolute bottom-3 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center text-offwhite/70 transition-colors hover:text-gold-soft"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </section>

      {/* frase-convite curta (parte da intro) — opcional, controlada no /admin */}
      {c.showManifesto && c.manifesto?.trim() && (
        <section id="sobre" className="bg-deep px-6 pb-20 text-center text-offwhite">
          <Reveal className="mx-auto max-w-editorial">
            <p className="font-cormorant text-3xl font-light leading-[1.4] text-balance sm:text-[2.4rem]">
              {c.manifesto}
            </p>
          </Reveal>
        </section>
      )}

      {/* ==================== 2 · ROTEIRO COM FOTOS ===================== */}
      <section id="roteiro" className="bg-offwhite px-6 py-12 sm:py-16">
        <Reveal className="mx-auto mb-8 max-w-editorial text-center">
          <Kicker>{c.roteiroKicker}</Kicker>
          <h2 className="mt-3 font-cormorant text-4xl leading-tight sm:text-5xl">
            {c.roteiroTitle}
          </h2>
        </Reveal>
        <RoteiroGrid
          items={roteiroData}
          dayPrefix={c.roteiroDayPrefix}
          cardCta={c.roteiroCardCta}
          highlightsLabel={c.roteiroHighlightsLabel}
          swipeHint={c.roteiroSwipeHint}
        />
      </section>

      {/* ============= 3 · GALERIA — EDIÇÕES ANTERIORES ================ */}
      {c.pastEditions.length > 0 && (
        <section id="galeria" className="bg-deep py-12 text-offwhite sm:py-16">
          <Reveal className="mx-auto mb-8 max-w-editorial px-6 text-center">
            <Kicker dark>{c.pastKicker}</Kicker>
            <h2 className="mt-3 font-cormorant text-4xl leading-tight text-offwhite sm:text-5xl">
              {c.pastTitle}
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-offwhite/60">
              {c.pastSubtitle}
            </p>
          </Reveal>
          <Reveal className="mx-auto max-w-6xl md:px-6">
            <PastEditions items={c.pastEditions} />
          </Reveal>
        </section>
      )}

      {/* ===================== · A EMBARCAÇÃO ========================== */}
      {c.boatPhotos.length > 0 && (
        <section id="barco" className="bg-sand-light py-12 sm:py-16">
          <Reveal className="mx-auto mb-8 max-w-editorial px-6 text-center">
            <Kicker>{c.boatKicker}</Kicker>
            <h2 className="mt-3 font-cormorant text-4xl leading-tight sm:text-5xl">
              {c.boatTitle}
            </h2>
            {c.boatCapacity.trim() && (
              <p className="mt-4 inline-block rounded-full border border-deep-700/25 bg-deep-700/[0.08] px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wide2 text-deep-700">
                {c.boatCapacity}
              </p>
            )}
          </Reveal>
          <Reveal className="mx-auto max-w-6xl md:px-6">
            <PastEditions items={c.boatPhotos} />
          </Reveal>
          {c.boatNote && (
            <Reveal className="mx-auto mt-8 max-w-editorial px-6">
              <p className="rounded-xl border border-gold/25 bg-offwhite/60 px-5 py-4 text-center font-sans text-xs leading-relaxed text-deep/65">
                {c.boatNote}
              </p>
            </Reveal>
          )}
        </section>
      )}

      {/* ================= 4 · VALOR & O QUE ESTÁ INCLUÍDO ============= */}
      <section id="valores" className="bg-offwhite px-6 py-12 sm:py-16">
        <Reveal className="mx-auto mb-8 max-w-editorial text-center">
          <Kicker>{c.valueKicker}</Kicker>
          <h2 className="mt-3 font-cormorant text-4xl leading-tight sm:text-5xl">
            {c.valueTitle}
          </h2>
          <p className="mt-4 font-cormorant text-3xl text-deep-700">
            {c.priceFrom ? `${c.priceLabel} ${c.priceFrom}`.trim() : c.priceFallback}
          </p>
          {c.priceNote && (
            <p className="mt-2 font-sans text-sm text-deep/60">{c.priceNote}</p>
          )}
        </Reveal>

        {/* ---- Categorias de cabine (5 cards) ---- */}
        <RevealGroup className="mx-auto mb-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cabins.map((cab) => (
            <Reveal
              as="article"
              key={cab.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-deep/10 bg-offwhite shadow-[0_1px_2px_rgba(4,32,60,0.04)]"
            >
              <EditorialImage
                src={cab.image}
                alt={`${cab.name} · Variety Voyager`}
                wrapperClassName="relative aspect-[4/3] w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-wide2 text-gold-deep">
                  {cab.deck}
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <h3 className="font-cormorant text-2xl text-deep">{cab.name}</h3>
                  <span className="font-cormorant text-2xl text-deep-700">{cab.price}</span>
                </div>
                <dl className="mt-4 flex flex-col gap-2 border-t border-deep/10 pt-4 font-sans text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-deep/45">Janela</dt>
                    <dd className="text-right text-deep/80">{cab.specs.window}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-deep/45">Camas</dt>
                    <dd className="text-right text-deep/80">{cab.specs.beds}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-deep/45">Tamanho</dt>
                    <dd className="text-right text-deep/80">{cab.specs.size}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
        {cabinsNote && (
          <p className="mx-auto mb-12 max-w-editorial text-center font-sans text-xs leading-relaxed text-deep/55">
            {cabinsNote}
          </p>
        )}

        <RevealGroup className="mx-auto grid max-w-4xl gap-x-10 gap-y-4 sm:grid-cols-2">
          {c.included.map((it) => (
            <Reveal as="div" key={it.label} className="flex gap-3.5 border-b border-deep/10 pb-4">
              <Check className="mt-1 h-5 w-5 shrink-0 text-deep-700" />
              <div>
                <p className="font-cormorant text-xl text-deep">{it.label}</p>
                {it.detail && <p className="font-sans text-sm text-deep/55">{it.detail}</p>}
              </div>
            </Reveal>
          ))}
        </RevealGroup>
        {c.notIncluded.trim() && (
          <div className="mx-auto mt-10 max-w-lg rounded-xl border border-gold/30 bg-sand-light/70 px-6 py-5 text-center">
            {c.notIncludedLabel.trim() && (
              <p className="font-sans text-xs font-semibold uppercase tracking-wide2 text-deep-700">
                {c.notIncludedLabel}
              </p>
            )}
            <p className="mt-2 font-sans text-[0.98rem] leading-relaxed text-deep/75">
              {c.notIncluded}
            </p>
          </div>
        )}
      </section>

      {/* ================= · PRINCIPAIS DÚVIDAS ======================= */}
      {c.faqTopics.some((t) => t.enabled && t.title.trim()) && (
        <section id="duvidas" className="bg-sand-light px-6 py-12 sm:py-16">
          <Reveal className="mx-auto mb-8 max-w-editorial text-center">
            <Kicker>{c.faqKicker}</Kicker>
            <h2 className="mt-3 font-cormorant text-4xl leading-tight sm:text-5xl">{c.faqTitle}</h2>
          </Reveal>
          <Reveal>
            <FaqTopics topics={c.faqTopics} />
          </Reveal>
        </section>
      )}

      {/* =========================== FINALE =========================== */}
      <section className="relative overflow-hidden bg-deep px-6 py-20 text-offwhite sm:py-28">
        <EditorialImage
          src="/images/amalfi/naples-bay-farewell.jpg"
          alt="O golfo de Nápoles ao entardecer, com o Vesúvio ao fundo"
          wrapperClassName="absolute inset-0 opacity-45"
          kenBurns
          sizes="100vw"
        />
        <div className="scrim-full absolute inset-0" />
        <div className="text-on-photo relative z-10 mx-auto max-w-xl text-center">
          <Kicker dark>{c.guestsNote}</Kicker>
          <h2 className="mt-5 font-cormorant text-5xl font-light uppercase leading-[0.95] tracking-[0.04em] text-offwhite sm:text-7xl">
            {c.finaleTitle}
          </h2>
          <div className="rule-gold mx-auto my-7 !bg-gold/70" />
          <p className="font-cormorant text-2xl leading-relaxed text-offwhite/90">
            {[c.showDates ? dateLabel : "", c.heroNights, [c.finaleAboard, c.vessel].filter(Boolean).join(" ")]
              .map((s) => s.trim())
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </section>

      <footer className="bg-deep px-6 pb-16 pt-4 text-center text-offwhite/70">
        <div className="rule-gold mx-auto mb-5 !bg-gold/50" />
        <p className="font-cormorant text-2xl text-offwhite">{c.groupName}</p>
        {c.footerNote.trim() && (
          <p className="mx-auto mt-3 max-w-xs font-sans text-xs leading-relaxed text-offwhite/50">
            {c.footerNote.replaceAll("{datas}", c.showDates ? dateLabel : "").replace(/ · +· /g, " · ").replace(/(^| )· | ·$/g, "$1").trim()}
          </p>
        )}
        {(c.instagramUrl || c.siteUrl) && (
          <div className="mt-5 flex items-center justify-center gap-3">
            {c.instagramUrl && (
              <a
                href={c.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da QIMO"
                className="flex h-11 w-11 items-center justify-center rounded-full text-offwhite/70 transition-colors hover:bg-offwhite/5 hover:text-gold-soft"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {c.siteUrl && (
              <a
                href={c.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Site da QIMO"
                className="flex h-11 w-11 items-center justify-center rounded-full text-offwhite/70 transition-colors hover:bg-offwhite/5 hover:text-gold-soft"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </footer>
    </>
  );
}
