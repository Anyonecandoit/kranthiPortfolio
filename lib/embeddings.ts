import { getOpenRouter } from "./openrouter";

/**
 * Embedding generation with graceful degradation:
 *  1. OpenRouter text-embedding-3-small
 *  2. Google Gemini text-embedding-004 (if key present)
 *  3. Deterministic hash vector (never blocks; weaker but functional)
 * Used server-side only (RAG).
 */

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.slice(0, 8000);

  // 1) OpenRouter
  try {
    const res = await getOpenRouter().embeddings.create({
      model: "openai/text-embedding-3-small",
      input,
    });
    const emb = res.data?.[0]?.embedding;
    if (emb && emb.length > 0) return emb as number[];
  } catch (err) {
    console.warn("[embeddings] OpenRouter failed:", err);
  }

  // 2) Gemini
  try {
    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const res = await model.embedContent(input);
      const values = res.embedding?.values;
      if (values && values.length > 0) return values;
    }
  } catch (err) {
    console.warn("[embeddings] Gemini failed:", err);
  }

  // 3) Deterministic fallback
  return hashEmbedding(input);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export function chunkText(text: string, size = 800, overlap = 100): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  if (clean.length <= size) return [clean];
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    chunks.push(clean.slice(i, i + size));
    i += size - overlap;
  }
  return chunks;
}

function hashEmbedding(text: string, dim = 768): number[] {
  const vec = new Array<number>(dim).fill(0);
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const token of tokens) {
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    vec[Math.abs(h) % dim] += 1;
  }
  return vec;
}
