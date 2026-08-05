import { NextRequest } from "next/server";
import { streamOpenRouterResponse } from "@/lib/openrouter";

/**
 * AI Chat API — OpenRouter powered.
 * Streams responses with full error reporting.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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

    const { stream, model } = await streamOpenRouterResponse(messages);

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
