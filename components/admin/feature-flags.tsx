"use client";

import { Settings } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_SETTINGS, useSiteSettings, setSiteSetting } from "@/lib/settings";
import { cn } from "@/lib/utils";

const FLAG_INFO: Record<string, { label: string; desc: string }> = {
  show_ai_chat: { label: "AI chat widget", desc: "Show the floating AI assistant on every page." },
  show_ai_tools: { label: "AI Tools library", desc: "Enable the /tools page and tool search entries." },
  track_analytics: { label: "Visitor analytics", desc: "Log page views and interaction events." },
  maintenance_mode: { label: "Maintenance mode", desc: "Flag available for a maintenance notice." },
};

export function FeatureFlags() {
  const { settings, refresh } = useSiteSettings();

  const toggle = async (key: string) => {
    const next = settings[key] === "true" ? "false" : "true";
    try {
      await setSiteSetting(key, next);
      await refresh();
    } catch {
      /* RLS will reject non-admins — ignored */
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={16} className="text-amber-400" /> Feature Flags
        </CardTitle>
      </CardHeader>
      <div className="px-4 pb-4 space-y-3">
        {Object.keys(DEFAULT_SETTINGS).map((key) => {
          const info = FLAG_INFO[key] ?? { label: key, desc: "" };
          const on = settings[key] !== "false";
          return (
            <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{info.label}</p>
                <p className="text-xs text-[var(--text-secondary)]">{info.desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                role="switch"
                aria-checked={on}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  on ? "bg-emerald-500" : "bg-[var(--bg-card)]"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
                    on ? "left-[22px]" : "left-0.5"
                  )}
                />
              </button>
            </div>
          );
        })}
        <p className="text-[10px] text-[var(--text-secondary)]">
          Changes apply site-wide immediately. Writes are admin-only (enforced by RLS).
        </p>
      </div>
    </Card>
  );
}
