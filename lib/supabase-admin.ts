import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";

/**
 * Server-only Supabase helpers. The service-role client bypasses RLS, so it
 * must NEVER be imported from client components — only from route handlers.
 */

export function getServiceClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env (URL / service role key) not set");
  return createClient<Database>(url, key);
}

/**
 * Verifies that the caller (identified by their Supabase access token in the
 * Authorization header) is an admin. Used to gate admin-only endpoints even
 * though the route itself may operate with the service-role client.
 */
export async function isAdminToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;
  try {
    const client = createClient<Database>(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data } = await client.from("profiles").select("role").single();
    return data?.role === "admin";
  } catch {
    return false;
  }
}

/** Reads the bearer token from a request's Authorization header. */
export function bearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}
