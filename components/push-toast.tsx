"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import type { PushPayload } from "@/lib/push";

/**
 * Foreground push notification banner. Push messages that arrive while the app
 * is open are shown here instead of the system tray. Clicking the banner
 * dispatches "push:open" (navigated by PushService). Inert on web.
 */
export function PushToast() {
  const [toast, setToast] = useState<(PushPayload & { id: number }) | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const onMessage = (e: Event) => {
      const payload = (e as CustomEvent<PushPayload>).detail;
      if (!payload?.title && !payload?.body) return;
      setToast({ ...payload, id: Date.now() });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setToast(null), 5000);
    };
    window.addEventListener("push:message", onMessage);
    return () => {
      window.removeEventListener("push:message", onMessage);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.button
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            window.dispatchEvent(new CustomEvent("push:open", { detail: toast }));
            setToast(null);
          }}
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[70] text-left rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl shadow-black/20 p-4 flex items-start gap-3"
          role="status"
          aria-live="polite"
        >
          <span className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center">
            <Bell size={16} />
          </span>
          <span className="min-w-0">
            {toast.title && (
              <span className="block text-sm font-semibold text-[var(--text-primary)] truncate">
                {toast.title}
              </span>
            )}
            {toast.body && (
              <span className="block text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                {toast.body}
              </span>
            )}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
