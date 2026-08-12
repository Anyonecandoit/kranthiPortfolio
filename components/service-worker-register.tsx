"use client";

import { useEffect } from "react";
import { isNative } from "@/lib/platform";

/**
 * Registers the production service worker (public/sw.js).
 *
 * Web/PWA only — inside the Capacitor shell the static export is bundled in
 * the app already and WebView service workers are unreliable, so it is
 * intentionally skipped there. Also skipped in development (HMR conflicts).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (isNative()) return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.debug("[sw] registration failed", err));
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
