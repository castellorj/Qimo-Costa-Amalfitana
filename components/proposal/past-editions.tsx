"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { PastMedia } from "@/content/proposal";

/** Resolve o link para um embed que abre DENTRO do site (sem sair da página). */
function resolveEmbed(href: string): { kind: "iframe" | "video"; url: string; portrait: boolean } | null {
  if (!href) return null;
  const yt = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  if (yt) return { kind: "iframe", url: `https://www.youtube.com/embed/${yt[1]}?autoplay=1`, portrait: false };
  const ig = href.match(/instagram\.com\/(p|reel|reels|tv)\/([\w-]+)/);
  if (ig) {
    const t = ig[1] === "reels" ? "reel" : ig[1];
    return { kind: "iframe", url: `https://www.instagram.com/${t}/${ig[2]}/embed`, portrait: true };
  }
  if (/\.(mp4|webm|mov)(\?|$)/i.test(href)) return { kind: "video", url: href, portrait: false };
  return { kind: "iframe", url: href, portrait: false };
}

/**
 * Galeria (fotos + vídeos + Instagram). Ao clicar, abre um lightbox no próprio
 * site com navegação em slides: setas, arrastar (swipe) e teclado.
 */
export function PastEditions({ items }: { items: PastMedia[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const n = items.length;

  const nudge = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("button");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  const open = idx !== null ? items[idx] : null;
  const embed = open && open.type === "video" && open.href ? resolveEmbed(open.href) : null;

  const go = (d: number) => setIdx((i) => (i === null ? i : (i + d + n) % n));

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, n]);

  return (
    <>
      <div className="relative">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {items.map((m, i) => (
            <button
              type="button"
              key={m.src + i}
              onClick={() => setIdx(i)}
              aria-label={m.alt}
              className="relative aspect-[4/5] w-[80%] shrink-0 snap-center overflow-hidden rounded-xl sm:aspect-[4/3] sm:w-[47%] lg:w-[31%]"
            >
              <EditorialImage src={m.src} alt={m.alt} wrapperClassName="absolute inset-0" sizes="(max-width: 640px) 80vw, (max-width: 1024px) 47vw, 31vw" />
              {m.type === "video" && (
                <>
                  <div className="absolute inset-0 bg-deep/25" />
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/90 text-deep shadow-lg">
                    <Play className="ml-0.5 h-6 w-6 fill-deep" />
                  </span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Setas laterais — só no desktop (no mobile vale o gesto de deslizar) */}
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Anterior"
              className="absolute left-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-700/15 bg-white/85 text-deep-700 shadow-md backdrop-blur transition hover:bg-white md:flex"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Próxima"
              className="absolute right-1 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-700/15 bg-white/85 text-deep-700 shadow-md backdrop-blur transition hover:bg-white md:flex"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-deep/90 p-4 [text-shadow:none]"
            onClick={() => setIdx(null)}
            role="dialog"
            aria-modal="true"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <button
              type="button"
              onClick={() => setIdx(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/15 text-offwhite backdrop-blur"
            >
              <X className="h-5 w-5" />
            </button>

            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  aria-label="Anterior"
                  className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/15 text-offwhite backdrop-blur transition hover:bg-offwhite/25"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  aria-label="Próxima"
                  className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/15 text-offwhite backdrop-blur transition hover:bg-offwhite/25"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-deep/60 px-3 py-1 font-sans text-xs text-offwhite/90 backdrop-blur">
                  {(idx ?? 0) + 1} / {n}
                </span>
              </>
            )}

            <div onClick={(e) => e.stopPropagation()} className="w-full">
              {embed?.kind === "iframe" ? (
                embed.portrait ? (
                  <iframe
                    src={embed.url}
                    title={open.alt}
                    className="mx-auto h-[80vh] w-full max-w-[400px] rounded-xl border-0 bg-white"
                    scrolling="no"
                    allow="autoplay; encrypted-media; clipboard-write"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-xl">
                    <iframe
                      src={embed.url}
                      title={open.alt}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="autoplay; encrypted-media; clipboard-write"
                      allowFullScreen
                    />
                  </div>
                )
              ) : embed?.kind === "video" ? (
                <video src={embed.url} controls autoPlay playsInline className="mx-auto max-h-[85vh] w-full max-w-3xl rounded-xl" />
              ) : (
                <div className="relative mx-auto h-[82vh] w-full max-w-3xl">
                  <EditorialImage
                    src={open.src}
                    alt={open.alt}
                    wrapperClassName="absolute inset-0"
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
