"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Activity, Globe, CalendarDays, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/lib/settings";
import {
  fetchVisitorStats,
  startVisitorTracking,
  type VisitorStats,
} from "@/lib/visitor-analytics";

/** How often the widget refreshes live stats. */
const REFRESH_MS = 5_000;
const COLLAPSE_KEY = "kranthi-visitor-widget-collapsed";

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** A single animated stat row (Live / Total / Today). */
function StatRow({
  icon,
  label,
  value,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
        {pulse ? (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        ) : (
          icon
        )}
        {label}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value ?? "—"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="font-mono text-[13px] font-semibold tabular-nums text-[var(--text-primary)]"
        >
          {value === null ? "—" : formatNumber(value)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Floating real-time visitor widget (bottom-left). Shows Live / Total / Today
 * visitors, refreshes every 5s, and runs the session heartbeat loop for this
 * tab. Hidden entirely when analytics are disabled via the admin flag.
 */
export function VisitorWidget() {
  const { settings } = useSiteSettings();
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  const enabled = settings.track_analytics !== "false";

  // Restore collapse preference.
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  // Session heartbeat loop (once per tab; refresh-safe).
  useEffect(() => {
    if (!enabled) return;
    stopRef.current = startVisitorTracking();
    return () => stopRef.current?.();
  }, [enabled]);

  // Live stats polling — paused while the tab is hidden.
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let timer: number | undefined;

    const refresh = async () => {
      if (document.visibilityState === "hidden") return;
      const s = await fetchVisitorStats();
      if (active && s) setStats(s);
    };

    void refresh();
    timer = window.setInterval(refresh, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled]);

  if (!enabled) return null;

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none">
      <AnimatePresence mode="wait" initial={false}>
        {collapsed ? (
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            aria-label="Show visitor analytics"
            title="Show visitor analytics"
            className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md px-3.5 py-2 shadow-lg shadow-black/10 hover:shadow-xl transition-shadow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <Eye size={14} className="text-[var(--text-secondary)]" />
            <span className="font-mono text-xs font-semibold tabular-nums text-[var(--text-primary)]">
              {stats === null ? "—" : formatNumber(stats.live)}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-56 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md shadow-2xl shadow-black/15 overflow-hidden"
            role="status"
            aria-label="Visitor analytics"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[var(--text-secondary)]">
                <Eye size={13} className="text-[var(--accent)]" />
                Visitors
              </span>
              <button
                onClick={toggle}
                aria-label="Collapse widget"
                className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Stats */}
            <div className="px-3.5 pb-3 space-y-2">
              <StatRow
                icon={<Activity size={13} className="text-emerald-500" />}
                label="Live"
                value={stats?.live ?? null}
                pulse
              />
              <StatRow
                icon={<Globe size={13} className="text-sky-500" />}
                label="Total"
                value={stats?.total ?? null}
              />
              <StatRow
                icon={<CalendarDays size={13} className="text-[var(--accent)]" />}
                label="Today"
                value={stats?.today ?? null}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
