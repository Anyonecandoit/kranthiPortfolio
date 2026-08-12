"use client";

import { useEffect } from "react";

/**
 * Captures uncaught errors and unhandled promise rejections and reports them
 * through the analytics pipeline (Supabase + Firebase when configured).
 * Deliberately quiet — never blocks or interferes with the app.
 */
export function ErrorTracker() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      if (e?.error) {
        void import("@/lib/analytics").then(({ trackError }) =>
          trackError("window_error", e.error.message || e.message, {
            source: e.filename,
            line: e.lineno,
          })
        );
      }
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason =
        e.reason instanceof Error ? e.reason.message : String(e.reason);
      void import("@/lib/analytics").then(({ trackError }) =>
        trackError("unhandled_rejection", reason)
      );
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
