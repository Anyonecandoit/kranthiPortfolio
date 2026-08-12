"use client";

import { isNative } from "./platform";

/**
 * Haptic feedback wrapper.
 *
 * On native (Capacitor) the platform haptics engine is used; on the web an
 * Android `navigator.vibrate` fallback provides light feedback where the
 * browser supports it, and everything else is a no-op. All calls are
 * fire-and-forget and never throw.
 */

function webVibrate(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

/** Light tap — button presses, list selections. */
export async function hapticTap(): Promise<void> {
  if (!isNative()) {
    webVibrate(8);
    return;
  }
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* ignore */
  }
}

/** Medium tap — the "selection" feel for menus/dropdowns. */
export async function hapticSelection(): Promise<void> {
  if (!isNative()) {
    webVibrate(12);
    return;
  }
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    /* ignore */
  }
}

/** Success confirmation — messages sent, items copied. */
export async function hapticSuccess(): Promise<void> {
  if (!isNative()) {
    webVibrate([10, 40, 10]);
    return;
  }
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    /* ignore */
  }
}

/** Error / warning notification. */
export async function hapticError(): Promise<void> {
  if (!isNative()) {
    webVibrate([20, 40, 20]);
    return;
  }
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Error });
  } catch {
    /* ignore */
  }
}
