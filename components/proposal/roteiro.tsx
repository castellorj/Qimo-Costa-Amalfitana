"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoteiroItem = {
  day: number;
  name: string;
  tagline: string;
  intro: string;
  pois: string[];
};

/**
 * Roteiro condensado — timeline curta. Cidade + tagline numa linha;
 * o detalhe (introdução + imperdíveis) fica escondido num "Saiba mais".
 * Substitui as 7 telas cheias de destino da versão longa.
 */
export function Roteiro({ items }: { items: RoteiroItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ol className="mx-auto max-w-2xl">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={it.day} className="border-b border-deep/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-5 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="w-10 shrink-0 font-cormorant text-3xl text-deep-700">
                {String(it.day).padStart(2, "0")}
              </span>
              <span className="flex-1 font-cormorant text-2xl leading-tight text-deep">
                {it.name}
              </span>
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-deep-700 transition-transform duration-500 ease-silk",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            {isOpen && (
              <div className="animate-fade-up pb-7 pl-[3.75rem]">
                <p className="mb-2 font-sans text-xs uppercase tracking-wide2 text-deep-700">
                  {it.tagline}
                </p>
                <p className="font-cormorant text-lg leading-relaxed text-deep/85">{it.intro}</p>
                {it.pois.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {it.pois.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span className="font-sans text-[0.95rem] text-deep/75">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
