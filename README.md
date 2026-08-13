# QIMO Croácia 2027 — Proposta

Landing de vendas (substitui um PDF de proposta) para um grupo fechado.
Projeto **separado** do guia da viagem (`../Guia Croacia`), com deploy próprio.

- **Produção:** https://croaciaclaudiohermolin.qimobr.com
- **Stack:** Next.js 15 · React 19 · Tailwind · Framer Motion
- **Design/conteúdo:** reaproveitados do guia (destinos, restaurantes, vinhos,
  experiências) + fotografia real em `public/images/photos/`.

## Editar os textos — pelo admin

A cópia para Claudio Hermolin usa conteúdo congelado e independente. O `/admin`
redireciona para a apresentação para evitar alterações acidentais na proposta original.
com a senha e edite os textos: nome do grupo, datas, hero, manifesto, benefícios,
o que está incluído e FAQ. Clique em **Salvar** — o site atualiza em até ~1 minuto.
Dá para trocar a senha no próprio painel.

Os textos ficam no Supabase (tabela `rc2027_content`), lidos com ISR + fallback:
se o banco falhar, a página usa os valores estáticos de
[`content/proposal.ts`](content/proposal.ts) (que também são o padrão inicial).
O conteúdo rico (destinos, restaurantes, vinhos) continua nos arquivos de `content/`.

### Variáveis de ambiente

`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (veja `.env.local`
para rodar localmente; já configuradas na Netlify). O anon key é público por design.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy (Netlify)

Novo site na Netlify apontando para esta pasta/repositório. O `netlify.toml` já
configura o build (`@netlify/plugin-nextjs`). Depois, aponte o domínio
`croaciaclaudiohermolin.qimobr.com` para o site.

## Estrutura

- `app/page.tsx` — a landing (15 seções, um scroll cinematográfico).
- `app/opengraph-image.tsx` — preview de link branded 2027 (next/og, sem sharp).
- `components/proposal/` — mapa da rota, formulário de reserva, FAQ, CTA fixo.
- `content/` — conteúdo copiado do guia + `proposal.ts` (editável).
