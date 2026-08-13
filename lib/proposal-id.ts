/**
 * Identifica ESTA proposta no banco (linha de `rc2027_content.id`).
 *
 * Ao copiar o projeto para um novo cliente, basta:
 *   1. trocar o fallback abaixo (ou definir NEXT_PUBLIC_PROPOSAL_ID no Netlify);
 *   2. publicar. A primeira gravação no admin cria a linha no banco.
 *
 * Enquanto a linha não existir, o site mostra o conteúdo congelado do projeto
 * (content/*.json) — ou seja, nada muda visualmente até alguém editar.
 */
export const PROPOSAL_ID =
  process.env.NEXT_PUBLIC_PROPOSAL_ID?.trim() || "sicilia-costa-amalfitana";
