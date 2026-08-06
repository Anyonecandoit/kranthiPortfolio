import { NextRequest } from "next/server";
import {
  getServiceClient,
  isAdminToken,
  bearerToken,
} from "@/lib/supabase-admin";
import { chunkText, generateEmbedding } from "@/lib/embeddings";
import { extractTextFromPdf } from "@/lib/pdf";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/**
 * Admin-only: accept a document (pasted text or PDF/text file), chunk it,
 * embed each chunk, and store as knowledge_documents rows for RAG.
 */
export async function POST(req: NextRequest) {
  const auth = bearerToken(req.headers.get("authorization"));
  if (!(await isAdminToken(auth))) {
    return json({ error: "Admin access required." }, 403);
  }
  const service = getServiceClient();

  const form = await req.formData();
  const title = (form.get("title") as string)?.trim() || "Untitled document";
  const content = (form.get("content") as string) ?? "";
  const file = form.get("file");

  let text = content.trim();
  let fileType = "text";
  if (!text && file instanceof File) {
    const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
    const isText = file.type.startsWith("text/") || file.type === "application/json" || file.type === "application/x-yaml";
    if (!isPdf && !isText) {
      return json({ error: "Unsupported file type. Upload a PDF or text file." }, 400);
    }
    const buf = Buffer.from(await file.arrayBuffer());
    text = isPdf ? await extractTextFromPdf(buf) : buf.toString("utf-8");
    fileType = isPdf ? "pdf" : file.type;
  }
  if (!text.trim()) {
    return json({ error: "Provide document content or upload a file." }, 400);
  }
  text = text.slice(0, 100000);

  const chunks = chunkText(text).slice(0, 40);

  const rows = [];
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    rows.push({
      title: chunks.length > 1 ? `${title} — part ${i + 1}/${chunks.length}` : title,
      content: chunks[i],
      file_type: fileType,
      embedding,
    });
  }

  const { error } = await service.from("knowledge_documents").insert(rows);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true, stored: rows.length }, 200);
}
