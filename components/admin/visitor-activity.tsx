"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type EventRow = Database["public"]["Tables"]["analytics_events"]["Row"];

const TYPE_COLORS: Record<string, "default" | "accent" | "success" | "warning"> = {
  page_view: "default",
  chat_message: "accent",
  chat_session: "accent",
  resume_download: "success",
  agent_select: "warning",
  search: "warning",
  tool_use: "success",
  lead_submit: "success",
  jd_match: "accent",
};

export function VisitorActivity() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120);
    setEvents((data as EventRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Users size={16} className="text-sky-400" /> Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw size={14} />
          </Button>
        </div>
      </CardHeader>
      {loading ? (
        <p className="px-4 pb-4 text-sm text-[var(--text-secondary)]">Loading…</p>
      ) : events.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-[var(--text-secondary)]">No events yet.</p>
      ) : (
        <div className="px-4 pb-4 max-h-[420px] overflow-y-auto space-y-1.5">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2">
              <Badge variant={TYPE_COLORS[e.event_type] ?? "default"}>{e.event_type}</Badge>
              <span className="text-xs text-[var(--text-secondary)] font-mono truncate flex-1">{e.page_path ?? "—"}</span>
              <span className="text-[10px] text-[var(--text-secondary)] shrink-0">
                {new Date(e.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
