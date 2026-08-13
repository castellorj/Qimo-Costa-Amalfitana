"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Check, LogIn, Download, RefreshCw } from "lucide-react";
import { type PastMedia, type FaqTopic, type RoteiroCity } from "@/content/proposal";
import frozenContent from "@/content/base-content.json";
import { PROPOSAL_ID } from "@/lib/proposal-id";
// Fonte única dos padrões: o mesmo objeto que a página pública usa como base.
// Antes o admin mantinha uma cópia, que ficava para trás a cada campo novo.
import { defaults, type EditableContent } from "@/lib/content-remote";
import { formatRange } from "@/lib/date";
import { parseFaqBody, parseFaqLines, serializeFaqLines, type FaqLine } from "@/lib/faq-format";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function rpc(fn: string, body: unknown) {
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: H,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || "erro");
  return text ? JSON.parse(text) : null;
}

/** Sobe qualquer arquivo (foto/vídeo) para o Storage e devolve a URL pública. */
async function putFile(data: Blob, ext: string): Promise<string> {
  const clean = ext.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  // pasta por proposta, para uma cópia nunca sobrescrever a mídia de outra
  const path = `midia/${PROPOSAL_ID}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${clean}`;
  const res = await fetch(`${URL}/storage/v1/object/rc2027-media/${path}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": data.type || "application/octet-stream",
    },
    body: data,
  });
  if (!res.ok) throw new Error(await res.text());
  return `${URL}/storage/v1/object/public/rc2027-media/${path}`;
}

/** Sobe uma foto para o Storage (bucket público) e devolve a URL pública. */
async function uploadPhoto(file: File): Promise<string> {
  return putFile(file, file.name.split(".").pop() || "jpg");
}

/**
 * Gera uma miniatura (primeiro quadro) de um arquivo de vídeo, no navegador.
 * Devolve um Blob JPEG — ou null se o navegador não conseguir decodificar.
 */
function videoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = window.URL.createObjectURL(file);
    const done = (b: Blob | null) => {
      window.URL.revokeObjectURL(url);
      resolve(b);
    };
    video.onloadeddata = () => {
      // pula uns instantes para fugir de um primeiro quadro preto
      video.currentTime = Math.min(0.6, (video.duration || 1) / 2);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (!ctx) return done(null);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => done(b), "image/jpeg", 0.82);
      } catch {
        done(null);
      }
    };
    video.onerror = () => done(null);
    video.src = url;
  });
}

/** Extrai o ID de um link do YouTube (para gerar a thumbnail). */
function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

const inputCls =
  "w-full rounded-md border border-deep/20 bg-white px-3.5 py-2.5 font-sans text-[0.95rem] text-deep outline-none focus:border-gold";
const labelCls = "mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wide2 text-deep/60";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-deep/10 bg-offwhite p-6">
      <h2 className="mb-5 font-cormorant text-2xl text-deep">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const [pwd, setPwd] = useState("");
  const [authed, setAuthed] = useState(false);
  const [c, setC] = useState<EditableContent | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const ok = await rpc("rc2027_check_password", { p_password: pwd });
      if (!ok) {
        setErr("Senha incorreta.");
        return;
      }
      // Carrega SÓ a linha desta proposta. Sem linha ainda, abre com o conteúdo
      // aprovado (congelado no repositório) — a 1ª gravação cria a linha.
      const res = await fetch(
        `${URL}/rest/v1/rc2027_content?id=eq.${encodeURIComponent(PROPOSAL_ID)}&select=data`,
        { headers: H }
      );
      const rows = await res.json();
      const data = rows?.[0]?.data ?? {};
      const approved = { ...defaults, ...(frozenContent as Partial<EditableContent>) } as EditableContent;
      setC({
        ...approved,
        ...data,
        pillars: data.pillars?.length ? data.pillars : approved.pillars,
        included: data.included?.length ? data.included : approved.included,
        cabins: data.cabins?.length ? data.cabins : approved.cabins,
        faq: data.faq?.length ? data.faq : approved.faq,
        // Roteiro salvo vence; sem ele, usa o aprovado herdando as fotos legadas
        // (roteiroPhotos, slug → URL). As do banco vencem as do congelado; numa
        // cópia nova só existem as congeladas — e antes elas eram ignoradas,
        // obrigando a reenviar foto por foto.
        roteiro: Array.isArray(data.roteiro)
          ? data.roteiro
          : approved.roteiro.map((city: RoteiroCity) => {
              const legadas = { ...approved.roteiroPhotos, ...data.roteiroPhotos };
              return { ...city, photo: legadas[city.slug] || city.photo };
            }),
      });
      setAuthed(true);
    } catch {
      setErr("Não foi possível conectar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!c) return;
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      await rpc("rc2027_save_content", { p_password: pwd, p_data: c, p_id: PROPOSAL_ID });
      setMsg("Textos salvos. O site atualiza em até ~1 minuto.");
    } catch {
      setErr("Não foi possível salvar. Confira a senha e tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  function set<K extends keyof EditableContent>(k: K, v: EditableContent[K]) {
    setC((prev) => (prev ? { ...prev, [k]: v } : prev));
  }

  /* ------------------------------ LOGIN ------------------------------ */
  if (!authed) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-deep px-6">
        <form onSubmit={login} className="w-full max-w-sm text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-luxe text-gold-light">
            Admin
          </p>
          <h1 className="mt-2 font-cormorant text-3xl text-offwhite">Grécia · Elysium</h1>
          <p className="mb-8 mt-1 font-sans text-sm text-offwhite/60">Editar os textos do site</p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Senha"
            autoFocus
            className="w-full rounded-md border border-offwhite/20 bg-offwhite/10 px-4 py-3 text-center font-sans text-offwhite outline-none focus:border-gold"
          />
          {err && <p className="mt-3 text-sm text-gold-light">{err}</p>}
          <button
            type="submit"
            disabled={busy || !pwd}
            className="btn-luxe mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gold py-3 font-sans text-sm font-semibold uppercase tracking-wide2 text-deep disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Entrar
          </button>
        </form>
      </main>
    );
  }

  if (!c) return null;

  /* ------------------------------ EDITOR ----------------------------- */
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <header className="mb-8">
        <p className="font-sans text-xs font-semibold uppercase tracking-luxe text-gold-deep">Admin</p>
        <h1 className="font-cormorant text-4xl text-deep">Textos do site</h1>
        <p className="mt-1 font-sans text-sm text-deep/60">
          Edite abaixo e clique em <strong>Salvar</strong>. As alterações aparecem no site em até ~1
          minuto.
        </p>
      </header>

      <div className="space-y-6 pb-32">
        <Section title="Lista exclusiva — inscrições">
          <div>
            <label className={labelCls}>Texto do botão (final da página)</label>
            <input
              className={inputCls}
              value={c.waitlistCta}
              onChange={(e) => set("waitlistCta", e.target.value)}
            />
          </div>
          <LeadsViewer password={pwd} />
        </Section>

        <Section title="Tela de entrada">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={c.entryEnabled}
              onChange={(e) => set("entryEnabled", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span className="font-sans text-sm text-deep/80">
              Mostrar a tela de entrada (splash antes do conteúdo)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rótulo (topo)</label>
              <input className={inputCls} value={c.entryKicker} onChange={(e) => set("entryKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Texto do botão</label>
              <input className={inputCls} value={c.entryCta} onChange={(e) => set("entryCta", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Título</label>
            <input
              className={`${inputCls} font-cormorant text-lg`}
              value={c.entryTitle}
              onChange={(e) => set("entryTitle", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Subtítulo (opcional)</label>
            <input className={inputCls} value={c.entrySubtitle} onChange={(e) => set("entrySubtitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Foto de fundo</label>
            <ImageField value={c.entryImage} onChange={(url) => set("entryImage", url)} />
          </div>
        </Section>

        <Section title="Marca & datas">
          <div>
            <label className={labelCls}>Nome do grupo</label>
            <input className={inputCls} value={c.groupName} onChange={(e) => set("groupName", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Início da viagem</label>
              <input
                type="date"
                className={inputCls}
                value={c.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Fim da viagem</label>
              <input
                type="date"
                className={inputCls}
                value={c.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Duração (texto ao lado das datas)</label>
            <input
              className={inputCls}
              value={c.heroNights}
              placeholder="7 noites"
              onChange={(e) => set("heroNights", e.target.value)}
            />
          </div>
          <p className="font-sans text-xs text-deep/50">
            As datas alimentam o texto exibido e a contagem regressiva.
          </p>
          <label className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={c.showDates}
              onChange={(e) => set("showDates", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span className="font-sans text-sm text-deep/80">
              Mostrar as datas no site (hero, contagem, fim e rodapé) — desmarque para ocultar
            </span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Embarcação</label>
              <input className={inputCls} value={c.vessel} onChange={(e) => set("vessel", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Selo (rodapé/finale)</label>
              <input className={inputCls} value={c.guestsNote} onChange={(e) => set("guestsNote", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="Abertura (hero)">
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <label className={labelCls}>Rótulo (topo)</label>
              <input className={inputCls} value={c.heroKicker} placeholder="Cruzeiro" onChange={(e) => set("heroKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Ano</label>
              <input className={`${inputCls} w-24`} value={c.heroYear} placeholder="2027" onChange={(e) => set("heroYear", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Título principal</label>
            <input className={`${inputCls} font-cormorant text-lg`} value={c.heroTitle} placeholder="Roberto Carlos" onChange={(e) => set("heroTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Subtítulo do hero</label>
            <input className={inputCls} value={c.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Cidades (separe por “ · ”)</label>
            <input className={inputCls} value={c.heroCities} onChange={(e) => set("heroCities", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Overline (só no preview do link)</label>
            <input className={inputCls} value={c.heroOverline} onChange={(e) => set("heroOverline", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Manifesto (frase grande)</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={c.manifesto}
              onChange={(e) => set("manifesto", e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              checked={c.showManifesto}
              onChange={(e) => set("showManifesto", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span className="font-sans text-sm text-deep/80">
              Mostrar a frase do manifesto no início da página
            </span>
          </label>
        </Section>

        <Section title="O que está incluído">
          {c.included.map((it, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  className={inputCls}
                  value={it.label}
                  placeholder="Item"
                  onChange={(e) => {
                    const n = [...c.included];
                    n[i] = { ...n[i], label: e.target.value };
                    set("included", n);
                  }}
                />
                <input
                  className={`${inputCls} text-deep/70`}
                  value={it.detail ?? ""}
                  placeholder="Detalhe (opcional)"
                  onChange={(e) => {
                    const n = [...c.included];
                    n[i] = { ...n[i], detail: e.target.value };
                    set("included", n);
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => set("included", c.included.filter((_, j) => j !== i))}
                className="mt-2 text-deep/40 hover:text-red-600"
                aria-label="Remover"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("included", [...c.included, { label: "", detail: "" }])}
            className="flex items-center gap-1.5 font-sans text-sm text-gold-deep"
          >
            <Plus className="h-4 w-4" /> Adicionar item
          </button>
          <div className="pt-2">
            <label className={labelCls}>Não incluído / observação</label>
            <textarea
              rows={2}
              className={`${inputCls} resize-none`}
              value={c.notIncluded}
              onChange={(e) => set("notIncluded", e.target.value)}
            />
          </div>
        </Section>

        <Section title="Valor da viagem">
          <div className="grid grid-cols-[1fr_1.4fr] gap-4">
            <div>
              <label className={labelCls}>Rótulo</label>
              <input
                className={inputCls}
                value={c.priceLabel}
                placeholder="A partir de"
                onChange={(e) => set("priceLabel", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Valor (vazio = "sob consulta")</label>
              <input
                className={inputCls}
                value={c.priceFrom}
                placeholder="Ex.: € 4.900 por pessoa"
                onChange={(e) => set("priceFrom", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Observação de valor</label>
            <input
              className={inputCls}
              value={c.priceNote}
              onChange={(e) => set("priceNote", e.target.value)}
            />
          </div>
        </Section>

        <Section title="Cabines — categorias e valores">
          {c.cabins.map((cab, i) => {
            const upd = (patch: Partial<(typeof c.cabins)[number]>) => {
              const n = [...c.cabins];
              n[i] = { ...n[i], ...patch };
              set("cabins", n);
            };
            const updSpec = (patch: Partial<(typeof c.cabins)[number]["specs"]>) => {
              const n = [...c.cabins];
              n[i] = { ...n[i], specs: { ...n[i].specs, ...patch } };
              set("cabins", n);
            };
            return (
              <div key={i} className="space-y-2 rounded-lg border border-deep/10 bg-deep/[0.02] p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide2 text-deep/50">
                    Cabine {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => set("cabins", c.cabins.filter((_, j) => j !== i))}
                    className="text-deep/40 hover:text-red-600"
                    aria-label="Remover cabine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <ImageField value={cab.image} onChange={(url) => upd({ image: url })} />
                <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                  <div>
                    <label className={labelCls}>Nome</label>
                    <input className={inputCls} value={cab.name} placeholder="Cabine C" onChange={(e) => upd({ name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Preço</label>
                    <input className={inputCls} value={cab.price} placeholder="€ 5.950" onChange={(e) => upd({ price: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Deck</label>
                  <input className={inputCls} value={cab.deck} placeholder="Deck inferior · Oceans" onChange={(e) => upd({ deck: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Janela</label>
                    <input className={inputCls} value={cab.specs.window} onChange={(e) => updSpec({ window: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Camas</label>
                    <input className={inputCls} value={cab.specs.beds} onChange={(e) => updSpec({ beds: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Tamanho</label>
                    <input className={inputCls} value={cab.specs.size} onChange={(e) => updSpec({ size: e.target.value })} />
                  </div>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              set("cabins", [
                ...c.cabins,
                { name: "", deck: "", price: "", image: "", specs: { window: "", beds: "", size: "" } },
              ])
            }
            className="flex items-center gap-1.5 font-sans text-sm text-gold-deep"
          >
            <Plus className="h-4 w-4" /> Adicionar cabine
          </button>
          <div className="pt-2">
            <label className={labelCls}>Nota abaixo das cabines</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={c.cabinsNote}
              onChange={(e) => set("cabinsNote", e.target.value)}
            />
          </div>
        </Section>

        <Section title="Principais dúvidas">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rótulo</label>
              <input className={inputCls} value={c.faqKicker} onChange={(e) => set("faqKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Título</label>
              <input className={inputCls} value={c.faqTitle} onChange={(e) => set("faqTitle", e.target.value)} />
            </div>
          </div>
          <p className="font-sans text-xs text-deep/50">
            Copiado do concierge do guia. Marque o que deve aparecer e desmarque o que não precisa.
            Cada linha do texto é um item no formato <strong>Rótulo: valor</strong>.
          </p>
          <FaqTopicsEditor topics={c.faqTopics} onChange={(t) => set("faqTopics", t)} />
        </Section>

        <RoteiroEditor roteiro={c.roteiro} onChange={(r) => set("roteiro", r)} />

        <GalleryEditor
          title="Fotos e vídeos — edições anteriores"
          items={c.pastEditions}
          onChange={(items) => set("pastEditions", items)}
        />

        <Section title="Barco — categoria">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rótulo</label>
              <input className={inputCls} value={c.boatKicker} onChange={(e) => set("boatKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Título</label>
              <input className={inputCls} value={c.boatTitle} onChange={(e) => set("boatTitle", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Capacidade</label>
            <input
              className={inputCls}
              value={c.boatCapacity}
              placeholder="Ex.: 18 a 19 cabines"
              onChange={(e) => set("boatCapacity", e.target.value)}
            />
            <p className="mt-1 font-sans text-[0.7rem] text-deep/50">
              Aparece em destaque logo abaixo do título da seção. Vazio esconde.
            </p>
          </div>
          <div>
            <label className={labelCls}>Aviso (exemplo da categoria)</label>
            <textarea
              rows={2}
              className={`${inputCls} resize-none`}
              value={c.boatNote}
              onChange={(e) => set("boatNote", e.target.value)}
            />
          </div>
        </Section>
        <GalleryEditor
          title="Fotos do barco"
          items={c.boatPhotos}
          onChange={(items) => set("boatPhotos", items)}
        />

        <Section title="Rodapé — redes & site">
          <div>
            <label className={labelCls}>Instagram (URL) — vazio oculta</label>
            <input
              className={inputCls}
              value={c.instagramUrl}
              placeholder="https://instagram.com/qimobr"
              onChange={(e) => set("instagramUrl", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Site (URL) — vazio oculta</label>
            <input
              className={inputCls}
              value={c.siteUrl}
              placeholder="https://qimobr.com"
              onChange={(e) => set("siteUrl", e.target.value)}
            />
          </div>
        </Section>

        <Section title="Prévia do link (WhatsApp)">
          <div>
            <label className={labelCls}>Título da prévia — vazio usa o automático</label>
            <input
              className={inputCls}
              value={c.shareTitle}
              placeholder={`Automático: ${[c.groupName, formatRange(c.startDate, c.endDate)].filter((s) => s && s.trim()).join(" · ")}`}
              onChange={(e) => set("shareTitle", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Descrição da prévia — vazio usa a padrão</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={c.shareDescription}
              placeholder="Uma viagem privada de sete dias pela costa da Dalmácia…"
              onChange={(e) => set("shareDescription", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Imagem da prévia — vazio usa a imagem gerada (design 2027)</label>
            {c.shareImage?.trim() ? (
              <div className="space-y-2">
                <ImageField value={c.shareImage} onChange={(url) => set("shareImage", url)} />
                <button
                  type="button"
                  onClick={() => set("shareImage", "")}
                  className="font-sans text-xs font-semibold text-red-600"
                >
                  Remover imagem (voltar à gerada)
                </button>
              </div>
            ) : (
              <ImageField value="" onChange={(url) => set("shareImage", url)} />
            )}
            <p className="mt-1 font-sans text-xs text-deep/50">
              Recomendado 1200×630px. Dica: use JPG e mantenha abaixo de ~300&nbsp;KB — o WhatsApp
              ignora imagens de prévia muito pesadas.
            </p>
          </div>
          <p className="font-sans text-xs leading-relaxed text-deep/50">
            É o que aparece quando você <strong>cola o link no WhatsApp</strong> (imagem, título em
            negrito e descrição embaixo). Obs.: o WhatsApp guarda a prévia em cache por um tempo —
            pode demorar a atualizar num chat onde o link já foi enviado.
          </p>
        </Section>

        <Section title="Títulos das seções">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Roteiro — rótulo</label>
              <input className={inputCls} value={c.roteiroKicker} onChange={(e) => set("roteiroKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Roteiro — título</label>
              <input className={inputCls} value={c.roteiroTitle} onChange={(e) => set("roteiroTitle", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Galeria — rótulo</label>
              <input className={inputCls} value={c.pastKicker} onChange={(e) => set("pastKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Galeria — título</label>
              <input className={inputCls} value={c.pastTitle} onChange={(e) => set("pastTitle", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Galeria — subtítulo</label>
            <input className={inputCls} value={c.pastSubtitle} onChange={(e) => set("pastSubtitle", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Valor — rótulo</label>
              <input className={inputCls} value={c.valueKicker} onChange={(e) => set("valueKicker", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Valor — título</label>
              <input className={inputCls} value={c.valueTitle} onChange={(e) => set("valueTitle", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Encerramento — título</label>
            <input className={inputCls} value={c.finaleTitle} onChange={(e) => set("finaleTitle", e.target.value)} />
          </div>
        </Section>

        <Section title="Menu do topo (desktop)">
          <p className="-mt-1 font-sans text-xs leading-relaxed text-deep/55">
            Rótulos do menu fixo. Deixe em branco para esconder o item. Seções sem
            conteúdo já somem do menu sozinhas.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Roteiro</label>
              <input className={inputCls} value={c.navRoteiro} onChange={(e) => set("navRoteiro", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Galeria</label>
              <input className={inputCls} value={c.navGaleria} onChange={(e) => set("navGaleria", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Barco</label>
              <input className={inputCls} value={c.navBarco} onChange={(e) => set("navBarco", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Valores</label>
              <input className={inputCls} value={c.navValores} onChange={(e) => set("navValores", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Dúvidas</label>
            <input className={inputCls} value={c.navDuvidas} onChange={(e) => set("navDuvidas", e.target.value)} />
          </div>
        </Section>

        <Section title="Contagem regressiva">
          <div>
            <label className={labelCls}>Rótulo acima do contador</label>
            <input className={inputCls} value={c.countdownLabel} onChange={(e) => set("countdownLabel", e.target.value)} />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Dias</label>
              <input className={inputCls} value={c.countdownDays} onChange={(e) => set("countdownDays", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Horas</label>
              <input className={inputCls} value={c.countdownHours} onChange={(e) => set("countdownHours", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Minutos</label>
              <input className={inputCls} value={c.countdownMinutes} onChange={(e) => set("countdownMinutes", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Segundos</label>
              <input className={inputCls} value={c.countdownSeconds} onChange={(e) => set("countdownSeconds", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="Rótulos do roteiro">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prefixo do dia</label>
              <input className={inputCls} value={c.roteiroDayPrefix} onChange={(e) => set("roteiroDayPrefix", e.target.value)} />
              <p className="mt-1 font-sans text-[0.7rem] text-deep/50">
                Aparece como “{`${c.roteiroDayPrefix} 3`.trim()}”.
              </p>
            </div>
            <div>
              <label className={labelCls}>Botão do card</label>
              <input className={inputCls} value={c.roteiroCardCta} onChange={(e) => set("roteiroCardCta", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Rótulo dos destaques (no modal da cidade)</label>
            <input className={inputCls} value={c.roteiroHighlightsLabel} onChange={(e) => set("roteiroHighlightsLabel", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Dica de deslizar (carrossel)</label>
            <input className={inputCls} value={c.roteiroSwipeHint} onChange={(e) => set("roteiroSwipeHint", e.target.value)} />
            <p className="mt-1 text-xs text-slate-500">
              Use <code>{"{n}"}</code> para o número de paradas. Ex.: “Deslize para ver as {"{n}"} paradas”.
            </p>
          </div>
        </Section>

        <Section title="Outros textos da página">
          <div>
            <label className={labelCls}>Valores — texto quando não há preço</label>
            <input className={inputCls} value={c.priceFallback} onChange={(e) => set("priceFallback", e.target.value)} />
            <p className="mt-1 font-sans text-[0.7rem] text-deep/50">
              Só aparece se o campo “valor da viagem” estiver vazio.
            </p>
          </div>
          <div>
            <label className={labelCls}>Rótulo do box “não incluído”</label>
            <input className={inputCls} value={c.notIncludedLabel} onChange={(e) => set("notIncludedLabel", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Encerramento — conector antes do barco</label>
            <input className={inputCls} value={c.finaleAboard} onChange={(e) => set("finaleAboard", e.target.value)} />
            <p className="mt-1 font-sans text-[0.7rem] text-deep/50">
              Monta “datas · {c.heroNights || "noites"} · {c.finaleAboard} {c.vessel}”.
            </p>
          </div>
          <div>
            <label className={labelCls}>Rodapé — linha de crédito</label>
            <input className={inputCls} value={c.footerNote} onChange={(e) => set("footerNote", e.target.value)} />
            <p className="mt-1 font-sans text-[0.7rem] text-deep/50">
              Escreva <b>{"{datas}"}</b> onde o período da viagem deve entrar. Vazio esconde a linha.
            </p>
          </div>
        </Section>

        <ChangePassword currentPwd={pwd} onChanged={setPwd} />
      </div>

      {/* Barra de salvar fixa */}
      <div className="fixed inset-x-0 bottom-0 border-t border-deep/10 glass px-5 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <p className="font-sans text-xs text-deep/70">
            {msg && <span className="text-green-700">{msg}</span>}
            {err && <span className="text-red-600">{err}</span>}
          </p>
          <button
            onClick={save}
            disabled={busy}
            className="btn-luxe flex items-center gap-2 rounded-md bg-gold px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wide2 text-deep disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Salvar
          </button>
        </div>
      </div>
    </main>
  );
}

function ChangePassword({
  currentPwd,
  onChanged,
}: {
  currentPwd: string;
  onChanged: (p: string) => void;
}) {
  const [np, setNp] = useState("");
  const [st, setSt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function change() {
    if (np.length < 6) {
      setSt("Use ao menos 6 caracteres.");
      return;
    }
    setBusy(true);
    setSt(null);
    try {
      await rpc("rc2027_change_password", { p_old: currentPwd, p_new: np });
      onChanged(np);
      setNp("");
      setSt("Senha alterada.");
    } catch {
      setSt("Não foi possível alterar a senha.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Section title="Trocar senha">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className={labelCls}>Nova senha</label>
          <input
            type="password"
            className={inputCls}
            value={np}
            onChange={(e) => setNp(e.target.value)}
            placeholder="Nova senha"
          />
        </div>
        <button
          type="button"
          onClick={change}
          disabled={busy || !np}
          className="rounded-md border border-deep/20 px-5 py-2.5 font-sans text-sm font-semibold text-deep disabled:opacity-50"
        >
          Trocar
        </button>
      </div>
      {st && <p className="font-sans text-xs text-deep/70">{st}</p>}
    </Section>
  );
}

function GalleryEditor({
  items,
  onChange,
  title = "Galeria — edições anteriores",
}: {
  items: PastMedia[];
  onChange: (items: PastMedia[]) => void;
  title?: string;
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sendingVideo, setSendingVideo] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSendingVideo(true);
    setErr(null);
    try {
      // envia o vídeo e, em paralelo, tenta gerar a miniatura do 1º quadro
      const [videoSrc, thumb] = await Promise.all([
        putFile(f, f.name.split(".").pop() || "mp4"),
        videoThumbnail(f),
      ]);
      const poster = thumb ? await putFile(thumb, "jpg") : "/images/exp-aftermovie.svg";
      onChange([...items, { type: "video", src: poster, href: videoSrc, alt: "Vídeo" }]);
    } catch {
      setErr("Falha ao enviar o vídeo. Arquivos muito grandes podem falhar — tente um menor.");
    } finally {
      setSendingVideo(false);
      e.target.value = "";
    }
  }

  async function onPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setErr(null);
    try {
      const added: PastMedia[] = [];
      for (const f of files) {
        const src = await uploadPhoto(f);
        added.push({ type: "photo", src, alt: "Edição anterior" });
      }
      onChange([...items, ...added]);
    } catch {
      setErr("Falha ao enviar alguma foto. Tente novamente.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function addVideo() {
    const url = videoUrl.trim();
    if (!url) return;
    const id = youtubeId(url);
    const src = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/images/exp-aftermovie.svg";
    onChange([
      ...items,
      { type: "video", src, href: url, alt: /instagram\.com/.test(url) ? "Instagram" : "Vídeo" },
    ]);
    setVideoUrl("");
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <Section title={title}>
      {items.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((m, i) => (
            <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-md bg-deep/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt="" className="h-full w-full object-cover" />
              {m.type === "video" && (
                <span className="absolute left-1 top-1 rounded bg-deep/80 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase text-offwhite">
                  vídeo
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-600"
                aria-label="Remover"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => move(i, -1)} className="rounded bg-white/90 px-1.5 text-sm text-deep" aria-label="Mover para trás">‹</button>
                <button type="button" onClick={() => move(i, 1)} className="rounded bg-white/90 px-1.5 text-sm text-deep" aria-label="Mover para frente">›</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-deep/50">
          Nenhuma mídia ainda. Adicione fotos e vídeos abaixo.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <label className="btn-luxe inline-flex cursor-pointer items-center gap-2 rounded-md bg-gold px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-wide2 text-deep">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {uploading ? "Enviando…" : "Adicionar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPhotos}
            disabled={uploading}
          />
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-deep/25 px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-wide2 text-deep">
          {sendingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {sendingVideo ? "Enviando vídeo…" : "Enviar vídeo"}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onVideoFile}
            disabled={sendingVideo}
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          className={inputCls}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Link do YouTube, Instagram ou vídeo"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVideo())}
        />
        <button
          type="button"
          onClick={addVideo}
          className="shrink-0 rounded-md border border-deep/20 px-4 py-2.5 font-sans text-sm font-semibold text-deep"
        >
          Adicionar link
        </button>
      </div>

      {err && <p className="font-sans text-sm text-red-600">{err}</p>}
      <p className="font-sans text-xs leading-relaxed text-deep/50">
        Você pode adicionar <strong>quantas fotos, vídeos e posts do Instagram quiser</strong> — sem
        limite. Use <strong>Enviar vídeo</strong> para subir um arquivo do seu celular (ele gera a
        capa sozinho); ou cole um <strong>link</strong> do YouTube/Instagram. Tudo abre{" "}
        <strong>dentro do site</strong> (a pessoa não sai da página). Arraste com ‹ › para reordenar.
        Clique em <strong>Salvar</strong> para publicar.
      </p>
    </Section>
  );
}

function RoteiroEditor({
  roteiro,
  onChange,
}: {
  roteiro: RoteiroCity[];
  onChange: (r: RoteiroCity[]) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);

  const updCity = (i: number, patch: Partial<RoteiroCity>) => {
    const n = [...roteiro];
    n[i] = { ...n[i], ...patch };
    onChange(n);
  };
  const moveCity = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= roteiro.length) return;
    const n = [...roteiro];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  const addCity = () =>
    onChange([
      ...roteiro,
      {
        slug: `cidade-${Date.now()}`,
        day: (roteiro[roteiro.length - 1]?.day || 0) + 1,
        name: "Nova cidade",
        tagline: "",
        photo: "/images/hero-trogir.svg",
        intro: "",
        pois: [],
      },
    ]);

  async function onPhoto(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(i);
    try {
      updCity(i, { photo: await uploadPhoto(f) });
    } catch {
      /* ignora */
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  const updPoi = (ci: number, pi: number, patch: Partial<{ name: string; description: string }>) => {
    const pois = roteiro[ci].pois.map((p, j) => (j === pi ? { ...p, ...patch } : p));
    updCity(ci, { pois });
  };
  const movePoi = (ci: number, pi: number, dir: -1 | 1) => {
    const j = pi + dir;
    const pois = [...roteiro[ci].pois];
    if (j < 0 || j >= pois.length) return;
    [pois[pi], pois[j]] = [pois[j], pois[pi]];
    updCity(ci, { pois });
  };

  return (
    <Section title="Roteiro — cidades e detalhes">
      <div className="space-y-2.5">
        {roteiro.map((city, i) => (
          <details key={city.slug || i} className="overflow-hidden rounded-lg border border-gold/30 bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={city.photo} alt="" className="h-11 w-11 shrink-0 rounded object-cover" />
              <span className="min-w-0 flex-1 font-cormorant text-lg leading-tight text-deep">
                Dia {city.day} · {city.name || "—"}
              </span>
              <span className="font-sans text-[0.7rem] uppercase tracking-wide2 text-deep/40">
                {city.pois.length} destaque{city.pois.length === 1 ? "" : "s"}
              </span>
            </summary>

            <div className="space-y-3.5 border-t border-deep/10 px-3.5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => moveCity(i, -1)} className="rounded border border-deep/20 px-2 py-1 text-sm text-deep" aria-label="Subir">↑</button>
                  <button type="button" onClick={() => moveCity(i, 1)} className="rounded border border-deep/20 px-2 py-1 text-sm text-deep" aria-label="Descer">↓</button>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(roteiro.filter((_, j) => j !== i))}
                  className="flex items-center gap-1 font-sans text-xs font-semibold text-deep/40 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remover cidade
                </button>
              </div>

              <div>
                <label className={labelCls}>Foto</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-deep/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={city.photo} alt="" className="h-full w-full object-cover" />
                    {uploading === i && (
                      <div className="absolute inset-0 flex items-center justify-center bg-deep/40">
                        <Loader2 className="h-4 w-4 animate-spin text-offwhite" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer rounded-md border border-deep/20 px-4 py-2 font-sans text-sm font-semibold text-deep">
                    Trocar foto
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(i, e)} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Dia</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={city.day}
                    onChange={(e) => updCity(i, { day: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Cidade</label>
                  <input className={inputCls} value={city.name} onChange={(e) => updCity(i, { name: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Chamada (frase curta)</label>
                <input className={inputCls} value={city.tagline} onChange={(e) => updCity(i, { tagline: e.target.value })} />
              </div>

              <div>
                <label className={labelCls}>Introdução — separe parágrafos com uma linha em branco</label>
                <textarea
                  rows={5}
                  className={`${inputCls} resize-y`}
                  value={city.intro}
                  onChange={(e) => updCity(i, { intro: e.target.value })}
                />
              </div>

              <div>
                <label className={labelCls}>Destaques (o que ver)</label>
                <div className="space-y-2">
                  {city.pois.map((p, pi) => (
                    <div key={pi} className="rounded-md border border-deep/10 bg-deep/[0.02] p-2.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          className={`${inputCls} min-w-0 flex-1 font-cormorant`}
                          value={p.name}
                          placeholder="Nome do destaque"
                          onChange={(e) => updPoi(i, pi, { name: e.target.value })}
                        />
                        <button type="button" onClick={() => movePoi(i, pi, -1)} className="shrink-0 rounded border border-deep/20 px-1.5 text-sm text-deep" aria-label="Subir">‹</button>
                        <button type="button" onClick={() => movePoi(i, pi, 1)} className="shrink-0 rounded border border-deep/20 px-1.5 text-sm text-deep" aria-label="Descer">›</button>
                        <button
                          type="button"
                          onClick={() => updCity(i, { pois: city.pois.filter((_, j) => j !== pi) })}
                          className="shrink-0 text-deep/40 hover:text-red-600"
                          aria-label="Remover destaque"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        className={`${inputCls} mt-2 resize-y text-sm`}
                        value={p.description}
                        placeholder="Descrição"
                        onChange={(e) => updPoi(i, pi, { description: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => updCity(i, { pois: [...city.pois, { name: "", description: "" }] })}
                  className="mt-2 flex items-center gap-1.5 font-sans text-sm text-gold-deep"
                >
                  <Plus className="h-4 w-4" /> Adicionar destaque
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>

      <button type="button" onClick={addCity} className="flex items-center gap-1.5 font-sans text-sm font-semibold text-gold-deep">
        <Plus className="h-4 w-4" /> Adicionar cidade
      </button>
      <p className="font-sans text-xs leading-relaxed text-deep/50">
        Toque numa cidade para abrir e editar tudo: foto, dia, nome, chamada, textos e destaques (o que
        aparece no “Conhecer mais”). Use ↑ ↓ para reordenar as cidades e ‹ › para os destaques. Clique
        em <strong>Salvar</strong> para publicar.
      </p>
    </Section>
  );
}

type Lead = {
  id: string;
  nome: string;
  acompanhante: string | null;
  telefone: string;
  indicacao: string | null;
  created_at: string;
};

function LeadsViewer({ password }: { password: string }) {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const res = await fetch(`${URL}/rest/v1/rpc/rc2027_list_leads`, {
        method: "POST",
        headers: H,
        body: JSON.stringify({ p_password: password }),
      });
      if (res.ok) setLeads(await res.json());
    } catch {
      /* ignora */
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportCsv() {
    if (!leads?.length) return;
    const rows = [
      ["Nome", "Acompanhante", "Telefone", "Indicação", "Data"],
      ...leads.map((l) => [
        l.nome,
        l.acompanhante ?? "",
        l.telefone,
        l.indicacao ?? "",
        new Date(l.created_at).toLocaleString("pt-BR"),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "inscricoes-cruzeiro.csv";
    a.click();
    window.URL.revokeObjectURL(a.href);
  }

  return (
    <div className="rounded-lg border border-deep/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-sans text-sm font-semibold text-deep">
          {leads ? `${leads.length} inscrição(ões)` : busy ? "Carregando…" : "—"}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-gold-deep"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`} /> Atualizar
          </button>
          {!!leads?.length && (
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-gold-deep"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          )}
        </div>
      </div>
      {leads && leads.length === 0 && (
        <p className="font-sans text-sm text-deep/50">Nenhuma inscrição ainda.</p>
      )}
      {!!leads?.length && (
        <div className="max-h-72 divide-y divide-deep/8 overflow-y-auto">
          {leads.map((l) => (
            <div key={l.id} className="py-2.5">
              <p className="font-sans text-sm font-semibold text-deep">
                {l.nome} + {l.acompanhante || "acompanhante a definir"}
              </p>
              <p className="font-sans text-xs text-deep/55">
                {l.telefone} · Indicação: {l.indicacao || "—"} ·{" "}
                {new Date(l.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Editor estruturado do corpo de um tópico: cada linha é um campo do tipo certo
 * (subtítulo / etapa horário+descrição / item rótulo+valor / parágrafo), com
 * reordenar e remover. Guarda estado local e sincroniza o texto via onChange —
 * assim a formatação nunca "quebra" ao editar.
 */
function FaqBodyEditor({ value, onChange }: { value: string; onChange: (body: string) => void }) {
  const [lines, setLines] = useState<FaqLine[]>(() => parseFaqLines(value));

  // Ressincroniza se o valor mudar por fora (ex.: ao carregar/salvar).
  useEffect(() => {
    if (serializeFaqLines(lines) !== value) setLines(parseFaqLines(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (next: FaqLine[]) => {
    setLines(next);
    onChange(serializeFaqLines(next));
  };
  const updLine = (i: number, patch: Partial<FaqLine>) =>
    commit(lines.map((l, j) => (j === i ? ({ ...l, ...patch } as FaqLine) : l)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= lines.length) return;
    const n = [...lines];
    [n[i], n[j]] = [n[j], n[i]];
    commit(n);
  };
  const add = (line: FaqLine) => commit([...lines, line]);

  const smallInput =
    "w-full rounded border border-deep/20 bg-white px-2.5 py-1.5 font-sans text-sm text-deep outline-none focus:border-gold";

  return (
    <div className="space-y-2">
      {lines.map((l, i) => (
        <div key={i} className="flex items-start gap-1.5">
          {/* min-w-0: sem isso um texto longo estica o filho e vaza para fora da caixa */}
          <div className="min-w-0 flex-1 rounded-md border border-deep/10 bg-deep/[0.02] p-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-wide2 text-gold-deep">
                {l.t === "sub" ? "Subtítulo" : l.t === "step" ? "Etapa" : l.t === "item" ? "Item" : "Parágrafo"}
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded border border-deep/15 px-1.5 text-xs text-deep/60" aria-label="Subir">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="rounded border border-deep/15 px-1.5 text-xs text-deep/60" aria-label="Descer">↓</button>
                <button type="button" onClick={() => commit(lines.filter((_, j) => j !== i))} className="text-deep/40 hover:text-red-600" aria-label="Remover">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {l.t === "step" ? (
              <div className="flex flex-col gap-1.5 sm:flex-row">
                <input
                  className={`${smallInput} font-semibold sm:w-28 sm:shrink-0`}
                  value={l.time}
                  placeholder="Horário"
                  onChange={(e) => updLine(i, { time: e.target.value })}
                />
                <input
                  className={`${smallInput} min-w-0 flex-1`}
                  value={l.desc}
                  placeholder="O que acontece"
                  onChange={(e) => updLine(i, { desc: e.target.value })}
                />
              </div>
            ) : l.t === "item" ? (
              <div className="flex flex-col gap-1.5 sm:flex-row">
                <input
                  className={`${smallInput} font-semibold sm:w-32 sm:shrink-0`}
                  value={l.label}
                  placeholder="Rótulo"
                  onChange={(e) => updLine(i, { label: e.target.value })}
                />
                <input
                  className={`${smallInput} min-w-0 flex-1`}
                  value={l.value}
                  placeholder="Texto"
                  onChange={(e) => updLine(i, { value: e.target.value })}
                />
              </div>
            ) : l.t === "sub" ? (
              <input
                className={`${smallInput} font-cormorant text-base`}
                value={l.text}
                placeholder="Subtítulo (ex.: Dia a dia)"
                onChange={(e) => updLine(i, { text: e.target.value })}
              />
            ) : (
              <textarea
                rows={2}
                className={`${smallInput} resize-y`}
                value={l.text}
                placeholder="Parágrafo"
                onChange={(e) => updLine(i, { text: e.target.value })}
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <AddLineBtn label="+ Subtítulo" onClick={() => add({ t: "sub", text: "" })} />
        <AddLineBtn label="+ Etapa (horário)" onClick={() => add({ t: "step", time: "", desc: "" })} />
        <AddLineBtn label="+ Item (rótulo)" onClick={() => add({ t: "item", label: "", value: "" })} />
        <AddLineBtn label="+ Parágrafo" onClick={() => add({ t: "para", text: "" })} />
      </div>

      {value.trim() && (
        <div className="mt-1.5 rounded-md border border-deep/10 bg-sand-light/40 px-3.5 py-2.5">
          <p className="mb-1 font-sans text-[0.62rem] font-semibold uppercase tracking-wide2 text-deep/40">
            Prévia (como fica no site)
          </p>
          <FaqBodyPreview body={value} />
        </div>
      )}
    </div>
  );
}

function AddLineBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-gold/40 bg-gold/5 px-3 py-1 font-sans text-[0.72rem] font-semibold text-gold-deep hover:bg-gold/15"
    >
      {label}
    </button>
  );
}

/** Espelha exatamente como o corpo do tópico será exibido no site. */
function FaqBodyPreview({ body }: { body: string }) {
  const blocks = parseFaqBody(body);
  return (
    <div>
      {blocks.map((b, i) => {
        if (b.kind === "sub")
          return (
            <p key={i} className="mt-3 font-cormorant text-lg font-semibold text-deep">
              {b.text}
            </p>
          );
        if (b.kind === "timeline")
          return (
            <ol key={i} className="mt-2 space-y-2 border-l-2 border-gold/30 pl-3">
              {b.rows.map((r, k) => (
                <li key={k}>
                  <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-wide2 text-gold-deep">
                    {r.time}
                  </p>
                  <p className="font-sans text-[0.85rem] leading-snug text-deep/80">{r.desc}</p>
                </li>
              ))}
            </ol>
          );
        if (b.kind === "labeled")
          return (
            <p key={i} className="mt-2 font-sans text-[0.85rem] leading-snug text-deep/80">
              <span className="font-semibold text-deep">{b.label}:</span> {b.value}
            </p>
          );
        return (
          <p key={i} className="mt-2 font-sans text-[0.85rem] leading-snug text-deep/80">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

function FaqTopicsEditor({
  topics,
  onChange,
}: {
  topics: FaqTopic[];
  onChange: (t: FaqTopic[]) => void;
}) {
  function upd(i: number, patch: Partial<FaqTopic>) {
    const n = [...topics];
    n[i] = { ...n[i], ...patch };
    onChange(n);
  }
  return (
    <div className="space-y-3">
      {topics.map((t, i) => (
        <div
          key={i}
          className={`rounded-lg border p-3 ${t.enabled ? "border-gold/30 bg-white" : "border-deep/10 bg-deep/[0.03]"}`}
        >
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={t.enabled}
              onChange={(e) => upd(i, { enabled: e.target.checked })}
              className="h-4 w-4 shrink-0 accent-gold"
              aria-label="Mostrar no site"
            />
            <input
              className={`${inputCls} font-cormorant`}
              value={t.title}
              placeholder="Título do tópico"
              onChange={(e) => upd(i, { title: e.target.value })}
            />
            <button
              type="button"
              onClick={() => onChange(topics.filter((_, j) => j !== i))}
              className="shrink-0 text-deep/40 hover:text-red-600"
              aria-label="Remover"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2.5">
            <FaqBodyEditor value={t.body} onChange={(body) => upd(i, { body })} />
          </div>
          <p className="mt-2 font-sans text-[0.7rem] uppercase tracking-wide2 text-deep/40">
            {t.enabled ? "Aparece no site" : "Oculto"}
          </p>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...topics, { title: "", enabled: true, body: "" }])}
        className="flex items-center gap-1.5 font-sans text-sm text-gold-deep"
      >
        <Plus className="h-4 w-4" /> Adicionar tópico
      </button>
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function up(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadPhoto(f);
      onChange(url);
    } catch {
      /* ignora */
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-deep/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="h-full w-full object-cover" />
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-deep/40">
            <Loader2 className="h-4 w-4 animate-spin text-offwhite" />
          </div>
        )}
      </div>
      <label className="cursor-pointer rounded-md border border-deep/20 px-4 py-2 font-sans text-sm font-semibold text-deep">
        Trocar foto
        <input type="file" accept="image/*" className="hidden" onChange={up} disabled={busy} />
      </label>
    </div>
  );
}
