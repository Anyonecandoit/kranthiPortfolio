"use client";

import { isNative } from "./platform";

/**
 * Native capability layer — a single typed surface over the Capacitor
 * plugins used by the app, with graceful web fallbacks. Every function is
 * safe to call anywhere (no-ops / falls back on the web) and never throws
 * for optional capabilities.
 *
 * Covered plugins: Camera, Filesystem, Share, Clipboard, Browser,
 * App Launcher, Local Notifications, Device, Preferences, Network.
 */

/* ------------------------------------------------------------------ */
/* Preferences (key-value storage — works on web too)                  */
/* ------------------------------------------------------------------ */

export async function prefsGet(key: string): Promise<string | null> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    return null;
  }
}

export async function prefsSet(key: string, value: string): Promise<void> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key, value });
  } catch {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }
}

export async function prefsRemove(key: string): Promise<void> {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.remove({ key });
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Camera & photo gallery                                              */
/* ------------------------------------------------------------------ */

export interface PickedImage {
  base64: string;
  mimeType: string;
  path: string | null;
  width?: number;
  height?: number;
}

/**
 * Take a photo with the device camera (native only). Returns base64 data or
 * null when cancelled / unsupported.
 */
export async function capturePhoto(): Promise<PickedImage | null> {
  if (!isNative()) return null;
  try {
    const { Camera, CameraResultType, CameraSource } = await import(
      "@capacitor/camera"
    );
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 80,
      correctOrientation: true,
    });
    if (!photo.base64String) return null;
    return {
      base64: photo.base64String,
      mimeType: photo.format === "jpeg" ? "image/jpeg" : "image/png",
      path: photo.path ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Pick one or more images from the device photo gallery (native only).
 */
export async function pickFromGallery(
  limit = 1
): Promise<PickedImage[]> {
  if (!isNative()) return [];
  try {
    const { Camera, CameraResultType, CameraSource } = await import(
      "@capacitor/camera"
    );
    const photos = await Camera.pickImages({
      limit,
    });
    const picked: PickedImage[] = [];
    for (const photo of photos.photos ?? []) {
      const data = await fetch(photo.webPath ?? "")
        .then((r) => r.blob())
        .catch(() => null);
      if (data) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(String(reader.result ?? "").split(",")[1] ?? "");
          reader.readAsDataURL(data);
        });
        picked.push({
          base64,
          mimeType: data.type || "image/jpeg",
          path: photo.path ?? null,
        });
      }
    }
    return picked;
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* File picker (works on native + web via a hidden <input type=file>)  */
/* ------------------------------------------------------------------ */

export interface PickedFile {
  name: string;
  mimeType: string;
  size: number;
  /** File object usable with FormData or FileReader. */
  file: File;
}

/** Open the OS file picker. Works everywhere (input[type=file]). */
export function pickFile(
  accept = "*/*",
  multiple = false
): Promise<PickedFile[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = "none";
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      resolve(
        files.map((f) => ({
          name: f.name,
          mimeType: f.type || "application/octet-stream",
          size: f.size,
          file: f,
        }))
      );
    };
    document.body.appendChild(input);
    input.click();
    window.setTimeout(() => input.remove(), 60_000);
  });
}

/* ------------------------------------------------------------------ */
/* Share                                                               */
/* ------------------------------------------------------------------ */

export async function shareContent(opts: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  if (!isNative()) {
    // Web Share API where available.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: opts.title,
          text: opts.text,
          url: opts.url,
        });
        return true;
      } catch {
        return false; // cancelled / unsupported
      }
    }
    return false;
  }
  try {
    const { Share } = await import("@capacitor/share");
    await Share.share({ title: opts.title, text: opts.text, url: opts.url });
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Clipboard                                                           */
/* ------------------------------------------------------------------ */

export async function copyText(text: string): Promise<boolean> {
  if (isNative()) {
    try {
      const { Clipboard } = await import("@capacitor/clipboard");
      await Clipboard.write({ string: text });
      return true;
    } catch {
      /* fall through to web clipboard */
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Browser (external links)                                            */
/* ------------------------------------------------------------------ */

/** Open a URL in the system browser (native) / new tab (web). */
export async function openExternal(url: string): Promise<boolean> {
  if (isNative()) {
    try {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url });
      return true;
    } catch {
      return false;
    }
  }
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* App Launcher (deep-link to other apps)                              */
/* ------------------------------------------------------------------ */

/** Check whether another app can handle the given URL scheme. */
export async function canOpenUrl(url: string): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { AppLauncher } = await import("@capacitor/app-launcher");
    const { value } = await AppLauncher.canOpenUrl({ url });
    return value;
  } catch {
    return false;
  }
}

/** Ask the OS to open a URL with its registered handler app. */
export async function openWithApp(url: string): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { AppLauncher } = await import("@capacitor/app-launcher");
    const { completed } = await AppLauncher.openUrl({ url });
    return completed;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Local notifications                                                 */
/* ------------------------------------------------------------------ */

export interface LocalNotifyOptions {
  title: string;
  body?: string;
  id?: number;
  scheduleAt?: Date;
  data?: Record<string, unknown>;
}

/** Schedule a local notification (native only). */
export async function scheduleLocalNotification(
  opts: LocalNotifyOptions
): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { LocalNotifications } = await import(
      "@capacitor/local-notifications"
    );
    const perm = await LocalNotifications.checkPermissions();
    let status = perm.display;
    if (status === "prompt") {
      const req = await LocalNotifications.requestPermissions();
      status = req.display;
    }
    if (status !== "granted") return false;
    await LocalNotifications.schedule({
      notifications: [
        {
          id: opts.id ?? Date.now(),
          title: opts.title,
          body: opts.body ?? "",
          schedule: opts.scheduleAt ? { at: opts.scheduleAt } : undefined,
          extra: opts.data,
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Device + app info                                                   */
/* ------------------------------------------------------------------ */

export interface DeviceSnapshot {
  platform: "android" | "ios" | "web";
  model?: string;
  os?: string;
  osVersion?: string;
  manufacturer?: string;
  appName?: string;
  appVersion?: string;
  appBuild?: string;
}

/** Lightweight device + app version info (best-effort). */
export async function getDeviceInfo(): Promise<DeviceSnapshot> {
  const snapshot: DeviceSnapshot = { platform: "web" };
  if (isNative()) {
    try {
      const { Device } = await import("@capacitor/device");
      const info = await Device.getInfo();
      snapshot.model = info.model;
      snapshot.manufacturer = info.manufacturer;
      snapshot.os = info.operatingSystem;
      snapshot.osVersion = info.osVersion;
    } catch {
      /* ignore */
    }
    try {
      const { App } = await import("@capacitor/app");
      const info = await App.getInfo();
      snapshot.appName = info.name;
      snapshot.appVersion = info.version;
      snapshot.appBuild = String(info.build);
    } catch {
      /* ignore */
    }
  }
  return snapshot;
}
