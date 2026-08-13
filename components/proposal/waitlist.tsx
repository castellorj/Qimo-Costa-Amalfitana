"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, X } from "lucide-react";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const field =
  "w-full rounded-lg border border-deep/20 bg-white px-4 py-3.5 font-sans text-[1.05rem] text-deep placeholder:text-deep/40 outline-none transition focus:border-gold";

type Status = "idle" | "sending" | "done" | "error";

/** Botão "entrar na lista exclusiva" + modal de cadastro (nome, telefone, indicação). */
export function Waitlist({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [noCompanion, setNoCompanion] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (data._hp) return; // honeypot
    setStatus("sending");
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/rc2027_leads`, {
        method: "POST",
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nome: data.nome,
          acompanhante: noCompanion ? null : data.acompanhante || null,
          telefone: data.telefone,
          indicacao: data.indicacao || null,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStatus("idle");
          setOpen(true);
        }}
        className="btn-luxe inline-flex items-center justify-center rounded-lg bg-gold px-8 py-4 font-sans text-[0.82rem] font-semibold uppercase tracking-wide2 text-deep"
      >
        {label}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-deep/70 backdrop-blur-sm [text-shadow:none] sm:items-center sm:p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
          <div
            className="relative w-full max-w-md rounded-t-3xl bg-offwhite p-7 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-deep/50 transition hover:bg-deep/5 hover:text-deep"
            >
              <X className="h-6 w-6" />
            </button>

            {status === "done" ? (
              <div className="py-8 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                  <Check className="h-7 w-7 text-deep-700" />
                </span>
                <p className="font-cormorant text-2xl text-deep">Inscrição recebida!</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-deep/60">
                  Você está na lista exclusiva do grupo. Em breve entramos em contato.
                </p>
              </div>
            ) : (
              <>
                <p className="font-sans text-xs font-semibold uppercase tracking-luxe text-deep-700">
                  Lista exclusiva
                </p>
                <h3 className="mt-1 font-cormorant text-3xl leading-tight text-deep">
                  Entrar na lista do grupo
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-deep/60">
                  Cada cabine acomoda 2 pessoas. Precisamos do contato de apenas uma, com o nome das
                  duas.
                </p>
                <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
                  <input type="text" name="_hp" tabIndex={-1} autoComplete="off" className="hidden" />
                  <input name="nome" required placeholder="Seu nome completo" className={field} autoComplete="name" />
                  {!noCompanion && (
                    <input
                      name="acompanhante"
                      required
                      placeholder="Nome do(a) acompanhante"
                      className={field}
                    />
                  )}
                  <label className="flex items-center gap-2.5 px-1 py-0.5">
                    <input
                      type="checkbox"
                      checked={noCompanion}
                      onChange={(e) => setNoCompanion(e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    <span className="font-sans text-sm text-deep/70">
                      Ainda não escolhi meu acompanhante
                    </span>
                  </label>
                  <input
                    name="telefone"
                    required
                    placeholder="Seu telefone / WhatsApp"
                    className={field}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  <input name="indicacao" placeholder="Quem indicou você?" className={field} />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-luxe flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-4 font-sans text-sm font-semibold uppercase tracking-wide2 text-deep disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
                      </>
                    ) : (
                      "Quero entrar"
                    )}
                  </button>
                  {status === "error" && (
                    <p className="text-center text-sm text-red-600">
                      Não foi possível enviar. Tente novamente.
                    </p>
                  )}
                  <p className="pt-1 text-center text-xs leading-relaxed text-deep/45">
                    Seus dados vão apenas para a organização do grupo.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
