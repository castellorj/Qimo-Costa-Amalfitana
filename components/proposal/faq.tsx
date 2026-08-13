"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/content/proposal";
import { cn } from "@/lib/utils";

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="mx-auto max-w-editorial divide-y divide-deep/12">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-cormorant text-2xl leading-snug text-deep">{item.q}</span>
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-deep-700 transition-transform duration-500 ease-silk",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            {isOpen && (
              <p className="animate-fade-up pb-7 font-sans text-[1.02rem] leading-relaxed text-deep/75">
                {item.a}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
