-- Portfolio Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'visitor' check (role in ('admin', 'visitor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Conversations
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'New Conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Messages
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Knowledge documents (for RAG)
create table public.knowledge_documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  file_type text not null check (file_type in ('pdf', 'docx', 'markdown', 'text')),
  file_url text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

-- Analytics
create table public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  page_path text,
  user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.analytics_events enable row level security;

-- Profiles: users can read all, update own
create policy "Public profiles" on public.profiles for select using (true);
create policy "Update own profile" on public.profiles for update using (auth.uid() = id);

-- Conversations: users can CRUD own
create policy "Own conversations" on public.conversations for all using (auth.uid() = user_id);

-- Messages: users can read own conversation messages
create policy "Own messages" on public.messages for select
  using (exists (
    select 1 from public.conversations
    where id = conversation_id and user_id = auth.uid()
  ));
create policy "Insert own messages" on public.messages for insert
  with check (exists (
    select 1 from public.conversations
    where id = conversation_id and user_id = auth.uid()
  ));

-- Knowledge: everyone can read
create policy "Public knowledge" on public.knowledge_documents for select using (true);
create policy "Admin manage knowledge" on public.knowledge_documents for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Analytics: admin can read, anyone can insert
create policy "Admin analytics" on public.analytics_events for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));
create policy "Anyone can log events" on public.analytics_events for insert with check (true);

-- Indexes
create index idx_conversations_user on public.conversations(user_id);
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_knowledge_embedding on public.knowledge_documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index idx_analytics_type on public.analytics_events(event_type);
create index idx_analytics_created on public.analytics_events(created_at);
