# Admin Document Vault — private storage for your testing docs

A private, admin-only vault inside `/admin` where you can store and organize your
important testing documents (certifications, resumes, test plans, cheat sheets,
API references, interview prep) and retrieve them anytime — preview, download,
or delete.

## What it stores and where

| Layer | Where |
|---|---|
| The actual files (PDF, Word, Excel, text, images) | Supabase **Storage**, bucket `documents` (private, 25 MB/file) |
| Metadata (title, category, tags, size, dates) | Supabase **Postgres**, table `admin_documents` |
| Access control | RLS — the row is only readable/writable by the owner (your admin account), and storage objects are locked to your `user_id/` folder |

Because files upload **directly from the browser to storage** (signed JWT), there
is no server-side size limit — unlike the 4.5 MB Vercel API limit that would apply
to server uploads.

## One-time setup (required)

Run **`supabase/document-vault.sql`** once in the Supabase SQL Editor (or
`bash scripts/deploy-schema.sh` — idempotent). It creates:

1. the private `documents` storage bucket (+ 25 MB and allowed-type limits),
2. storage RLS (`documents_owner_all`) so only you can read/write your folder,
3. the `admin_documents` table with owner-only RLS (`own_documents`).

Until this runs, uploads fail with a clear "Storage not ready" message pointing
here.

## How to use

1. Sign in → **Admin** → **Document Vault**.
2. Drag a PDF in (or click to choose), set a title/category/tags, **Save to Vault**.
3. Search by title/category/tag, filter by category, click a doc to preview the
   PDF inline, download it, or delete it.

Suggested categories are built in (Certifications, Resume, Test Plans, Interview
Prep, Cheat Sheets, API & References, Reports, Other) — all editable per document.

## Notes

- Signed URLs used for preview/download expire after 1 hour — reopen the vault
  to refresh them (no action needed, it happens automatically on load).
- Documents here are **private** — unlike the Knowledge Base, they never feed the
  public chat and are never exposed to other users.
- If you also want a document's contents to power the chat AI (RAG), use the
  existing **Knowledge Base** section for that — it extracts and embeds text.

## Files

```
supabase/document-vault.sql            – migration (run this once)
supabase/schema.sql                    – fresh-install schema (includes the table)
scripts/deploy-schema.sh               – deployable path (idempotent)
app/api/admin/documents/route.ts       – GET list+signed URLs / POST / PATCH / DELETE
components/admin/document-vault.tsx    – the Vault UI (mounted in /admin)
lib/supabase.ts                        – admin_documents types
```
