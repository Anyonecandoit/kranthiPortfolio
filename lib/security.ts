"use client";

import { isNative, platformName } from "./platform";

/**
 * Security layer for the native app.
 *
 *  - Secure storage: Android Keystore-backed EncryptedSharedPreferences /
 *    iOS Keychain via @aparajita/capacitor-secure-storage, with a localStorage
 *    fallback on the web (never throws).
 *  - Biometric auth: Face ID / fingerprint via
 *    @aparajita/capacitor-biometric-auth (native only).
 *  - Device-compromise (root / jailbreak) detection: best-effort checks using
 *    the app-launcher plugin against known root/jailbreak apps.
 *
 * Certificate pinning is not available through web fetch; on Android it can be
 * layered with a network-security-config (see MOBILE_APP.md).
 */

/* ------------------------------------------------------------------ */
/* Secure storage                                                      */
/* ------------------------------------------------------------------ */

let secureAvailable: boolean | null = null;

/** True when the OS keystore-backed storage works on this device. */
export async function isSecureStorageAvailable(): Promise<boolean> {
  if (!isNative()) return false;
  if (secureAvailable !== null) return secureAvailable;
  try {
    const { SecureStorage } = await import(
      "@aparajita/capacitor-secure-storage"
    );
    // Probe with a round-trip so we don't silently fall back to localStorage.
    const probe = `probe-${Date.now()}`;
    await SecureStorage.setItem(probe, "1");
    const value = await SecureStorage.getItem(probe);
    await SecureStorage.removeItem(probe);
    secureAvailable = value === "1";
  } catch {
    secureAvailable = false;
  }
  return secureAvailable;
}

/** Store a value in the OS keystore-backed storage (web: localStorage). */
export async function secureSet(key: string, value: string): Promise<boolean> {
  if (await isSecureStorageAvailable()) {
    try {
      const { SecureStorage } = await import(
        "@aparajita/capacitor-secure-storage"
      );
      await SecureStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
  try {
    window.localStorage.setItem(`sec:${key}`, value);
    return true;
  } catch {
    return false;
  }
}

export async function secureGet(key: string): Promise<string | null> {
  if (await isSecureStorageAvailable()) {
    try {
      const { SecureStorage } = await import(
        "@aparajita/capacitor-secure-storage"
      );
      return await SecureStorage.getItem(key);
    } catch {
      return null;
    }
  }
  try {
    return window.localStorage.getItem(`sec:${key}`);
  } catch {
    return null;
  }
}

export async function secureRemove(key: string): Promise<boolean> {
  if (await isSecureStorageAvailable()) {
    try {
      const { SecureStorage } = await import(
        "@aparajita/capacitor-secure-storage"
      );
      await SecureStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
  try {
    window.localStorage.removeItem(`sec:${key}`);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Biometric auth                                                      */
/* ------------------------------------------------------------------ */

/** True when Face ID / fingerprint hardware + enrollment is available. */
export async function isBiometricsAvailable(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { BiometricAuth } = await import(
      "@aparajita/capacitor-biometric-auth"
    );
    const result = await BiometricAuth.checkBiometry();
    return result.isAvailable;
  } catch {
    return false;
  }
}

/**
 * Prompt the user for biometric verification. `authenticate()` rejects with a
 * BiometryError when cancelled or unsuccessful, so any non-throw is a pass.
 */
export async function authenticateWithBiometrics(
  reason = "Unlock Kranthi Kumar Katta"
): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { BiometricAuth } = await import(
      "@aparajita/capacitor-biometric-auth"
    );
    await BiometricAuth.authenticate({
      reason,
      cancelTitle: "Cancel",
      allowDeviceCredential: true,
    });
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Root / jailbreak detection (best-effort)                            */
/* ------------------------------------------------------------------ */

// Known root/jailbreak apps checked via the OS app launcher.
const ROOT_APP_SCHEMES: Record<string, string[]> = {
  android: [
    "com.topjohnwu.magisk",
    "eu.chainfire.supersu",
    "com.koushikdutta.superuser",
    "me.phh.superuser",
    "com.third.superuser",
  ],
  ios: ["cydia://", "sileo://", "zbra://", "filza://", "activator://"],
};

let compromiseChecked = false;
let compromiseResult = false;

/**
 * Best-effort root/jailbreak detection. Checks whether known root/jailbreak
 * apps are installed (device launchable). Never blocks the app — consumers
 * decide how to react. Cached after the first check.
 */
export async function isDeviceCompromised(): Promise<boolean> {
  if (!isNative()) return false;
  if (compromiseChecked) return compromiseResult;
  compromiseChecked = true;
  compromiseResult = false;

  try {
    const { AppLauncher } = await import("@capacitor/app-launcher");
    const schemes = ROOT_APP_SCHEMES[platformName()] ?? [];
    for (const scheme of schemes) {
      const { value } = await AppLauncher.canOpenUrl({ url: scheme });
      if (value) {
        compromiseResult = true;
        break;
      }
    }
  } catch {
    /* ignore */
  }
  return compromiseResult;
}
