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

/** Extract the Supabase user id (JWT `sub` claim) from an access token. */
function tokenUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const claims = JSON.parse(decoded) as { sub?: string };
    return typeof claims.sub === "string" ? claims.sub : null;
  } catch {
    return null;
  }
}

const BUCKET = "documents";

async function authUserId(req: NextRequest): Promise<string | null> {
  const auth = bearerToken(req.headers.get("authorization"));
  if (!auth || !(await isAdminToken(auth))) return null;
  return tokenUserId(auth);
}

/**
 * Admin-only document vault API. Files are uploaded directly to the private
 * `documents` Supabase Storage bucket from the client (no request-size
 * limits); these routes manage the metadata row in `admin_documents` and
 * hand out short-lived signed URLs for preview/download.
 *
 * Storage RLS (`documents_owner_all` policy) restricts every object to its
 * owner's folder — see supabase/document-vault.sql.
 */

// GET /api/admin/documents — list the admin's documents with fresh signed URLs
export async function GET(req: NextRequest) {
  const uid = await authUserId(req);
  if (!uid) return json({ error: "Admin access required." }, 403);
  const service = getServiceClient();

  const { data, error } = await service
    .from("admin_documents")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);

  const docs = await Promise.all(
    (data ?? []).map(async (doc) => {
      const { data: signed } = await service.storage
        .from(BUCKET)
        .createSignedUrl(doc.file_path, 3600);
      return { ...doc, signedUrl: signed?.signedUrl ?? null };
    })
  );

  return json({ docs }, 200);
}

// POST /api/admin/documents — register an already-uploaded file's metadata
export async function POST(req: NextRequest) {
  const uid = await authUserId(req);
  if (!uid) return json({ error: "Admin access required." }, 403);
  const service = getServiceClient();

  // Idempotently ensure the bucket exists (policies are created via SQL).
  const { data: existing } = await service.storage.getBucket(BUCKET);
  if (!existing) {
    const { error: createErr } = await service.storage.createBucket(BUCKET, {
      public: false,
    });
    if (createErr) return json({ error: `Storage bucket missing: ${createErr.message}` }, 500);
  }

  let body: {
    title?: string;
    category?: string;
    tags?: string[];
    file_path?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const filePath = body.file_path?.trim();
  const fileName = body.file_name?.trim();
  if (!filePath || !fileName) {
    return json({ error: "file_path and file_name are required." }, 400);
  }
  // The file must live in the caller's own storage folder.
  if (!filePath.startsWith(`${uid}/`)) {
    return json({ error: "Invalid file path." }, 400);
  }

  const { data, error } = await service
    .from("admin_documents")
    .insert({
      user_id: uid,
      title: body.title?.trim() || fileName,
      category: body.category?.trim() || "Other",
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      file_path: filePath,
      file_name: fileName,
      file_size: typeof body.file_size === "number" ? body.file_size : 0,
      file_type: body.file_type?.trim() || "application/pdf",
    })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);

  return json({ doc: data }, 200);
}

// PATCH /api/admin/documents — update title / category / tags
export async function PATCH(req: NextRequest) {
  const uid = await authUserId(req);
  if (!uid) return json({ error: "Admin access required." }, 403);
  const service = getServiceClient();

  let body: { id?: string; title?: string; category?: string; tags?: string[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  if (!body.id) return json({ error: "id is required." }, 400);

  const patch: { title?: string; category?: string; tags?: string[] } = {};
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.category === "string" && body.category.trim()) patch.category = body.category.trim();
  if (Array.isArray(body.tags)) patch.tags = body.tags.filter(Boolean);

  const { error } = await service
    .from("admin_documents")
    .update(patch)
    .eq("id", body.id)
    .eq("user_id", uid);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true }, 200);
}

// DELETE /api/admin/documents — remove the storage file + metadata row
export async function DELETE(req: NextRequest) {
  const uid = await authUserId(req);
  if (!uid) return json({ error: "Admin access required." }, 403);
  const service = getServiceClient();

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  if (!body.id) return json({ error: "id is required." }, 400);

  const { data: doc } = await service
    .from("admin_documents")
    .select("file_path")
    .eq("id", body.id)
    .eq("user_id", uid)
    .single();
  if (!doc) return json({ error: "Document not found." }, 404);

  await service.storage.from(BUCKET).remove([doc.file_path]);

  const { error } = await service
    .from("admin_documents")
    .delete()
    .eq("id", body.id)
    .eq("user_id", uid);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true }, 200);
}
