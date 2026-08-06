import { NextRequest } from "next/server";
import { completeOpenRouter } from "@/lib/openrouter";
import { getTool, type ToolDefinition } from "@/lib/tools";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function buildPrompt(tool: ToolDefinition, values: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const f of tool.fields) {
    const v = values[f.name];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      parts.push(`${f.label}: ${v}`);
    }
  }
  const inputsText = parts.length ? parts.join("\n") : "(no inputs provided)";

  return `You are the "${tool.name}" tool on Kranthi Kumar Katta's AI-powered portfolio platform.

Your purpose: ${tool.description}

Follow these instructions carefully:
${tool.systemPrompt}

USER INPUTS:
${inputsText}

Produce the output now. Use markdown formatting where appropriate. Be accurate and complete.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const toolId = body?.toolId as string | undefined;
    const values = (body?.inputs && typeof body.inputs === "object" ? body.inputs : {}) as Record<string, unknown>;

    const tool = getTool(toolId ?? "");
    if (!tool) {
      return json({ error: "Unknown tool." }, 404);
    }

    const output = await completeOpenRouter(
      [{ role: "user", content: buildPrompt(tool, values) }],
      { temperature: 0.5, maxTokens: 2048 }
    );

    return json({ output }, 200);
  } catch (err) {
    console.error("Tools API error:", err);
    return json({ error: "Something went wrong running the tool." }, 500);
  }
}
