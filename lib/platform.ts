import { Capacitor } from "@capacitor/core";

/**
 * True when running inside the Capacitor native shell (Android/iOS).
 * Safe to call on the server — Capacitor.isNativePlatform() is false there.
 */
export function isNative(): boolean {
  return typeof Capacitor !== "undefined" && Capacitor.isNativePlatform();
}

/** True when running as a regular web app (including on mobile browsers). */
export function isWeb(): boolean {
  return !isNative();
}

/** Convenience: the active native platform, or "web". */
export function platformName(): "android" | "ios" | "web" {
  if (!isNative()) return "web";
  return Capacitor.getPlatform() === "ios" ? "ios" : "android";
}
