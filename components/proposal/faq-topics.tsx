"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqTopic } from "@/content/proposal";
import { parseFaqBody } from "@/lib/faq-format";

function Body({ text }: { text: string }) {
  const blocks = parseFaqBody(text);
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === "sub") {
          return (
            <p key={i} className="mt-6 font-cormorant text-xl font-semibold text-deep">
              {b.text}
            </p>
          );
        }
        if (b.kind === "timeline") {
          return (
            <ol key={i} className="mt-3.5 space-y-3.5 border-l-2 border-gold/25 pl-4">
              {b.rows.map((r, k) => (
                <li key={k}>
                  <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-wide2 text-deep-700">
                    {r.time}
                  </p>
                  <p className="mt-1 font-sans text-[1.02rem] leading-[1.55] text-deep/80">{r.desc}</p>
                </li>
              ))}
            </ol>
          );
        }
        if (b.kind === "labeled") {
          return (
            <p key={i} className="mt-3.5 font-sans text-[1.02rem] leading-[1.75] text-deep/80">
              <span className="font-semibold text-deep">{b.label}:</span> {b.value}
            </p>
          );
        }
        return (
          <p key={i} className="mt-3.5 font-sans text-[1.02rem] leading-[1.75] text-deep/80">
            {b.text}
          </p>
        );
      })}
    </>
  );
}

/** Seção "Principais dúvidas" — acordeões a partir dos tópicos habilitados. */
export function FaqTopics({ topics }: { topics: FaqTopic[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const list = topics.filter((t) => t.enabled && t.title.trim());

  return (
    <ul className="mx-auto max-w-editorial divide-y divide-deep/12">
      {list.map((t, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <button
              type="button"
              onClick={(e) => {
                const willOpen = !isOpen;
                setOpen(willOpen ? i : null);
                if (willOpen) {
                  const li = e.currentTarget.closest("li");
                  // rola o item aberto para o topo (após o anterior fechar/ajustar)
                  setTimeout(
                    () => li?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    60
                  );
                }
              }}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-cormorant text-2xl leading-snug text-deep">{t.title}</span>
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-deep-700 transition-transform duration-500 ease-silk",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            {isOpen && (
              <div className="animate-fade-up pb-7">
                <Body text={t.body} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
