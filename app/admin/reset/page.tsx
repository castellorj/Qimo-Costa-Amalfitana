"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Redefinição da senha do /admin por token de uso único (?t=...).
 * A senha digitada aqui vai direto para o banco (hash bcrypt) — não passa
 * por lugar nenhum onde possa ser lida depois.
 */
function ResetForm() {
  const token = useSearchParams().get("t") ?? "";
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd !== confirm) {
      setStatus("error");
      setErr("As senhas não são iguais.");
      return;
    }
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch(`${URL_BASE}/rest/v1/rpc/rc2027_reset_password`, {
        method: "POST",
        headers: {
          apikey: KEY,
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_token: token, p_new: pwd }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Não foi possível redefinir a senha.");
      }
      setStatus("done");
    } catch (e: any) {
      setStatus("error");
      setErr(e?.message ?? "Não foi possível redefinir a senha.");
    }
  }

  if (status === "done") {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="font-cormorant text-3xl text-offwhite">Senha redefinida</h1>
        <p className="mt-2 font-sans text-sm text-offwhite/60">
          O link acabou de expirar (uso único). Já pode entrar no admin.
        </p>
        <a
          href="/admin"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center border border-gold/50 px-8 font-sans text-xs uppercase tracking-luxe text-gold-light hover:bg-gold/10"
        >
          Ir para o admin
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm text-center">
      <p className="font-sans text-xs font-semibold uppercase tracking-luxe text-gold-light">Admin</p>
      <h1 className="mt-2 font-cormorant text-3xl text-offwhite">Definir nova senha</h1>
      <p className="mb-8 mt-1 font-sans text-sm text-offwhite/60">
        Mínimo de 8 caracteres. Vale para o admin de todas as propostas.
      </p>

      {!token && (
        <p className="mb-6 font-sans text-sm text-red-300">
          Link sem token. Abra o endereço completo que você recebeu.
        </p>
      )}

      <input
        type="password"
        autoComplete="new-password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="Nova senha"
        className="w-full border border-offwhite/20 bg-transparent px-4 py-3 text-center font-sans text-offwhite placeholder:text-offwhite/35 focus:border-gold focus:outline-none"
      />
      <input
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repetir a nova senha"
        className="mt-3 w-full border border-offwhite/20 bg-transparent px-4 py-3 text-center font-sans text-offwhite placeholder:text-offwhite/35 focus:border-gold focus:outline-none"
      />

      {status === "error" && <p className="mt-4 font-sans text-sm text-red-300">{err}</p>}

      <button
        type="submit"
        disabled={status === "sending" || !token || pwd.length < 8}
        className="mt-6 min-h-[48px] w-full border border-gold/50 px-8 font-sans text-xs uppercase tracking-luxe text-gold-light transition-colors hover:bg-gold/10 disabled:opacity-40"
      >
        {status === "sending" ? "Salvando…" : "Salvar senha"}
      </button>
    </form>
  );
}

export default function ResetPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-deep px-6">
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </main>
  );
}
