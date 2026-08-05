"use client";

import { useEffect } from "react";

/**
 * Emergency restore: ensures body overflow is never locked after navigation.
 * Runs once on mount to clean up any stale overflow from a previous session.
 */
export function ChatPageGuard() {
  useEffect(() => {
    // Safety: always ensure body is scrollable when this component mounts
    // This catches any stale overflow:hidden from a previous /chat visit
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  return null;
}
