/**
 * API base URL helper.
 *
 * On the web the site is served same-origin, so relative `/api/...` calls
 * just work and API_BASE is "".
 *
 * In the Capacitor mobile app the site is bundled as a static export, so the
 * server-side API routes are not present inside the app. The mobile build sets
 * NEXT_PUBLIC_API_URL (see scripts/build-mobile.sh) and every fetch must go to
 * the deployed backend instead. The deployed API routes send CORS headers
 * (see next.config.js) so the app's WebView origin is allowed to call them.
 */
export const API_BASE: string = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Prefix a relative API path with the configured base URL. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
