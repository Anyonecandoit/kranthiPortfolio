"use client";

import { isNative } from "./platform";

/**
 * Cold-start instrumentation. Records the time from native app launch to the
 * moment the webview has painted (when the splash is hidden) and surfaces it
 * for debugging/analytics. The target is < 2 s cold start; the measurement is
 * read via `window.__KRANTHI_COLD_START_MS` or the console.
 */

let marked = false;

/** Call once when the app is considered "ready" (first paint). */
export function markAppReady(): void {
  if (marked) return;
  marked = true;
  const elapsed = Math.round(performance.now());
  try {
    (window as unknown as Record<string, unknown>).__KRANTHI_COLD_START_MS =
      elapsed;
  } catch {
    /* ignore */
  }
  if (isNative()) {
    console.info(`[perf] cold start to first paint: ${elapsed}ms`);
    // Report to analytics (fire-and-forget; no-op when Supabase unavailable).
    void import("./analytics").then(({ trackEvent }) =>
      trackEvent("tool_use", { tool: "cold_start_ms", value: elapsed })
    );
  }
}
