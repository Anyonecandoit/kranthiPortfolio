import OpenAI from "openai";
import { resumeToMarkdown } from "@/data/resume";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * OpenRouter client — lazily initialized (avoids build-time error).
 */
export function getOpenRouter() {
  const API_KEY = process.env.OPENROUTER_API_KEY || "";
  if (!API_KEY) throw new Error("OPENROUTER_API_KEY is not set");
  return new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey: API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_APP_URL || "http://localhost:3000",
      "X-Title": "Kranthi Portfolio AI",
    },
  });
}

export const SYSTEM_PROMPT = `You are Kranthi Kumar Katta's AI portfolio assistant. You answer questions about his experience, skills, projects, certifications, and how to contact him.

Use the following RESUME DATA as your source of truth. Answer ONLY based on this data — never fabricate information.

${resumeToMarkdown()}

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
 * Resolves once per server process and caches the result, so the per-request
 * probing overhead (up to 6 blocking completions) only happens once.
 */
const FREE_MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.0-flash-001",
  "google/gemini-flash-1.5",
  "deepseek/deepseek-chat-v3-0324:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "meta-llama/llama-4-maverick:free",
];

let _cachedModel: string | null = null;
let _resolving: Promise<string> | null = null;

async function resolveModel(): Promise<string> {
  if (_cachedModel) return _cachedModel;

  // Prefer the cheap /models listing (one call) over 6 blocking probes.
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    });
    const data = await response.json();
    const freeModel = data.data?.find(
      (m: { pricing?: { prompt?: string | number } }) =>
        m.pricing?.prompt === "0" || m.pricing?.prompt === 0 || m.pricing?.prompt === "0.00"
    );
    if (freeModel?.id) {
      _cachedModel = freeModel.id;
      console.log(`[model-cache] resolved via /models: ${_cachedModel}`);
      return _cachedModel!;
    }
  } catch {}

  // Fallback: probe known free models with a cheap completion.
  for (const model of FREE_MODELS) {
    try {
      await getOpenRouter().chat.completions.create({
        model,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 5,
      });
      _cachedModel = model;
      console.log(`[model-cache] resolved via probe: ${_cachedModel}`);
      return _cachedModel!;
    } catch {
      // Model not available, try next
    }
  }

  _cachedModel = "google/gemini-2.5-flash";
  console.log(`[model-cache] using default: ${_cachedModel}`);
  return _cachedModel;
}

export async function getAvailableModel(): Promise<string> {
  if (_cachedModel) return _cachedModel;
  // Deduplicate concurrent resolution attempts (e.g. two requests land before cache is set).
  _resolving = _resolving ?? resolveModel();
  try {
    return await _resolving;
  } finally {
    _resolving = null;
  }
}

export interface StreamOpenRouterOptions {
  /** System prompt — defaults to the portfolio-assistant prompt. */
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Stream a response from OpenRouter.
 * Throws with full error details on failure.
 */
export async function streamOpenRouterResponse(
  messages: Array<{ role: string; content: string }>,
  options: StreamOpenRouterOptions = {}
): Promise<{ stream: ReadableStream; model: string }> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set. Add it to .env.local");
  }

  const { systemPrompt = SYSTEM_PROMPT, temperature = 0.7, maxTokens = 1024 } = options;
  const model = await getAvailableModel();

  const response = await getOpenRouter().chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ],
    temperature,
    max_tokens: maxTokens,
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

export interface CompleteOpenRouterOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Non-streaming completion (used by structured tools like the JD matcher).
 * Returns the raw text content; callers are responsible for parsing.
 */
export async function completeOpenRouter(
  messages: Array<{ role: string; content: string }>,
  options: CompleteOpenRouterOptions = {}
): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set. Add it to .env.local");
  }
  const { systemPrompt, temperature = 0.3, maxTokens = 2048 } = options;
  const model = await getAvailableModel();

  const response = await getOpenRouter().chat.completions.create({
    model,
    messages: [
      ...(systemPrompt
        ? [{ role: "system" as const, content: systemPrompt }]
        : []),
      ...messages.map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ],
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices?.[0]?.message?.content ?? "";
}
