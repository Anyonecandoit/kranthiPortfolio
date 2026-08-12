"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initPushNotifications } from "@/lib/push";

/**
 * Bootstraps Firebase push notifications inside the native app.
 * Renders nothing. On web this component is inert.
 */
export function PushService() {
  const router = useRouter();

  useEffect(() => {
    void initPushNotifications();
  }, []);

  // Notification tap → route to the deep link target if provided.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ url?: string }>).detail;
      if (detail?.url) router.push(detail.url);
    };
    window.addEventListener("push:open", onOpen);
    return () => window.removeEventListener("push:open", onOpen);
  }, [router]);

  return null;
}
