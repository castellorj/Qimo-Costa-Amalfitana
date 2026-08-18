"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Itens da política de cancelamento (fixos). */
const ITEMS = [
  "Em caso de revenda da suíte, devolução de 100%",
  "Em caso de não revenda: até 6 meses antes, multa de 25%",
  "Até 12 semanas antes, multa de 50%",
  "Até 8 semanas antes, multa de 100%",
  "Prazo de devolução: até 60 dias após a solicitação",
];

/**
 * Item de acordeão da "Política de cancelamento", no mesmo estilo dos tópicos
 * de Principais dúvidas. Bloco fixo (não passa pelo /admin).
 */
export function CancellationPolicy({ title = "Política de cancelamento" }: { title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto max-w-editorial border-t border-deep/12">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="font-cormorant text-2xl leading-snug text-deep">{title}</span>
        <Plus
          className={cn(
            "h-5 w-5 shrink-0 text-deep-700 transition-transform duration-500 ease-silk",
            open && "rotate-45"
          )}
        />
      </button>
      {open && (
        <ul className="animate-fade-up space-y-3.5 pb-7">
          {ITEMS.map((t, i) => (
            <li key={i} className="flex gap-3 font-sans text-[1.02rem] leading-[1.55] text-deep/80">
              <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
