import { createClient } from "@supabase/supabase-js";

let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase URL or key not set");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

/** Backward-compatible export — lazily initialized */
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

/**
 * Database types — auto-generate after running `supabase gen types typescript`
 * For now, define core tables manually.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
      };
      knowledge_documents: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: "pdf" | "docx" | "markdown" | "text";
          embedding: number[] | null;
          created_at: string;
        };
      };
    };
  };
};
