-- ============================================================================
-- Admin Document Vault — migration
-- Run this once in the Supabase SQL Editor (or `supabase db push`).
-- Idempotent: safe to re-run.
--
-- Creates:
--   1. A private `documents` storage bucket (files live here, never public)
--   2. Storage RLS: each user can only touch objects under their own folder
--   3. The `admin_documents` table (metadata: title, category, tags, size…)
--      with owner-only RLS
-- ============================================================================

-- 1. Private storage bucket for uploaded files.
--    Allowed types mirror what the Document Vault UI accepts.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  26214400, -- 25 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do nothing;

-- 2. Storage RLS — users manage only their own folder (path = <user_id>/...).
--    Signed URLs + uploads/removes from the client are authorized by this.
--    Note: `CREATE POLICY IF NOT EXISTS` needs PG15; Supabase projects on
--    PG14 use drop-if-exists + plain create (idempotent, no data loss).
drop policy if exists documents_owner_all on storage.objects;
create policy documents_owner_all
  on storage.objects
  for all
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Metadata table.
create table if not exists public.admin_documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null default 'Other',
  tags text[] not null default '{}',
  file_path text not null,
  file_name text not null,
  file_size integer not null default 0,
  file_type text not null default 'application/pdf',
  created_at timestamptz not null default now()
);

alter table public.admin_documents enable row level security;

drop policy if exists own_documents on public.admin_documents;
create policy own_documents
  on public.admin_documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_admin_documents_user on public.admin_documents(user_id);
