#!/usr/bin/env bash
#
# Build the Capacitor mobile app from the Next.js static export.
#
# The web app's server-only pieces (app/api route handlers + the Supabase auth
# callback) cannot exist in a static export, so they are moved aside for the
# build and restored afterwards. In the app, every client-side fetch is routed
# to the deployed backend via NEXT_PUBLIC_API_URL (see lib/api.ts).
#
# Prerequisites:
#   - `npm run build:app`  — static export + capacitor sync (this script)
#   - `npm run cap:open:android` / `npm run cap:open:ios` — open the native IDE
#
# To point the app at a different backend (e.g. localhost during development):
#   NEXT_PUBLIC_API_URL=http://192.168.x.x:3000 npm run build:app
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

API_DIR="$ROOT/app/api"
AUTH_CB_DIR="$ROOT/app/auth/callback"
BAK_DIR="$ROOT/.mobile-build"
API_BAK="$BAK_DIR/api.bak"
AUTH_BAK="$BAK_DIR/auth-callback.bak"

restore() {
  if [ -d "$API_BAK" ]; then
    mv "$API_BAK" "$API_DIR"
    echo "  restored app/api"
  fi
  if [ -d "$AUTH_BAK" ]; then
    mv "$AUTH_BAK" "$AUTH_CB_DIR"
    echo "  restored app/auth/callback"
  fi
  rmdir "$BAK_DIR" 2>/dev/null || true
}

# Idempotent: recover from an interrupted previous run before doing anything.
if [ -d "$API_BAK" ] || [ -d "$AUTH_BAK" ]; then
  echo "[build-mobile] Found leftovers from an interrupted run — restoring…"
  restore
fi

trap restore EXIT

# 1. Move the server-only route handlers aside (static export can't include them).
mkdir -p "$BAK_DIR"
if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$API_BAK"
  echo "[build-mobile] app/api moved aside"
fi
if [ -d "$AUTH_CB_DIR" ]; then
  mv "$AUTH_CB_DIR" "$AUTH_BAK"
  echo "[build-mobile] app/auth/callback moved aside"
fi

# 2. Static export + Capacitor sync.
API_BASE="${NEXT_PUBLIC_API_URL:-https://www.kranthikumarkatta.in}"
echo "[build-mobile] Building static export (API base: $API_BASE)…"
MOBILE_BUILD=1 NEXT_PUBLIC_API_URL="$API_BASE" npm run build
echo "[build-mobile] Syncing web assets to native projects…"
npx cap sync

# 3. restore() runs on EXIT and puts the API routes back.
echo "[build-mobile] Done. Open the app with: npm run cap:open:android  (or :ios)"
