"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

export interface ContactRequest {
  id: string;
  name: string;
  email: string | null;
  subject: string | null;
  message: string;
  source: string | null;
  status: string;
  created_at: string;
}

/** Submit a contact / human-handoff request. RLS allows anonymous inserts. */
export async function submitContactRequest(payload: {
  name?: string;
  email?: string;
  message: string;
  source?: string;
}): Promise<void> {
  const { error } = await supabase.from("contact_requests").insert({
    name: payload.name?.trim() || "Anonymous",
    email: payload.email?.trim() || null,
    message: payload.message.trim(),
    source: payload.source ?? null,
  });
  if (error) throw new Error(error.message);
}

/**
 * Live unread ("new") contact request count for the navbar badge.
 * Non-admins see 0 because RLS only exposes rows to admins.
 */
export function useUnreadContactCount(pollMs = 60000): number {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const { count: n } = await supabase
        .from("contact_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      if (!cancelled) setCount(n ?? 0);
    };
    load();
    const id = window.setInterval(load, pollMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [user, pollMs]);

  return count;
}

export async function listContactRequests(limit = 50): Promise<ContactRequest[]> {
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as ContactRequest[]) ?? [];
}

export async function markContactRequestsSeen(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from("contact_requests")
    .update({ status: "seen" })
    .in("id", ids);
  if (error) throw new Error(error.message);
}
