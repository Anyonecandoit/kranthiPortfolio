import { getSupabase } from "@/lib/supabase";
import { isFirebaseAnalyticsConfigured } from "./analytics-firebase";

/**
 * Lightweight, best-effort analytics.
 *
 * Anonymous visitors log events to `analytics_events` — RLS allows anonymous
 * inserts (`Anyone can log events`) while only admins can read. All tracking is
 * fire-and-forget: it never throws and never blocks the UI. A persistent
 * `visitor_id` in localStorage lets us approximate unique visitors without auth.
 */

export type AnalyticsEventType =
  | "page_view"
  | "chat_message"
  | "chat_session"
  | "resume_download"
  | "agent_select"
  | "search"
  | "tool_use"
  | "lead_submit"
  | "jd_match"
  | "voice_start";

const STORAGE_KEY = "kranthi-visitor-id";
let _visitorId: string | null | undefined;

/**
 * True when a stable visitor id already existed in localStorage before this
 * page load (i.e. the browser has visited before). Used to flag returning
 * visitors on their sessions. Does not generate an id.
 */
export function isReturningVisitor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Stable per-browser visitor id (localStorage-backed). */
export function getVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  if (_visitorId !== undefined) return _visitorId;
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    _visitorId = id;
    return id;
  } catch {
    _visitorId = null;
    return null;
  }
}

/**
 * Record an analytics event. Safe to call from anywhere in the client.
 * @param event_type the event kind (see AnalyticsEventType)
 * @param metadata optional structured context stored in the jsonb column
 * @param page_path defaults to the current pathname
 */
export function trackEvent(
  event_type: AnalyticsEventType,
  metadata: Record<string, unknown> = {},
  page_path?: string,
): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const res = await getSupabase()
        .from("analytics_events")
        .insert({
          event_type,
          page_path: page_path ?? window.location.pathname,
          user_id: null,
          metadata: { ...metadata, visitor_id: getVisitorId() },
        });
      if (res.error) console.debug("[analytics] insert failed", res.error.message);
    } catch {
      /* analytics must never throw */
    }
  })();
  // Mirror to Firebase Analytics when configured (fire-and-forget).
  if (isFirebaseAnalyticsConfigured()) {
    void import("./analytics-firebase").then(({ firebaseLogEvent }) =>
      firebaseLogEvent(event_type, {
        ...metadata,
        page_path: page_path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
      })
    );
  }
}

/**
 * Record a client-side error (no-op on the server). Fires to both the
 * Supabase event table and Firebase Analytics ("app_error").
 */
export function trackError(
  context: string,
  message: string,
  metadata: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  void (async () => {
    try {
      const res = await getSupabase()
        .from("analytics_events")
        .insert({
          event_type: "app_error",
          page_path: window.location.pathname,
          user_id: null,
          metadata: {
            ...metadata,
            context,
            message: String(message).slice(0, 500),
            visitor_id: getVisitorId(),
          },
        });
      if (res.error) console.debug("[analytics] error insert failed", res.error.message);
    } catch {
      /* analytics must never throw */
    }
  })();
  if (isFirebaseAnalyticsConfigured()) {
    void import("./analytics-firebase").then(({ firebaseLogEvent }) =>
      firebaseLogEvent("app_error", { context, message: String(message).slice(0, 200), ...metadata })
    );
  }
}
