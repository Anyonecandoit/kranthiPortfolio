"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NavLiveStatus
 * Displays real-time Bangalore (IST) telemetry and live availability status in the navbar
 * giving the portfolio a tangible, real-world presence for recruiters and visitors.
 */
export function NavLiveStatus() {
  const [mounted, setMounted] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setTimeStr(formatter.format(now));
      } catch {
        setTimeStr("IST (UTC+5:30)");
      }
    };

    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    const msgInterval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % 4);
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(msgInterval);
    };
  }, []);

  const messages = [
    `SDET 2 • BANGALORE, IN • ${timeStr || "8:30 PM IST"}`,
    "🟢 AVAILABLE FOR SDET 2 ROLES",
    "⚡ 5+ YRS FINTECH & AUTOMATION",
    `BANGALORE, IN (UTC+5:30) • ${timeStr || "ONLINE"}`,
  ];

  return (
    <div
      className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-[#262C36] bg-[#12161E] ml-3 shadow-xs select-none hover:border-[var(--accent)] transition-colors"
      title={`Live Bangalore, India local time: ${timeStr} • Active & Available for SDET 2 roles`}
    >
      {/* Live Pulsing Ping Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      {/* Mini Activity Equalizer Bars — visual indicator of live telemetry */}
      <span className="flex items-end gap-[1.5px] h-2.5 shrink-0" aria-hidden="true">
        <motion.span
          animate={{ height: ["3px", "10px", "4px", "8px", "3px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="w-[2px] bg-emerald-500 rounded-full"
        />
        <motion.span
          animate={{ height: ["7px", "3px", "10px", "4px", "7px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          className="w-[2px] bg-emerald-500 rounded-full"
        />
        <motion.span
          animate={{ height: ["4px", "8px", "3px", "9px", "4px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="w-[2px] bg-emerald-500 rounded-full"
        />
      </span>

      {/* Animated Rotating Status Text with Live Bangalore Clock */}
      <div className="overflow-hidden min-w-[210px] h-[14px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={mounted ? msgIdx : "initial"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-mono text-[9px] uppercase tracking-wider text-zinc-300 font-semibold truncate block"
          >
            {mounted ? messages[msgIdx] : "SDET 2 • BANGALORE, IN"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
