/**
 * Formato do corpo de um tópico das "Principais dúvidas". Compartilhado entre o
 * site (components/proposal/faq-topics.tsx) e o /admin, para o preview do editor
 * ficar idêntico ao resultado publicado.
 *
 * Regras por linha:
 *  - Termina em ":" (curta, sem " — ")  → subtítulo         (ex.: "Dia a dia:")
 *  - "horário — descrição" (" — " com espaços, à esquerda ≤18) → etapa da linha
 *    do tempo. Intervalos usam traço curto sem espaços (ex.: "15h30–16h — …").
 *  - "Rótulo: valor" (": " nos primeiros 42) → parágrafo com rótulo em negrito
 *  - qualquer outra                        → parágrafo simples
 */
export type FaqBlock =
  | { kind: "sub"; text: string }
  | { kind: "para"; text: string }
  | { kind: "labeled"; label: string; value: string }
  | { kind: "timeline"; rows: { time: string; desc: string }[] };

/** Uma linha do corpo, já classificada — base do editor estruturado do /admin. */
export type FaqLine =
  | { t: "sub"; text: string }
  | { t: "step"; time: string; desc: string }
  | { t: "item"; label: string; value: string }
  | { t: "para"; text: string };

/** Classifica cada linha do corpo (sem agrupar as etapas), para edição campo a campo. */
export function parseFaqLines(body: string): FaqLine[] {
  const out: FaqLine[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.length <= 40 && line.endsWith(":") && !line.includes(" — ")) {
      out.push({ t: "sub", text: line.replace(/:$/, "") });
      continue;
    }
    const dash = line.indexOf(" — ");
    if (dash > 0 && dash <= 18) {
      out.push({ t: "step", time: line.slice(0, dash), desc: line.slice(dash + 3) });
      continue;
    }
    const idx = line.indexOf(": ");
    if (idx > 0 && idx < 42) {
      out.push({ t: "item", label: line.slice(0, idx), value: line.slice(idx + 2) });
      continue;
    }
    out.push({ t: "para", text: line });
  }
  return out;
}

/** Reconstrói o corpo (texto) a partir das linhas estruturadas. */
export function serializeFaqLines(lines: FaqLine[]): string {
  return lines
    .map((l) => {
      if (l.t === "sub") return `${l.text.replace(/:$/, "")}:`;
      if (l.t === "step") return `${l.time} — ${l.desc}`;
      if (l.t === "item") return `${l.label}: ${l.value}`;
      return l.text;
    })
    .join("\n");
}

export function parseFaqBody(body: string): FaqBlock[] {
  const blocks: FaqBlock[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    if (line.length <= 40 && line.endsWith(":") && !line.includes(" — ")) {
      blocks.push({ kind: "sub", text: line.replace(/:$/, "") });
      continue;
    }

    const dash = line.indexOf(" — ");
    if (dash > 0 && dash <= 18) {
      const row = { time: line.slice(0, dash), desc: line.slice(dash + 3) };
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "timeline") last.rows.push(row);
      else blocks.push({ kind: "timeline", rows: [row] });
      continue;
    }

    const idx = line.indexOf(": ");
    if (idx > 0 && idx < 42) {
      blocks.push({ kind: "labeled", label: line.slice(0, idx), value: line.slice(idx + 2) });
      continue;
    }

    blocks.push({ kind: "para", text: line });
  }
  return blocks;
}
