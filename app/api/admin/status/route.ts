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

/** Admin-only: environment/config status (booleans only — no secrets). */
export async function GET(req: NextRequest) {
  const auth = bearerToken(req.headers.get("authorization"));
  if (!(await isAdminToken(auth))) {
    return json({ error: "Admin access required." }, 403);
  }

  const service = getServiceClient();
  const { data: kbCount } = await service
    .from("knowledge_documents")
    .select("id", { count: "exact", head: true });

  return json(
    {
      env: {
        openrouter: Boolean(process.env.OPENROUTER_API_KEY),
        gemini: Boolean(process.env.GEMINI_API_KEY),
        serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        projectRef: Boolean(process.env.SUPABASE_PROJECT_REF),
        appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
      },
      tables: [
        "profiles",
        "conversations",
        "messages",
        "knowledge_documents",
        "analytics_events",
        "contact_requests",
        "site_settings",
      ],
      knowledgeChunks: kbCount ?? 0,
    },
    200
  );
}
