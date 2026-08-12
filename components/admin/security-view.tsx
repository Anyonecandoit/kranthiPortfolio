"use client";

import { useCallback, useEffect, useState } from "react";
import { Shield, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { apiUrl } from "@/lib/api";
import { apiFetch } from "@/lib/offline";

interface StatusData {
  env: Record<string, boolean>;
  tables: string[];
  knowledgeChunks: number;
}

const ENV_LABELS: Record<string, string> = {
  openrouter: "OpenRouter API key",
  gemini: "Gemini API key",
  serviceRole: "Supabase service role key",
  projectRef: "Supabase project ref",
  appUrl: "Public app URL",
};

export function SecurityView() {
  const { user } = useAuth();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    try {
      const res = await apiFetch(apiUrl("/api/admin/status"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to load status");
      setStatus(body as StatusData);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" /> Security &amp; Config
        </CardTitle>
      </CardHeader>
      <div className="px-4 pb-4 space-y-5">
        <div>
          <p className="text-xs text-gray-400 mb-2">Signed in as</p>
          <p className="text-sm text-white">{user?.email ?? "—"}</p>
          {status && <p className="text-xs text-gray-500 mt-1">Knowledge base: {status.knowledgeChunks} chunks</p>}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Server configuration</p>
          <div className="space-y-1.5">
            {status ? (
              Object.entries(status.env).map(([key, ok]) => (
                <div key={key} className="flex items-center gap-2">
                  {ok ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    <XCircle size={14} className="text-amber-400" />
                  )}
                  <span className="text-xs text-gray-300">{ENV_LABELS[key] ?? key}</span>
                  <Badge variant={ok ? "success" : "warning"} className="ml-auto">{ok ? "configured" : "missing"}</Badge>
                </div>
              ))
            ) : error ? (
              <p className="text-xs text-amber-400">{error}</p>
            ) : (
              <p className="text-xs text-gray-500">Loading…</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Tables with RLS</p>
          <div className="flex flex-wrap gap-1.5">
            {(status?.tables ?? []).map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 mt-2">
            Row Level Security is enabled on all tables. Admin routes additionally verify the
            caller&apos;s role server-side with the Supabase access token.
          </p>
        </div>
      </div>
    </Card>
  );
}
