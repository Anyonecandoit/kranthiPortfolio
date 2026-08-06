import { NextRequest } from "next/server";
import { streamOpenRouterResponse, SYSTEM_PROMPT } from "@/lib/openrouter";
import { getAgent } from "@/lib/agents";
import { getServiceClient } from "@/lib/supabase-admin";
import { countKnowledgeDocs, searchKnowledge, hitsToContext } from "@/lib/knowledge";

/**
 * AI Chat API — OpenRouter powered.
 * Streams responses with full error reporting.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, agentId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Input validation hardening ---
    const MAX_MESSAGES = 60;
    const MAX_CONTENT_LEN = 4000;
    const VALID_ROLES = new Set(["user", "assistant"]);

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Messages array too large (max ${MAX_MESSAGES})` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const sanitized: Array<{ role: string; content: string }> = [];
    for (const m of messages) {
      if (!m || typeof m !== "object") continue;
      const role = typeof m.role === "string" ? m.role.toLowerCase() : "";
      const content = typeof m.content === "string" ? m.content : "";
      if (!VALID_ROLES.has(role)) continue; // drop invalid roles
      sanitized.push({
        role,
        content: content.length > MAX_CONTENT_LEN ? content.slice(-MAX_CONTENT_LEN) : content,
      });
    }

    if (sanitized.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid user/assistant messages found" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OPENROUTER_API_KEY is not configured",
          fix: "Add OPENROUTER_API_KEY=sk-or-v1-... to .env.local",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Optional agent persona — falls back to the default assistant prompt.
    const agent = typeof agentId === "string" ? getAgent(agentId) : undefined;
    let systemPrompt = agent ? agent.systemPrompt : undefined;

    // RAG: augment with relevant knowledge-base content (best-effort).
    try {
      const client = getServiceClient();
      const lastUser = [...sanitized].reverse().find((m) => m.role === "user");
      if (lastUser && (await countKnowledgeDocs(client)) > 0) {
        const hits = await searchKnowledge(client, lastUser.content, 3);
        if (hits.length) {
          systemPrompt = `${systemPrompt ?? SYSTEM_PROMPT}

RELEVANT KNOWLEDGE BASE — use it only where it answers the question better than the resume. Do not mention it unless it is relevant:
${hitsToContext(hits)}`;
        }
      }
    } catch (err) {
      console.warn("[chat] knowledge retrieval skipped:", err);
    }

    const { stream, model } = await streamOpenRouterResponse(sanitized, {
      systemPrompt,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Model-Used": model,
      },
    });
  } catch (error: unknown) {
    const err = error as Error & { status?: number; error?: { message?: string } };
    console.error("Chat API error:", err.message || err);

    const errorMessage = err.error?.message || err.message || "Unknown error";
    const statusCode = err.status || 500;

    let suggestion = "";
    if (statusCode === 402) {
      suggestion = "Add credits at https://openrouter.ai/settings/credits";
    } else if (statusCode === 401) {
      suggestion = "Check your OPENROUTER_API_KEY in .env.local";
    } else if (statusCode === 429) {
      suggestion = "Rate limited — wait a moment and try again";
    } else if (statusCode === 404) {
      suggestion = "Model not found — check available models at openrouter.ai/models";
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        status: statusCode,
        suggestion,
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    );
  }
}
