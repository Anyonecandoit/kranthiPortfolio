import { NextRequest } from "next/server";
import { completeOpenRouter } from "@/lib/openrouter";
import { getAgentById } from "@/lib/agents";
import { countKnowledgeDocs, searchKnowledge, hitsToContext } from "@/lib/knowledge";
import { getServiceClient } from "@/lib/supabase-admin";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const DEFAULT_AGENT = "guide";

interface HistoryMessage {
  role: string;
  content: string;
}

/** Simple conversational endpoint for the voice assistant (non-streaming). */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const text = String(body?.text ?? "").trim().slice(0, 4000);
  const agentId = typeof body?.agentId === "string" ? body.agentId : DEFAULT_AGENT;
  const history = Array.isArray(body?.history) ? (body.history as HistoryMessage[]).slice(-8) : [];

  if (!text) return json({ error: "Nothing to answer." }, 400);

  const agent = getAgentById(agentId) ?? getAgentById(DEFAULT_AGENT);
  let systemPrompt = agent?.systemPrompt;

  // RAG: augment with relevant knowledge-base content (best-effort).
  try {
    const client = getServiceClient();
    if ((await countKnowledgeDocs(client)) > 0) {
      const hits = await searchKnowledge(client, text, 3);
      if (hits.length) {
        systemPrompt = `${systemPrompt ?? ""}

RELEVANT KNOWLEDGE BASE — use it only where it answers the question better than the resume. Do not mention it unless relevant:
${hitsToContext(hits)}`.trim();
      }
    }
  } catch (err) {
    console.warn("[voice] knowledge retrieval skipped:", err);
  }

  const messages = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content).slice(0, 2000),
    })),
    { role: "user" as const, content: text },
  ];

  try {
    const reply = await completeOpenRouter(messages, {
      systemPrompt,
      temperature: 0.4,
      maxTokens: 700,
    });
    return json({ reply }, 200);
  } catch (err) {
    console.error("[voice] completion failed:", err);
    return json({ error: "Could not generate a reply." }, 500);
  }
}
