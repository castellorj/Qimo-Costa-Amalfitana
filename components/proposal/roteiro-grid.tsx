"use client";

import { useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EditorialImage } from "@/components/ui/editorial-image";

export type RoteiroCity = {
  slug: string;
  day: number;
  name: string;
  tagline: string;
  heroSrc: string;
  heroAlt: string;
  introduction: string[];
  pois: { name: string; description: string }[];
};

/**
 * Roteiro em fotos + botão "Conhecer mais" por cidade, que abre um modal com o
 * conteúdo do guia (introdução + destaques/POIs).
 */
export function RoteiroGrid({
  items,
  dayPrefix,
  cardCta,
  highlightsLabel,
  swipeHint,
}: {
  items: RoteiroCity[];
  /** Prefixo antes do número do dia (ex.: "Dia" → "Dia 3"). */
  dayPrefix: string;
  /** Botão que abre o modal da cidade. */
  cardCta: string;
  /** Rótulo acima da lista de destaques, dentro do modal. */
  highlightsLabel: string;
  /** Texto da dica de deslizar. Use {n} para o número de paradas. */
  swipeHint: string;
}) {
  const [open, setOpen] = useState<RoteiroCity | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const nudge = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    // Rola por 1 card (largura + gap). Usamos snap-proximity (não mandatory),
    // que não "briga" com o scroll programático suave.
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <>
      {/* Dica de deslizar: pill discreta e elegante, centralizada. Some se vazia. */}
      {swipeHint.trim() && (
        <div className="mb-7 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-deep-700/20 bg-white/50 px-5 py-2 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-deep-700 shadow-[0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm sm:text-[0.66rem]">
            {swipeHint.replaceAll("{n}", String(items.length))}
          </span>
        </div>
      )}

      <div className="relative">
      <div ref={scroller} className="no-scrollbar flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-2">
        {items.map((d) => (
          <article
            key={d.slug}
            className="group relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded-xl bg-deep text-offwhite sm:aspect-[4/5] sm:w-[47%] md:aspect-[4/3] md:w-[46%] lg:w-[31%]"
          >
            <EditorialImage
              src={d.heroSrc}
              alt={d.heroAlt}
              wrapperClassName="absolute inset-0"
              className="transition-transform duration-1000 ease-silk group-hover:scale-105"
              sizes="(max-width: 640px) 80vw, 33vw"
            />
            {/* máscara leve só na base, atrás do texto — mantém a foto clara */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep/80 via-deep/20 to-transparent" />
            <div className="text-on-photo relative z-10 flex h-full flex-col justify-end p-7">
              <span className="overline-on-dark !text-white">{`${dayPrefix} ${d.day}`.trim()}</span>
              <h3 className="mt-1 font-cormorant text-4xl leading-none sm:text-5xl">{d.name}</h3>
              <button
                type="button"
                onClick={() => setOpen(d)}
                className="mt-2 inline-flex w-fit items-center py-2.5 font-sans text-xs font-semibold uppercase tracking-wide2 text-white transition hover:text-white/80"
              >
                <span className="border-b border-white/70 pb-0.5">{cardCta}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

        {/* Setas laterais — só no desktop (no mobile vale o gesto de deslizar) */}
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Parada anterior"
          className="absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-deep-700/15 bg-white/85 text-deep-700 shadow-md backdrop-blur transition hover:bg-white md:h-12 md:w-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Próxima parada"
          className="absolute right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-deep-700/15 bg-white/85 text-deep-700 shadow-md backdrop-blur transition hover:bg-white md:h-12 md:w-12"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-deep/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-offwhite sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 bg-deep">
              <EditorialImage
                src={open.heroSrc}
                alt={open.heroAlt}
                wrapperClassName="absolute inset-0"
                sizes="100vw"
              />
              <div className="scrim-bottom absolute inset-0" />
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Fechar"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-deep/50 text-offwhite backdrop-blur"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-on-photo absolute bottom-0 left-0 p-6 text-offwhite">
                <span className="overline-on-dark !text-white">{`${dayPrefix} ${open.day}`.trim()}</span>
                <h3 className="mt-1 font-cormorant text-4xl leading-none">{open.name}</h3>
              </div>
            </div>

            <div className="px-6 py-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-wide2 text-deep-700">
                {open.tagline}
              </p>
              {open.introduction.map((p, i) => (
                <p key={i} className="mt-3 font-sans text-[0.95rem] leading-relaxed text-deep/85">
                  {p}
                </p>
              ))}
              {open.pois.length > 0 && (
                <>
                  {highlightsLabel.trim() && (
                    <p className="mt-7 font-sans text-xs font-semibold uppercase tracking-wide2 text-deep-700">
                      {highlightsLabel}
                    </p>
                  )}
                  <ul className="mt-3 space-y-4">
                    {open.pois.map((p) => (
                      <li key={p.name}>
                        <p className="font-cormorant text-xl text-deep">{p.name}</p>
                        <p className="mt-0.5 font-sans text-sm leading-relaxed text-deep/70">
                          {p.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
