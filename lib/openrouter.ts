import OpenAI from "openai";
import { fullResume } from "@/data/resume-full";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const API_KEY = process.env.OPENROUTER_API_KEY || "";

/**
 * OpenRouter client — uses OpenAI-compatible SDK.
 */
export const openrouter = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_APP_URL || "http://localhost:3000",
    "X-Title": "Kranthi Portfolio AI",
  },
});

export const SYSTEM_PROMPT = `You are Kranthi Kumar Katta's AI portfolio assistant. You answer questions about his experience, skills, projects, certifications, and how to contact him.

Use the following RESUME DATA as your source of truth. Answer ONLY based on this data — never fabricate information.

${fullResume}

RULES:
- Always be helpful, professional, and concise
- Use markdown formatting (bold, bullets, numbered lists) for readability
- If asked something not in the resume, say so politely and suggest relevant topics
- When discussing projects, include the tech stack and key achievements
- When asked about experience, include company names, roles, and time periods
- When asked about contact, provide email, LinkedIn, and GitHub
- Keep responses under 300 words unless asked for details
- Use emojis sparingly for visual appeal
- Be conversational but informative`;

/**
 * Get the best available free model from OpenRouter.
 * Tries known free models in priority order.
 */
const FREE_MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.0-flash-001",
  "google/gemini-flash-1.5",
  "deepseek/deepseek-chat-v3-0324:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "meta-llama/llama-4-maverick:free",
];

export async function getAvailableModel(): Promise<string> {
  // Try the preferred free model first
  for (const model of FREE_MODELS) {
    try {
      await openrouter.chat.completions.create({
        model,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 5,
      });
      console.log(`Using model: ${model}`);
      return model;
    } catch {
      // Model not available, try next
    }
  }

  // Fallback: list all available models and pick the first free one
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    });
    const data = await response.json();
    const freeModel = data.data?.find(
      (m: { pricing?: { prompt?: string | number } }) =>
        m.pricing?.prompt === "0" || m.pricing?.prompt === 0 || m.pricing?.prompt === "0.00"
    );
    if (freeModel) {
      console.log(`Using auto-detected model: ${freeModel.id}`);
      return freeModel.id;
    }
  } catch {}

  // Last resort
  return "google/gemini-2.5-flash";
}

/**
 * Stream a response from OpenRouter.
 * Throws with full error details on failure.
 */
export async function streamOpenRouterResponse(
  messages: Array<{ role: string; content: string }>
): Promise<{ stream: ReadableStream; model: string }> {
  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set. Add it to .env.local");
  }

  const model = await getAvailableModel();

  const response = await openrouter.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  // Convert OpenAI stream to Web ReadableStream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return { stream, model };
}
