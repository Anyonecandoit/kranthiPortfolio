import { getSupabase } from "@/lib/supabase";
import { getVisitorId, isReturningVisitor } from "@/lib/analytics";
import { apiUrl } from "@/lib/api";

/**
 * Real-time visitor analytics client.
 *
 * Lifecycle (started once per tab from the floating widget):
 *   1. On first load a session id is minted and kept in sessionStorage, so a
 *      page refresh reuses it — it never creates a new session or re-counts.
 *   2. A POST to /api/analytics/session creates the session server-side and
 *      attaches country/city from Vercel's geo headers, then counts the
 *      visitor once (idempotent, race-safe — see `record_visitor`).
 *   3. Heartbeats upsert last_seen every 20s, keeping the visitor "live".
 *      A visitor drops out of the live count 30s after their last heartbeat.
 *   4. Occasionally a client prunes session rows inactive for 30+ days.
 *
 * Everything is fire-and-forget: analytics must never throw or block the UI.
 */

/** How often a tab reports its presence (must stay under the 30s live window). */
export const HEARTBEAT_MS = 20_000;
/** How long a session counts as "live" after its last heartbeat. */
export const LIVE_WINDOW_MS = 30_000;
/** Chance a heartbeat also runs the storage-prune RPC (~1 per hour per tab). */
export const PRUNE_PROBABILITY = 0.01;

export interface VisitorStats {
  live: number;
  total: number;
  today: number;
}

const SESSION_KEY = "kranthi-visitor-session";

function getSessionId(): string | null {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Lightweight browser/device/OS detection — no extra dependency needed. */
export function detectClientInfo(): {
  browser: string;
  device: string;
  os: string;
} {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

  let os = "Unknown";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua)) browser = "Safari";
  else if (/Chrome\//.test(ua)) browser = "Chrome";

  let device = "Desktop";
  if (/iPad|Tablet/.test(ua)) device = "Tablet";
  else if (/Mobi|Android|iPhone|iPod/.test(ua)) device = "Mobile";

  return { browser, device, os };
}

/** Live/total/today stats for the widget (single RPC, ~5s cadence). */
export async function fetchVisitorStats(): Promise<VisitorStats | null> {
  try {
    const { data, error } = await getSupabase().rpc("get_visitor_stats");
    if (error || !data) return null;
    const s = data as unknown as VisitorStats;
    return {
      live: Number(s.live) || 0,
      total: Number(s.total) || 0,
      today: Number(s.today) || 0,
    };
  } catch {
    return null;
  }
}

/**
 * Start the tracking loop for this tab. Returns a cleanup function.
 * Safe to call multiple times (subsequent calls are no-ops until stopped).
 */
export function startVisitorTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const sessionId = getSessionId();
  const visitorId = getVisitorId();
  if (!sessionId || !visitorId) return () => {}; // storage blocked — skip tracking

  const { browser, device, os } = detectClientInfo();
  let stopped = false;

  /** Create the session server-side (captures geo headers) + count once. */
  const createSession = async () => {
    try {
      await fetch(apiUrl("/api/analytics/session"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorId,
          isReturning: isReturningVisitor(),
          browser,
          device,
          os,
          landingPage: window.location.pathname,
          referrer: document.referrer ? new URL(document.referrer).hostname : null,
          pagePath: window.location.pathname,
        }),
      });
    } catch {
      /* analytics must never throw */
    }
  };

  /** Refresh last_seen + current page so the visitor stays live. */
  const heartbeat = async () => {
    if (stopped) return;
    try {
      await getSupabase().rpc("upsert_visitor_session", {
        p_session_id: sessionId,
        p_visitor_id: visitorId,
        p_page_path: window.location.pathname,
      });
    } catch {
      /* analytics must never throw */
    }
    // Bounded history: a small fraction of heartbeats prunes stale rows.
    if (Math.random() < PRUNE_PROBABILITY) {
      try {
        await getSupabase().rpc("prune_visitor_sessions", { p_older_than_days: 30 });
      } catch {
        /* analytics must never throw */
      }
    }
  };

  void createSession();
  const interval = window.setInterval(heartbeat, HEARTBEAT_MS);

  return () => {
    stopped = true;
    window.clearInterval(interval);
  };
}
