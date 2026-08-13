"use client";

import { useEffect, useState } from "react";

/**
 * Contagem regressiva até a data de início da viagem.
 * Só calcula no cliente (evita mismatch de hidratação): renderiza nada até
 * montar. Some quando a viagem já começou.
 */
export function Countdown({
  target,
  label,
  units,
}: {
  target: string;
  /** Rótulo acima do contador (ex.: "Faltam"). */
  label: string;
  /** Unidades, na ordem: dias, horas, minutos, segundos. */
  units: [string, string, string, string];
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!target) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (now === null || !target) return null;
  const diff = new Date(`${target}T00:00:00`).getTime() - now;
  if (Number.isNaN(diff) || diff <= 0) return null;

  const dias = Math.floor(diff / 86400000);
  const horas = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const seg = Math.floor((diff % 60000) / 1000);
  const items: [number, string][] = [
    [dias, units[0]],
    [horas, units[1]],
    [min, units[2]],
    [seg, units[3]],
  ];

  return (
    <div className="mt-6">
      <p className="mb-3 font-sans text-[0.72rem] font-semibold uppercase tracking-luxe text-gold-soft/85">
        {label}
      </p>
      <div className="flex items-start justify-center gap-4 sm:gap-7" aria-label="Contagem regressiva">
        {items.map(([v, l]) => (
          <div key={l} className="text-center">
            <div className="font-cormorant text-3xl leading-none tabular-nums text-offwhite sm:text-4xl">
              {String(v).padStart(2, "0")}
            </div>
            <div className="mt-1.5 font-sans text-[0.68rem] uppercase tracking-wide2 text-gold-soft/85">
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
