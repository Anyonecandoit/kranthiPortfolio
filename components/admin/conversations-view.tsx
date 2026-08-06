"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type ConvRow = Database["public"]["Tables"]["conversations"]["Row"];
type MsgRow = Database["public"]["Tables"]["messages"]["Row"];

export function ConversationsView() {
  const [convs, setConvs] = useState<ConvRow[]>([]);
  const [msgCount, setMsgCount] = useState<Record<string, number>>({});
  const [lastMsg, setLastMsg] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: c } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(20);
    const rows = (c as ConvRow[]) ?? [];
    setConvs(rows);

    if (rows.length) {
      const { data: m } = await supabase
        .from("messages")
        .select("conversation_id,content,role")
        .order("created_at", { ascending: false })
        .limit(1000);
      const msgs = (m as MsgRow[]) ?? [];
      const counts: Record<string, number> = {};
      const last: Record<string, string> = {};
      for (const msg of msgs) {
        counts[msg.conversation_id] = (counts[msg.conversation_id] ?? 0) + 1;
        if (last[msg.conversation_id] === undefined && msg.content) {
          last[msg.conversation_id] = msg.content.slice(0, 140);
        }
      }
      setMsgCount(counts);
      setLastMsg(last);
    }
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
            <MessageSquare size={16} className="text-violet-400" /> Conversations
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw size={14} />
          </Button>
        </div>
      </CardHeader>
      {loading ? (
        <p className="px-4 pb-4 text-sm text-gray-500">Loading…</p>
      ) : convs.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-gray-500">No conversations yet.</p>
      ) : (
        <div className="px-4 pb-4 space-y-2">
          {convs.map((c) => (
            <div key={c.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-white font-mono truncate">{c.id.slice(0, 8)}…</span>
                <span className="text-[10px] text-gray-600 shrink-0">
                  {msgCount[c.id] ?? 0} msgs · {new Date(c.updated_at).toLocaleString([], { month: "short", day: "numeric" })}
                </span>
              </div>
              {lastMsg[c.id] && <p className="text-xs text-gray-500 line-clamp-2">{lastMsg[c.id]}</p>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
