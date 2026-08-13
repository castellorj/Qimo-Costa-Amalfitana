"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Rótulos do menu, editáveis no /admin. A ordem é a da página. */
export type NavLabels = {
  roteiro: string;
  galeria: string;
  barco: string;
  valores: string;
  duvidas: string;
};

/**
 * Logo QIMO fixa no topo + menu de navegação no desktop. No hero a barra é
 * transparente com texto claro; ao rolar vira "glass" clara com texto escuro.
 * O menu só lista as seções que realmente existem na página (algumas são
 * opcionais — galeria, barco, dúvidas — dependendo do conteúdo do /admin).
 */
export function BrandLogo({ nav }: { nav: NavLabels }) {
  const [scrolled, setScrolled] = useState(false);
  const [links, setLinks] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const all = [
      { id: "roteiro", label: nav.roteiro },
      { id: "barco", label: nav.barco },
      { id: "galeria", label: nav.galeria },
      { id: "valores", label: nav.valores },
      { id: "duvidas", label: nav.duvidas },
    ];
    // Só entram as seções que existem na página E têm rótulo preenchido
    // (rótulo vazio no /admin = esconder o item do menu).
    setLinks(all.filter((n) => n.label.trim() && document.getElementById(n.id)));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-silk",
        scrolled
          ? "glass py-3"
          : "bg-gradient-to-b from-deep/60 via-deep/25 to-transparent py-4 pb-9"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 md:justify-between">
        <a href="#topo" aria-label="Voltar ao topo" className="flex items-center">
          <span
            aria-hidden
            className={cn(
              "block h-8 w-[5.2rem] bg-current transition-colors duration-500 sm:h-9 sm:w-[5.85rem]",
              scrolled ? "text-deep" : "text-offwhite"
            )}
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
          <span className="sr-only">QIMO — voltar ao topo</span>
        </a>

        {links.length > 0 && (
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "group relative font-sans text-[0.72rem] font-semibold uppercase tracking-luxe transition-colors",
                  scrolled
                    ? "text-deep/75 hover:text-deep-700"
                    : "text-offwhite/85 hover:text-gold-soft"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 ease-silk group-hover:w-full",
                    scrolled ? "bg-gold-deep" : "bg-gold-light"
                  )}
                />
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
