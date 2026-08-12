"use client";

import { useEffect, useState } from "react";
import { isOnline, onNetworkChange, syncQueuedRequests } from "./offline";

/**
 * React binding for network status. Also triggers the offline retry queue
 * flush whenever the connection comes back, so queued requests sync
 * automatically.
 */
export function useNetworkStatus(): { online: boolean } {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const initial = await isOnline();
      if (mounted) setOnline(initial);
      unsubscribe = await onNetworkChange((isOnlineNow) => {
        if (!mounted) return;
        setOnline(isOnlineNow);
        if (isOnlineNow) syncQueuedRequests();
      });
    })();

    const onAppState = (e: Event) => {
      const active = (e as CustomEvent<{ isActive: boolean }>).detail?.isActive;
      if (active) syncQueuedRequests();
    };
    window.addEventListener("app:state", onAppState);

    return () => {
      mounted = false;
      unsubscribe?.();
      window.removeEventListener("app:state", onAppState);
    };
  }, []);

  return { online };
}
