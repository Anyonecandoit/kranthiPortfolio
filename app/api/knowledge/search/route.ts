import { NextRequest } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { searchKnowledge } from "@/lib/knowledge";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Semantic search over the knowledge base (used by admin test + chat). */
export async function POST(req: NextRequest) {
  try {
    const { query, topK } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return json({ error: "Missing query." }, 400);
    }
    const hits = await searchKnowledge(
      getServiceClient(),
      query.trim().slice(0, 2000),
      Math.min(Number(topK) || 3, 10)
    );
    return json({ hits }, 200);
  } catch (err) {
    console.error("Knowledge search error:", err);
    return json({ error: "Search failed." }, 500);
  }
}
