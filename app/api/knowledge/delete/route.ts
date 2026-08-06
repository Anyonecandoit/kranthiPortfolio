import { NextRequest } from "next/server";
import {
  getServiceClient,
  isAdminToken,
  bearerToken,
} from "@/lib/supabase-admin";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Admin-only: delete a single knowledge document row. */
export async function POST(req: NextRequest) {
  const auth = bearerToken(req.headers.get("authorization"));
  if (!(await isAdminToken(auth))) {
    return json({ error: "Admin access required." }, 403);
  }

  const { id } = await req.json().catch(() => ({ id: null as string | null }));
  if (!id || typeof id !== "string") {
    return json({ error: "Missing document id." }, 400);
  }

  const service = getServiceClient();
  const { error } = await service.from("knowledge_documents").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true }, 200);
}
