"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Brain } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type EventRow = Database["public"]["Tables"]["analytics_events"]["Row"];

interface UsageStat {
  label: string;
  count: number;
}

function toStats(counts: Record<string, number>): UsageStat[] {
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export function AIUsage() {
  const [byType, setByType] = useState<UsageStat[]>([]);
  const [byAgent, setByAgent] = useState<UsageStat[]>([]);
  const [byTool, setByTool] = useState<UsageStat[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("analytics_events")
      .select("event_type,metadata")
      .limit(3000);
    const events = (data as EventRow[]) ?? [];

    const types: Record<string, number> = {};
    const agents: Record<string, number> = {};
    const tools: Record<string, number> = {};
    for (const e of events) {
      types[e.event_type] = (types[e.event_type] ?? 0) + 1;
      const meta = (e.metadata ?? {}) as Record<string, unknown>;
      if (e.event_type === "agent_select" && typeof meta.agent === "string") {
        agents[meta.agent] = (agents[meta.agent] ?? 0) + 1;
      }
      if (e.event_type === "tool_use" && typeof meta.tool === "string") {
        tools[meta.tool] = (tools[meta.tool] ?? 0) + 1;
      }
    }
    setByType(toStats(types));
    setByAgent(toStats(agents));
    setByTool(toStats(tools));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const render = (title: string, stats: UsageStat[]) => (
    <div>
      <p className="text-xs text-[var(--text-secondary)] mb-2">{title}</p>
      {stats.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)]">No data yet.</p>
      ) : (
        <div className="space-y-1.5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary)] capitalize flex-1 truncate">{s.label}</span>
              <div className="h-1.5 flex-1 max-w-[60%] rounded-full bg-[var(--bg-card)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600"
                  style={{ width: `${Math.min(100, (s.count / (stats[0]?.count || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] w-8 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Brain size={16} className="text-fuchsia-400" /> AI Usage
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw size={14} />
          </Button>
        </div>
      </CardHeader>
      {loading ? (
        <p className="px-4 pb-4 text-sm text-[var(--text-secondary)]">Loading…</p>
      ) : (
        <div className="px-4 pb-4 space-y-5">
          {render("Events", byType)}
          {render("Agents selected", byAgent)}
          {render("Tools used", byTool)}
        </div>
      )}
    </Card>
  );
}
