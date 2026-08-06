import { NextRequest } from "next/server";
import { completeOpenRouter } from "@/lib/openrouter";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type NoteAction = "summarize" | "improve" | "grammar" | "expand" | "tldr" | "translate" | "continue";

const ACTION_LABELS: Record<NoteAction, string> = {
  summarize: "summarize",
  improve: "improve and polish",
  grammar: "fix the grammar and spelling of",
  expand: "expand into a fuller draft of",
  tldr: "produce a TL;DR and key takeaways for",
  translate: "translate",
  continue: "continue writing",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const action = body?.action as NoteAction | undefined;
    const title = String(body?.title ?? "Untitled note").slice(0, 300);
    const content = String(body?.content ?? "").slice(0, 12000);
    const lang = String(body?.lang ?? "English").slice(0, 60);
    const rules = String(body?.rules ?? "").slice(0, 4000);

    if (!action || !ACTION_LABELS[action]) {
      return json({ error: "Unknown action." }, 400);
    }
    if (!content.trim()) {
      return json({ error: "The note is empty." }, 400);
    }

    const instruction =
      action === "translate"
        ? `Translate the following note into ${lang}. Preserve the formatting, tone, and meaning exactly.`
        : `${ACTION_LABELS[action]} the following note. Keep all facts and numbers; use clear markdown structure where helpful. Do not invent facts that are not in the note.`;

    // Read the user's rules FIRST — they override the generic instruction.
    const rulesBlock = rules.trim()
      ? `Before doing anything, READ AND FOLLOW the user's rules below. They take priority over the generic instruction.\n\nUSER RULES:\n${rules.trim()}\n\nNow perform the task.`
      : instruction;

    const prompt = `${rulesBlock}

NOTE TITLE: ${title}

NOTE CONTENT:
${content}

Produce only the result.`;

    const output = await completeOpenRouter(
      [{ role: "user", content: prompt }],
      { temperature: 0.4, maxTokens: 4000 }
    );

    return json({ output }, 200);
  } catch (err) {
    console.error("Notes AI error:", err);
    return json({ error: "Something went wrong." }, 500);
  }
}
