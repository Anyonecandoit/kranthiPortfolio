"use client";

/**
 * Firebase Analytics adapter (Firebase JS SDK).
 *
 * Works on the web AND inside the Capacitor WebView, and is only loaded when
 * the NEXT_PUBLIC_FIREBASE_* env vars are configured — otherwise every call is
 * a no-op and zero Firebase code is bundled.
 *
 * Native Crashlytics / Performance Monitoring / Remote Config need the native
 * Firebase SDKs and the google-services.json / GoogleService-Info.plist files
 * (see MOBILE_APP.md); this module covers the JS-available parts.
 */

// Type-only imports — erased at build time, no runtime/bundle cost.
import type { Analytics } from "firebase/analytics";
import type { RemoteConfig as FirebaseRemoteConfig } from "firebase/remote-config";

let analyticsInstance: Analytics | null | undefined;
let remoteConfigPromise: Promise<FirebaseRemoteConfig | null> | null = null;

interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  appId: string;
  messagingSenderId?: string;
  storageBucket?: string;
}

export function getFirebaseConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (!apiKey || !projectId || !appId) return null;
  return {
    apiKey,
    projectId,
    appId,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };
}

/** True when Firebase Analytics is configured via env vars. */
export function isFirebaseAnalyticsConfigured(): boolean {
  return getFirebaseConfig() !== null;
}

async function getAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance !== undefined) return analyticsInstance;
  analyticsInstance = null;
  const config = getFirebaseConfig();
  if (!config) return null;
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const app = getApps().length ? getApp() : initializeApp(config);
    const { getAnalytics: init, isSupported } = await import("firebase/analytics");
    if (!(await isSupported())) return null;
    analyticsInstance = init(app);
  } catch {
    analyticsInstance = null;
  }
  return analyticsInstance;
}

/** Fire a Firebase Analytics event (no-op unless configured). */
export async function firebaseLogEvent(
  name: string,
  params: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === "undefined") return;
  const analytics = await getAnalytics();
  if (!analytics) return;
  try {
    const { logEvent } = await import("firebase/analytics");
    logEvent(analytics, name, params as Record<string, unknown>);
  } catch {
    /* ignore */
  }
}

/**
 * Read a Remote Config value (cached 1 hour). Requires the standard Firebase
 * web config plus a project with remote config enabled.
 */
/** Lazily build the Remote Config handle (cached, activated once/hour). */
function getRemoteConfigHandle(): Promise<FirebaseRemoteConfig | null> {
  if (!remoteConfigPromise) {
    remoteConfigPromise = (async () => {
      const config = getFirebaseConfig();
      if (!config) return null;
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      const app = getApps().length ? getApp() : initializeApp(config);
      const rcMod = await import("firebase/remote-config");
      if (!(await rcMod.isSupported())) return null;
      const rc = rcMod.getRemoteConfig(app);
      const anyRc = rc as unknown as {
        settings: { minimumFetchIntervalMillis: number };
        defaultConfig: Record<string, string>;
      };
      anyRc.settings.minimumFetchIntervalMillis = 3_600_000; // 1 hour
      await rcMod.fetchAndActivate(rc).catch(() => undefined);
      return rc;
    })();
  }
  return remoteConfigPromise;
}

/** Read a Remote Config value (default when unconfigured/unreachable). */
export async function firebaseRemoteConfigValue<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  if (typeof window === "undefined") return defaultValue;
  if (!getFirebaseConfig()) return defaultValue;
  try {
    const rc = await getRemoteConfigHandle();
    if (!rc) return defaultValue;
    const anyRc = rc as unknown as { defaultConfig: Record<string, string> };
    anyRc.defaultConfig = {
      ...(anyRc.defaultConfig ?? {}),
      [key]: String(defaultValue),
    };
    const rcMod = await import("firebase/remote-config");
    const raw = rcMod.getValue(rc, key).asString();
    if (!raw || raw === String(defaultValue)) return defaultValue;
    if (typeof defaultValue === "boolean") return (raw === "true") as T;
    if (typeof defaultValue === "number") {
      const n = Number(raw);
      return (Number.isFinite(n) ? n : defaultValue) as T;
    }
    return raw as T;
  } catch {
    return defaultValue;
  }
}
