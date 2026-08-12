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
APK_DIR="$ROOT/public/apk"
BAK_DIR="$ROOT/.mobile-build"
API_BAK="$BAK_DIR/api.bak"
AUTH_BAK="$BAK_DIR/auth-callback.bak"
APK_BAK="$BAK_DIR/apk.bin"

restore() {
  if [ -d "$API_BAK" ]; then
    mv "$API_BAK" "$API_DIR"
    echo "  restored app/api"
  fi
  if [ -d "$AUTH_BAK" ]; then
    mv "$AUTH_BAK" "$AUTH_CB_DIR"
    echo "  restored app/auth/callback"
  fi
  if [ -f "$APK_BAK" ]; then
    mv "$APK_BAK" "$APK_DIR/kranthi-portfolio.apk"
    echo "  restored public/apk/kranthi-portfolio.apk"
  fi
  rmdir "$BAK_DIR" 2>/dev/null || true
}

# Idempotent: recover from an interrupted previous run before doing anything.
if [ -d "$API_BAK" ] || [ -d "$AUTH_BAK" ] || [ -f "$APK_BAK" ]; then
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

# The previous APK must not be in public/ during the export — next build copies
# public/ into out/, which would nest the old APK inside the new one (each build
# would double the app size). It's stashed here and restored on exit; npm run
# copy:apk then overwrites it with the freshly built binary.
if [ -f "$APK_DIR/kranthi-portfolio.apk" ]; then
  mv "$APK_DIR/kranthi-portfolio.apk" "$APK_BAK"
  echo "[build-mobile] previous APK stashed out of the export"
fi

# 2. Static export + Capacitor sync.
#
# Push notifications (FCM) only work when the native Firebase config exists
# (android/app/google-services.json). Calling PushNotifications.register()
# without it throws natively and kills the app process, so the JS push flow is
# gated on NEXT_PUBLIC_PUSH_ENABLED, set here based on what's on disk.
API_BASE="${NEXT_PUBLIC_API_URL:-https://www.kranthikumarkatta.in}"
PUSH_ENABLED=0
if [ -f "$ROOT/android/app/google-services.json" ]; then
  PUSH_ENABLED=1
fi
echo "[build-mobile] Building static export (API base: $API_BASE, push enabled: $PUSH_ENABLED)…"
MOBILE_BUILD=1 NEXT_PUBLIC_API_URL="$API_BASE" NEXT_PUBLIC_PUSH_ENABLED="$PUSH_ENABLED" npm run build
echo "[build-mobile] Syncing web assets to native projects…"
npx cap sync

# 3. restore() runs on EXIT and puts the API routes back.
echo "[build-mobile] Done. Open the app with: npm run cap:open:android  (or :ios)"
