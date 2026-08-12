"use client";

import { isNative, platformName } from "./platform";
import { apiUrl } from "./api";

/**
 * Firebase Cloud Messaging (via @capacitor/push-notifications) client service.
 *
 * No-op on the web and inside unsupported WebViews. On native it:
 *  - requests notification permission (Android 13+ / iOS)
 *  - registers the device token with FCM and re-registers on token refresh
 *  - syncs the token to the backend (app/api/notifications/register)
 *  - dispatches window events for foreground messages and taps:
 *      "push:message"  { data, title, body }
 *      "push:open"     { data, url? }
 *      "push:token"    { token }
 *
 * Firebase itself is configured through the native files (google-services.json
 * for Android, GoogleService-Info.plist for iOS) — see MOBILE_APP.md.
 */

export interface PushPayload {
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  url?: string;
}

const TOKEN_KEY = "kranthi-push-registered";

/** True once this device already registered a token this install. */
export function isPushRegistered(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(TOKEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Sync the FCM token + platform to the deployed backend (best-effort). */
export async function registerDeviceWithBackend(
  token: string,
  topics: string[] = []
): Promise<void> {
  try {
    const res = await fetch(apiUrl("/api/notifications/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, platform: platformName(), topics }),
    });
    if (!res.ok) {
      console.warn("[push] backend register failed", res.status);
      return;
    }
    try {
      window.localStorage.setItem(TOKEN_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("push:token", { detail: { token } }));
  } catch {
    /* offline / backend down — retry on next app start */
  }
}

/**
 * Subscribe/unsubscribe this device to a topic.
 *
 * Capacitor 8 removed the native FCM topic API, so topics are tracked on the
 * backend: each device token stores its topics (see /api/notifications/register)
 * and the server targets devices by topic directly.
 */
export async function setTopicSubscription(
  topic: string,
  subscribe: boolean
): Promise<void> {
  let topics: string[] = [];
  try {
    topics = JSON.parse(window.localStorage.getItem("kranthi-push-topics") ?? "[]");
  } catch {
    /* ignore */
  }
  topics = subscribe
    ? Array.from(new Set([...topics, topic]))
    : topics.filter((t) => t !== topic);
  try {
    window.localStorage.setItem("kranthi-push-topics", JSON.stringify(topics));
  } catch {
    /* ignore */
  }
  // Push the updated topic list to the backend on the next registration. If we
  // already have a token, sync immediately.
  const token = window.localStorage.getItem("kranthi-push-token") ?? "";
  if (token) await registerDeviceWithBackend(token, topics);
}

/**
 * Wire up FCM listeners and request permission + register.
 * Safe to call more than once (listeners are deduped by a module flag).
 */
export async function initPushNotifications(): Promise<void> {
  if (!isNative()) return;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    await PushNotifications.addListener("registration", ({ value: token }) => {
      try {
        window.localStorage.setItem("kranthi-push-token", token);
      } catch {
        /* ignore */
      }
      let topics: string[] = [];
      try {
        topics = JSON.parse(window.localStorage.getItem("kranthi-push-topics") ?? "[]");
      } catch {
        /* ignore */
      }
      void registerDeviceWithBackend(token, topics);
    });

    await PushNotifications.addListener("registrationError", ({ error }) => {
      console.warn("[push] registration error", error);
      window.dispatchEvent(new CustomEvent("push:error", { detail: { error } }));
    });

    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        const payload: PushPayload = {
          title: notification.title,
          body: notification.body,
          data: notification.data as Record<string, unknown>,
        };
        window.dispatchEvent(
          new CustomEvent("push:message", { detail: payload })
        );
      }
    );

    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (res) => {
        const data = (res.notification.data ?? {}) as Record<string, unknown>;
        const payload: PushPayload = {
          title: res.notification.title,
          body: res.notification.body,
          data,
          url: typeof data.url === "string" ? data.url : undefined,
        };
        window.dispatchEvent(new CustomEvent("push:open", { detail: payload }));
      }
    );

    // Permission flow — Android 13+ shows the system dialog here.
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === "prompt") {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive !== "granted") return;

    await PushNotifications.register();
  } catch (e) {
    console.warn("[push] unavailable", e);
  }
}
