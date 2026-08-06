#!/bin/bash
# Deploy database schema to Supabase
API_URL="https://api.supabase.com/v1/projects/utukxclojtfveabmmbmg/database/query"
TOKEN="${SUPABASE_ACCESS_TOKEN}"

run_query() {
  local query="$1"
  echo "Running: ${query:0:60}..."
  curl -s -X POST "$API_URL" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$query\"}"
  echo ""
}

echo "=== Step 1: Enable vector extension ==="
run_query "CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;"

echo "=== Step 2: Enable UUID extension ==="
run_query "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\" WITH SCHEMA extensions;"

echo "=== Step 3: Create tables ==="
run_query "CREATE TABLE IF NOT EXISTS public.profiles (id uuid references auth.users on delete cascade primary key, email text unique not null, full_name text not null default '', avatar_url text, role text not null default 'visitor' check (role in ('admin', 'visitor')), created_at timestamptz not null default now(), updated_at timestamptz not null default now());"

run_query "CREATE TABLE IF NOT EXISTS public.conversations (id uuid primary key default uuid_generate_v4(), user_id uuid references public.profiles(id) on delete cascade not null, title text not null default 'New Conversation', created_at timestamptz not null default now(), updated_at timestamptz not null default now());"

run_query "CREATE TABLE IF NOT EXISTS public.messages (id uuid primary key default uuid_generate_v4(), conversation_id uuid references public.conversations(id) on delete cascade not null, role text not null check (role in ('user', 'assistant')), content text not null, created_at timestamptz not null default now());"

run_query "CREATE TABLE IF NOT EXISTS public.knowledge_documents (id uuid primary key default uuid_generate_v4(), title text not null, content text not null, file_type text not null check (file_type in ('pdf', 'docx', 'markdown', 'text')), file_url text, embedding vector(1536), created_at timestamptz not null default now());"

run_query "CREATE TABLE IF NOT EXISTS public.analytics_events (id uuid primary key default uuid_generate_v4(), event_type text not null, page_path text, user_id uuid references public.profiles(id) on delete set null, metadata jsonb default '{}', created_at timestamptz not null default now());"

echo "=== Step 4: Enable RLS ==="
run_query "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;"
run_query "ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;"
run_query "ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;"
run_query "ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;"
run_query "ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;"

echo "=== Step 5: Create policies ==="
run_query "CREATE POLICY IF NOT EXISTS \"Public profiles\" ON public.profiles FOR SELECT USING (true);"
run_query "CREATE POLICY IF NOT EXISTS \"Update own profile\" ON public.profiles FOR UPDATE USING (auth.uid() = id);"
run_query "CREATE POLICY IF NOT EXISTS \"Own conversations\" ON public.conversations FOR ALL USING (auth.uid() = user_id);"
run_query "CREATE POLICY IF NOT EXISTS \"Own messages\" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid()));"
run_query "CREATE POLICY IF NOT EXISTS \"Insert own messages\" ON public.messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid()));"
run_query "CREATE POLICY IF NOT EXISTS \"Public knowledge\" ON public.knowledge_documents FOR SELECT USING (true);"
run_query "CREATE POLICY IF NOT EXISTS \"Admin manage knowledge\" ON public.knowledge_documents FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));"
run_query "CREATE POLICY IF NOT EXISTS \"Admin analytics\" ON public.analytics_events FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));"
run_query "CREATE POLICY IF NOT EXISTS \"Anyone can log events\" ON public.analytics_events FOR INSERT WITH CHECK (true);"

echo "=== Step 6: Auto-create profile on signup trigger ==="
run_query "CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS \$\$ BEGIN INSERT INTO public.profiles (id, email, full_name) VALUES (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', '')); RETURN new; END; \$\$ LANGUAGE plpgsql SECURITY DEFINER;"
run_query "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;"
run_query "CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();"

echo "=== Step 7: Create indexes ==="
run_query "CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.conversations(user_id);"
run_query "CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);"
run_query "CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON public.knowledge_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);"
run_query "CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.analytics_events(event_type);"
run_query "CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at);"

echo "=== Done! Schema deployed ==="
