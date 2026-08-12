"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useNetworkStatus } from "@/lib/use-network-status";

/**
 * Connectivity banner. Shows a subtle pill when the device is offline and a
 * brief "Back online" confirmation after reconnecting. Works on web and in the
 * native app (the app's pages themselves work offline — only AI features need
 * the network).
 */
export function OfflineBanner() {
  const { online } = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const wasOffline = useRef(false);

  // Detect the offline → online transition and flash a confirmation.
  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setShowBackOnline(false);
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setShowBackOnline(true);
      const t = window.setTimeout(() => setShowBackOnline(false), 2500);
      return () => window.clearTimeout(t);
    }
  }, [online]);

  return (
    <AnimatePresence>
      {!online && !dismissed && (
        <motion.div
          key="offline"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 z-[65] flex justify-center pointer-events-none"
          style={{ paddingTop: "calc(var(--sat) + 4rem)" }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-medium shadow-lg shadow-black/10"
            role="status"
            aria-live="polite"
          >
            <WifiOff size={13} />
            Offline — pages still work, AI features need a connection
          </button>
        </motion.div>
      )}
      {online && showBackOnline && (
        <motion.div
          key="online"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 z-[65] flex justify-center pointer-events-none"
          style={{ paddingTop: "calc(var(--sat) + 4rem)" }}
        >
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-medium shadow-lg shadow-black/10">
            <Wifi size={13} />
            Back online
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
