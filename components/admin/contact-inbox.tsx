"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Check, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  listContactRequests,
  markContactRequestsSeen,
  type ContactRequest,
} from "@/lib/contact";

/** Admin inbox for contact / human-handoff requests. */
export function ContactInbox() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRequests(await listContactRequests(50));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markSeen = async (ids: string[]) => {
    try {
      await markContactRequestsSeen(ids);
      setRequests((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, status: "seen" } : r))
      );
    } catch {
      /* best-effort */
    }
  };

  const unseen = requests.filter((r) => r.status === "new");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Mail size={16} className="text-emerald-400" /> Contact Requests
            {unseen.length > 0 && <Badge variant="accent">{unseen.length} new</Badge>}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw size={14} />
          </Button>
        </div>
      </CardHeader>

      {error && <p className="px-4 pb-3 text-sm text-amber-400">{error}</p>}
      {loading && <p className="px-4 pb-4 text-sm text-gray-500">Loading…</p>}
      {!loading && requests.length === 0 && (
        <p className="px-4 pb-4 text-sm text-gray-500">No contact requests yet.</p>
      )}

      <div className="space-y-2 px-4 pb-4">
        {requests.map((r) => (
          <div
            key={r.id}
            className={`rounded-xl border p-3 ${
              r.status === "new"
                ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-white truncate">{r.name}</span>
                {r.email && <span className="text-xs text-gray-500 truncate">{r.email}</span>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={r.status === "new" ? "success" : "default"}>{r.status}</Badge>
                {r.status === "new" && (
                  <button
                    onClick={() => markSeen([r.id])}
                    className="text-gray-500 hover:text-emerald-400 transition-colors"
                    title="Mark seen"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            </div>
            {r.source && <p className="text-[10px] text-gray-600 mb-1">via {r.source}</p>}
            <p className="text-sm text-gray-300">{r.message}</p>
            <p className="text-[10px] text-gray-600 mt-1.5">
              {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
