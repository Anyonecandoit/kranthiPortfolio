"use client";

import { useEffect } from "react";
import { isNative } from "@/lib/platform";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

/**
 * Native security enforcement (inert on the web):
 *  - checks for root/jailbreak indicators at startup and reports the result
 *    via a "security:compromised" window event
 *  - when the user enabled "biometric unlock", re-verifies their identity with
 *    Face ID / fingerprint every time the app returns to the foreground, and
 *    signs them out if verification fails
 */
export function SecurityManager() {
  const { user } = useAuth();

  // Root / jailbreak check at startup (best-effort, never blocks).
  useEffect(() => {
    if (!isNative()) return;
    void import("@/lib/security").then(async ({ isDeviceCompromised }) => {
      const compromised = await isDeviceCompromised();
      if (compromised) {
        console.warn("[security] device appears to be rooted/jailbroken");
        window.dispatchEvent(new CustomEvent("security:compromised"));
      }
    });
  }, []);

  // Biometric re-auth on app foreground.
  useEffect(() => {
    if (!isNative()) return;
    const onAppState = async (e: Event) => {
      const active = (e as CustomEvent<{ isActive: boolean }>).detail?.isActive;
      if (!active) return;

      const { secureGet, authenticateWithBiometrics } = await import(
        "@/lib/security"
      );
      const enabled = await secureGet("kranthi-biometric-unlock");
      if (enabled !== "1") return;

      // Nothing to protect if nobody is signed in.
      if (!user) return;

      const ok = await authenticateWithBiometrics(
        "Unlock Kranthi Kumar Katta"
      );
      if (!ok) {
        window.dispatchEvent(new CustomEvent("auth:timeout"));
        void supabase.auth.signOut();
      }
    };
    window.addEventListener("app:state", onAppState);
    return () => window.removeEventListener("app:state", onAppState);
  }, [user]);

  return null;
}
