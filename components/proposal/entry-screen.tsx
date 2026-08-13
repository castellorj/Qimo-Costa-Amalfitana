"use client";

import { useEffect, useState } from "react";
import { EditorialImage } from "@/components/ui/editorial-image";

/**
 * Tela de entrada (splash de exclusividade) exibida antes do conteúdo.
 * O botão dispensa a tela e revela a apresentação. Renderiza aberta no
 * servidor e no 1º render do cliente (sem flash de conteúdo).
 */
export function EntryScreen({
  image,
  kicker,
  title,
  subtitle,
  cta,
}: {
  image: string;
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-deep text-offwhite">
      <EditorialImage
        src={image}
        alt=""
        wrapperClassName="absolute inset-0"
        priority
        kenBurns
        sizes="100vw"
      />
      <div className="scrim-hero absolute inset-0" />

      <span
        aria-hidden
        className="absolute left-1/2 top-8 z-10 block h-11 w-[7.15rem] -translate-x-1/2 bg-offwhite"
        style={{
          WebkitMaskImage: "url(/qimo-logo.png)",
          maskImage: "url(/qimo-logo.png)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />

      <div className="text-on-photo relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        {kicker && <span className="overline-on-dark">{kicker}</span>}
        <h1 className="mt-5 font-cormorant text-4xl font-light uppercase leading-tight tracking-[0.16em] text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <>
            <div className="rule-gold mx-auto my-5 !bg-gold/60" />
            <p className="max-w-md font-cormorant text-2xl leading-relaxed text-offwhite/90 sm:text-3xl">
              {subtitle}
            </p>
          </>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-luxe mt-10 rounded-lg bg-gold px-9 py-4 font-sans text-[0.82rem] font-semibold uppercase tracking-wide2 text-deep"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
