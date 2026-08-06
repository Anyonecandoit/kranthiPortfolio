import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";
import { generateEmbedding, cosineSimilarity } from "./embeddings";

/**
 * Server-side knowledge base retrieval (RAG). Docs are stored as embedding
 * rows in knowledge_documents; we compute cosine similarity in JS over the
 * (small) doc set — no pgvector operator required at the API layer.
 */

export interface KnowledgeHit {
  id: string;
  title: string;
  content: string;
  score: number;
}

export async function countKnowledgeDocs(
  client: SupabaseClient<Database>
): Promise<number> {
  const { count } = await client
    .from("knowledge_documents")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

export async function searchKnowledge(
  client: SupabaseClient<Database>,
  query: string,
  topK = 3
): Promise<KnowledgeHit[]> {
  if (!query.trim()) return [];
  const { data: docs, error } = await client
    .from("knowledge_documents")
    .select("id,title,content,embedding");
  if (error || !docs?.length) return [];

  const qEmb = await generateEmbedding(query);
  const scored = docs
    .filter((d) => Array.isArray(d.embedding) && d.embedding.length > 0)
    .map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      score: cosineSimilarity(qEmb, d.embedding as number[]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

/** Renders retrieved hits as a compact, groundable context block. */
export function hitsToContext(hits: KnowledgeHit[], limit = 2200): string {
  const parts: string[] = [];
  let budget = limit;
  for (const h of hits) {
    const snippet = h.content.slice(0, Math.min(budget, h.content.length));
    if (!snippet) continue;
    parts.push(`[${h.title}]\n${snippet}`);
    budget -= snippet.length;
    if (budget <= 0) break;
  }
  return parts.join("\n\n");
}
