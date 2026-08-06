import pdfParse from "pdf-parse/lib/pdf-parse.js";

/**
 * Extract plain text from a PDF buffer (used for JD uploads).
 * Best-effort: returns "" on any failure so callers can fall back to
 * pasted text or show a helpful message.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return (data.text ?? "").trim();
  } catch (err) {
    console.error("[pdf] extraction failed:", err);
    return "";
  }
}
