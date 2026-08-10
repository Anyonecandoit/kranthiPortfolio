"use client";

import { useEffect, useState } from "react";
import { fetchVisitorStats } from "@/lib/visitor-analytics";
import { useSiteSettings } from "@/lib/settings";

/** How often the navbar counter refreshes the live count. */
const REFRESH_MS = 10_000;

/**
 * Live visitor count shown next to SIGN IN in the navbar.
 * Polls the same RPC as the floating widget; hidden when analytics are
 * disabled via the admin flag.
 */
export function NavVisitorCount() {
  const { settings } = useSiteSettings();
  const [live, setLive] = useState<number | null>(null);

  const enabled = settings.track_analytics !== "false";

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    const refresh = async () => {
      const s = await fetchVisitorStats();
      if (active && s) setLive(s.live);
    };

    void refresh();
    const timer = window.setInterval(refresh, REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [enabled]);

  if (!enabled || live === null) return null;

  return (
    <span
      className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-[var(--border-color)] bg-[var(--bg-card)]/80 px-2.5 py-1.5"
      title="Live visitors right now"
      aria-label={`${live} visitors live right now`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-mono text-xs font-bold tabular-nums text-[var(--text-primary)]">
        {live.toLocaleString("en-US")}
      </span>
    </span>
  );
}
