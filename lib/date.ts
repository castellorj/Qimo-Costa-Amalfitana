const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

/** "2027-07-14","2027-07-21" → "14 – 21 de Julho de 2027" */
export function formatRange(startISO: string, endISO: string): string {
  if (!startISO || !endISO) return "";
  const s = parts(startISO);
  const e = parts(endISO);
  if (!s.y || !e.y) return "";
  if (s.m === e.m && s.y === e.y) return `${s.d} – ${e.d} de ${MESES[e.m - 1]} de ${e.y}`;
  if (s.y === e.y) return `${s.d} de ${MESES[s.m - 1]} – ${e.d} de ${MESES[e.m - 1]} de ${e.y}`;
  return `${s.d}/${s.m}/${s.y} – ${e.d}/${e.m}/${e.y}`;
}

/** Nº de noites entre as duas datas (diferença em dias). */
export function nightsBetween(startISO: string, endISO: string): number {
  if (!startISO || !endISO) return 0;
  const s = parts(startISO);
  const e = parts(endISO);
  if (!s.y || !e.y) return 0;
  return Math.max(
    0,
    Math.round((Date.UTC(e.y, e.m - 1, e.d) - Date.UTC(s.y, s.m - 1, s.d)) / 86400000)
  );
}
