"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { useSiteSettings } from "@/lib/settings";

/**
 * Fires a `page_view` analytics event on every route change.
 * Mounted once in the root layout; renders nothing.
 * Respects the `track_analytics` site flag (admin-controlled).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const mounted = useRef(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings.track_analytics === "false") return;
    // Skip the very first render's pre-hydration pathname; track from here on.
    if (mounted.current) {
      trackEvent("page_view", {}, pathname);
    } else {
      mounted.current = true;
    }
  }, [pathname, settings.track_analytics]);

  return null;
}
