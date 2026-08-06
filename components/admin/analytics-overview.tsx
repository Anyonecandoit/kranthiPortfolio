"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Brain, FileText, Eye, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getSupabase } from "@/lib/supabase";

interface RecentEvent {
  id: string;
  event_type: string;
  page_path: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AnalyticsSnapshot {
  pageViews: number;
  uniqueVisitors: number;
  chatMessages: number;
  resumeDownloads: number;
  recent: RecentEvent[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Load live aggregates from `analytics_events` (admin-only via RLS). */
async function loadSnapshot(): Promise<AnalyticsSnapshot> {
  const db = getSupabase();

  const count = async (eventType: string) => {
    const { count } = await db
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", eventType);
    return count ?? 0;
  };

  const since = new Date(Date.now() - 30 * DAY_MS).toISOString();

  const [pageViews, chatMessages, resumeDownloads, visitorRows, recentRes] =
    await Promise.all([
      count("page_view"),
      count("chat_message"),
      count("resume_download"),
      db
        .from("analytics_events")
        .select("metadata")
        .eq("event_type", "page_view")
        .gte("created_at", since),
      db
        .from("analytics_events")
        .select("id, event_type, page_path, metadata, created_at")
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

  const uniqueVisitors = new Set(
    (visitorRows.data ?? [])
      .map((r) => (r.metadata as Record<string, unknown> | null)?.visitor_id)
      .filter((v): v is string => typeof v === "string"),
  ).size;

  return {
    pageViews,
    uniqueVisitors,
    chatMessages,
    resumeDownloads,
    recent: recentRes.data ?? [],
  };
}

/** Live visitor analytics for the admin dashboard. */
export function AnalyticsOverview() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setSnapshot(null);
    setError(false);
    try {
      setSnapshot(await loadSnapshot());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const stats = [
    {
      label: "Page Views",
      value: snapshot?.pageViews,
      icon: Eye,
      color: "text-violet-400",
    },
    {
      label: "Unique Visitors (30d)",
      value: snapshot?.uniqueVisitors,
      icon: Users,
      color: "text-emerald-400",
    },
    {
      label: "Chat Messages",
      value: snapshot?.chatMessages,
      icon: Brain,
      color: "text-sky-400",
    },
    {
      label: "Resume Downloads",
      value: snapshot?.resumeDownloads,
      icon: FileText,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                {snapshot === null ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-white">{stat.value ?? 0}</p>
                )}
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="ml-auto text-xs text-violet-400 hover:text-violet-300"
          >
            Refresh
          </button>
        </CardHeader>
        {error ? (
          <p className="text-amber-400 text-sm px-1 pb-2">
            Could not load analytics — check that analytics events exist and you
            are signed in as admin.
          </p>
        ) : snapshot === null ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ) : snapshot.recent.length === 0 ? (
          <EmptyState
            icon={<Activity size={32} />}
            title="No analytics yet"
            description="Visitor page views, chat messages, and resume downloads will appear here as people use the site."
          />
        ) : (
          <ul className="space-y-2">
            {snapshot.recent.map((ev) => (
              <li
                key={ev.id}
                className="flex items-center gap-3 text-sm rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2"
              >
                <Badge variant="default">{ev.event_type}</Badge>
                <span className="text-gray-300 flex-1 truncate">{ev.page_path ?? "—"}</span>
                <span className="text-xs text-gray-500">
                  {new Date(ev.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
