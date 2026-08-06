import { GoogleGenerativeAI } from "@google/generative-ai";
import { resumeToMarkdown } from "@/data/resume";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are Kranthi Kumar Katta's AI portfolio assistant. You answer questions about his experience, skills, projects, certifications, and how to contact him.

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

export async function streamGeminiResponse(
  messages: Array<{ role: string; content: string }>
): Promise<ReadableStream> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1]?.content || "";
  const result = await chat.sendMessageStream(lastMessage);

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });
}
