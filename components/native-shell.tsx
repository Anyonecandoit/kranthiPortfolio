"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isNative } from "@/lib/platform";
import { hapticTap } from "@/lib/haptics";
import { markAppReady } from "@/lib/perf";
import { useTheme } from "./theme-provider";

/**
 * Native app shell glue (no-op entirely on the web).
 *
 * Handles everything that only makes sense inside the Capacitor shell:
 *  - hides the native splash after first paint (no white flash)
 *  - keeps the status bar styled to match the active theme
 *  - Android hardware back button → history back, or exit confirmation at root
 *  - deep links (custom scheme / universal links) → internal route
 *  - app foreground/background events re-dispatched for other modules
 *  - subtle haptic feedback on button/link taps
 */
export function NativeShell() {
  const { theme } = useTheme();
  const router = useRouter();

  /* ------------------------------------------------------------
   * Splash screen — hide after the first paint, with a fallback timer.
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!isNative()) return;
    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      markAppReady();
      void import("@capacitor/splash-screen").then(({ SplashScreen }) =>
        SplashScreen.hide().catch(() => undefined)
      );
    };
    if (document.readyState === "complete") {
      requestAnimationFrame(() => requestAnimationFrame(hide));
    } else {
      window.addEventListener("load", () => requestAnimationFrame(hide), { once: true });
    }
    // Safety net: never trap the user on the splash screen.
    const fallback = window.setTimeout(hide, 4000);
    return () => window.clearTimeout(fallback);
  }, []);

  /* ------------------------------------------------------------
   * Status bar — overlay the webview and match the active theme.
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!isNative()) return;
    const apply = async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({
          style: theme === "dark" ? Style.Light : Style.Dark,
        });
        // Android only — iOS ignores backgroundColor.
        await StatusBar.setBackgroundColor({
          color: theme === "dark" ? "#171717" : "#f2f0ee",
        });
      } catch {
        /* ignore */
      }
    };
    void apply();
  }, [theme]);

  /* ------------------------------------------------------------
   * Global button-tap haptics (native only).
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!isNative()) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("button, a, [role='button'], input[type='submit']")) {
        void hapticTap();
      }
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  /* ------------------------------------------------------------
   * Android back button + app lifecycle + deep links.
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!isNative()) return;

    let backHandle: { remove: () => Promise<void> } | null = null;
    let urlHandle: { remove: () => Promise<void> } | null = null;
    let stateHandle: { remove: () => Promise<void> } | null = null;

    void import("@capacitor/app").then(async ({ App }) => {
      backHandle = await App.addListener("backButton", async ({ canGoBack }) => {
        const path = window.location.pathname;
        if (path !== "/" || canGoBack) {
          if (canGoBack) {
            window.history.back();
          } else {
            window.location.href = "/";
          }
          return;
        }
        try {
          const { Dialog } = await import("@capacitor/dialog");
          const { value } = await Dialog.confirm({
            title: "Exit app?",
            message: "Do you want to close the application?",
          });
          if (value) await App.exitApp();
        } catch {
          // Fallback: confirm() is still intercepted by some WebViews.
          if (window.confirm("Do you want to close the application?")) {
            await App.exitApp();
          }
        }
      });

      urlHandle = await App.addListener("appUrlOpen", (data) => {
        try {
          const url = new URL(data.url);
          const path = `${url.pathname}${url.search}${url.hash}`;
          if (path && path !== window.location.pathname) {
            router.push(path);
          }
        } catch {
          /* ignore malformed deep links */
        }
      });

      stateHandle = await App.addListener("appStateChange", ({ isActive }) => {
        window.dispatchEvent(
          new CustomEvent("app:state", { detail: { isActive } })
        );
      });
    });

    return () => {
      void backHandle?.remove();
      void urlHandle?.remove();
      void stateHandle?.remove();
    };
  }, [router]);

  return null;
}
