"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { Cabin } from "@/content/cabins";

/**
 * Categorias de cabine no mesmo modelo de carrossel do roteiro:
 * scroll horizontal com snap + setas laterais no desktop.
 */
export function CabinsCarousel({ items, note }: { items: Cabin[]; note?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const nudge = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {items.map((cab) => (
          <article
            key={cab.name}
            className="flex w-[80%] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-deep/10 bg-offwhite shadow-[0_1px_2px_rgba(4,32,60,0.04)] sm:w-[47%] lg:w-[31%]"
          >
            <EditorialImage
              src={cab.image}
              alt={`${cab.name} · Variety Voyager`}
              wrapperClassName="relative aspect-[4/3] w-full"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 47vw, 31vw"
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
          </article>
        ))}
      </div>

      {/* Setas laterais — só no desktop (no mobile vale o gesto de deslizar) */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Cabine anterior"
        className="absolute left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-700/15 bg-white/85 text-deep-700 shadow-md backdrop-blur transition hover:bg-white md:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Próxima cabine"
        className="absolute right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-700/15 bg-white/85 text-deep-700 shadow-md backdrop-blur transition hover:bg-white md:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {note && (
        <p className="mx-auto mt-8 max-w-editorial text-center font-sans text-xs leading-relaxed text-deep/55">
          {note}
        </p>
      )}
    </div>
  );
}
