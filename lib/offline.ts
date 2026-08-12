"use client";

import { isNative } from "./platform";

/**
 * Offline support layer.
 *
 * Two parts:
 *  1. Network status detection — @capacitor/network on native, browser
 *     online/offline events on the web.
 *  2. A persistent retry queue — mutating API calls made while offline (or
 *     that fail with a transient network error) are stored and replayed when
 *     the connection returns, so analytics and other fire-and-forget events
 *     are never silently dropped.
 *
 * The bundled static export already makes every page of the app available
 * offline; this layer covers the API side.
 */

export const OFFLINE_MESSAGE =
  "You're offline. Check your connection and try again.";

const QUEUE_KEY = "kranthi-offline-queue";

interface QueuedRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  queuedAt: number;
}

/* ------------------------------------------------------------------ */
/* Network status                                                      */
/* ------------------------------------------------------------------ */

export async function isOnline(): Promise<boolean> {
  if (isNative()) {
    try {
      const { Network } = await import("@capacitor/network");
      const status = await Network.getStatus();
      if (typeof status.connected === "boolean") return status.connected;
    } catch {
      /* fall through to navigator.onLine */
    }
  }
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

/** Subscribe to connectivity changes. Returns an unsubscribe function. */
export async function onNetworkChange(
  cb: (online: boolean) => void
): Promise<() => void> {
  const cleanups: Array<() => void> = [];

  if (isNative()) {
    try {
      const { Network } = await import("@capacitor/network");
      const handle = await Network.addListener("networkStatusChange", (s) => {
        cb(s.connected);
      });
      cleanups.push(() => void handle.remove());
    } catch {
      /* fall through to browser events */
    }
  }

  if (typeof window !== "undefined") {
    const online = () => cb(true);
    const offline = () => cb(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    cleanups.push(() => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* Retry queue                                                         */
/* ------------------------------------------------------------------ */

function readQueue(): QueuedRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedRequest[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    // Cap the queue so it can't grow unbounded (e.g. long offline periods).
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-50)));
  } catch {
    /* storage full/blocked — drop */
  }
}

/** Store a failed request for replay when connectivity returns. */
export function enqueueRequest(
  path: string,
  init: RequestInit = {}
): void {
  const headers: Record<string, string> = {};
  if (init.headers instanceof Headers) {
    init.headers.forEach((v, k) => (headers[k] = v));
  } else if (Array.isArray(init.headers)) {
    for (const [k, v] of init.headers) headers[k] = v;
  } else if (init.headers && typeof init.headers === "object") {
    Object.assign(headers, init.headers);
  }
  const body =
    typeof init.body === "string"
      ? init.body
      : init.body instanceof URLSearchParams
        ? init.body.toString()
        : undefined;
  writeQueue([
    ...readQueue(),
    {
      path,
      method: (init.method ?? "POST").toUpperCase(),
      headers,
      body,
      queuedAt: Date.now(),
    },
  ]);
}

async function flushQueue(): Promise<void> {
  const queue = readQueue();
  if (!queue.length) return;
  const remaining: QueuedRequest[] = [];
  for (const req of queue) {
    try {
      const res = await fetch(req.path, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
      // 2xx (or the server replying 202 "queued") → drop from queue.
      if (res.ok || res.status === 202) continue;
      // Non-transient client error — retrying won't help; drop.
      if (res.status >= 400 && res.status < 500) continue;
      remaining.push(req); // 5xx — keep for the next attempt
    } catch {
      remaining.push(req); // still offline / transient — retry later
      break; // don't hammer a dead connection
    }
  }
  writeQueue(remaining);
}

let flushTimer: number | undefined;

/** Replay queued requests now (and schedule periodic retries while online). */
export function syncQueuedRequests(): void {
  if (typeof window === "undefined") return;
  if (flushTimer) window.clearInterval(flushTimer);
  void flushQueue();
  flushTimer = window.setInterval(() => void flushQueue(), 60_000);
}

/**
 * fetch() replacement used by the API layer.
 *
 *  - offline + queueWhenOffline → enqueue and resolve with a 202 so callers
 *    can show "queued" messaging without breaking their flow
 *  - offline (interactive) → reject with a friendly offline error
 *  - transient network failure on a queued request → enqueue + 202
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
  opts: { queueWhenOffline?: boolean } = {}
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const mutating = method !== "GET" && method !== "HEAD";

  if (!(await isOnline())) {
    if (opts.queueWhenOffline && mutating) {
      enqueueRequest(path, init);
      return new Response(JSON.stringify({ queued: true }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw new Error(OFFLINE_MESSAGE);
  }

  try {
    const res = await fetch(path, init);
    if (
      !res.ok &&
      res.status >= 500 &&
      opts.queueWhenOffline &&
      mutating
    ) {
      enqueueRequest(path, init);
    }
    return res;
  } catch (e) {
    if (opts.queueWhenOffline && mutating) {
      enqueueRequest(path, init);
      return new Response(JSON.stringify({ queued: true }), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw e;
  }
}
