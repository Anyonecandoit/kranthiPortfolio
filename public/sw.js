/* Kranthi Portfolio — production service worker (web/PWA only). */
const CACHE_VERSION = "kranthi-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

/* Precached shell — the offline homepage + icons + manifest. */
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.webp",
  "/icons/icon-512.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never cache API calls — the app's JS layer handles offline retries.
  if (req.method !== "GET" || url.pathname.startsWith("/api/")) return;

  // Navigations: always try the network (fresh HTML for SEO), fall back to the
  // cached offline homepage when unreachable.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches
            .open(PAGE_CACHE)
            .then((cache) => cache.put("/", copy))
            .catch(() => undefined);
          return res;
        })
        .catch(() =>
          caches.match("/").then((cached) => {
            if (cached) return cached;
            // Last resort: respond with the precached homepage HTML.
            return caches.open(STATIC_CACHE).then((cache) =>
              cache.match("/").then((shell) => shell ?? Response.error())
            );
          })
        )
    );
    return;
  }

  // Same-origin static assets (hashed JS/CSS, fonts, images): stale-while-
  // revalidate — cached copies are safe because filenames are content-hashed.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches
                .open(STATIC_CACHE)
                .then((cache) => cache.put(req, copy))
                .catch(() => undefined);
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Cross-origin (opaque) requests — cache best-effort, network-first.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches
              .open(STATIC_CACHE)
              .then((cache) => cache.put(req, copy))
              .catch(() => undefined);
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
