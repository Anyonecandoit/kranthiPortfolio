#!/usr/bin/env bash
#
# Copies the latest built Android debug APK into public/apk/ so the website's
# "GET APK" button can serve it at /apk/kranthi-portfolio.apk.
#
#   npm run copy:apk                # debug build (default)
#   npm run copy:apk -- --release   # signed release APK if present
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VARIANT="debug"
if [[ "${1:-}" == "--release" ]]; then VARIANT="release"; fi

SRC="$ROOT/android/app/build/outputs/apk/$VARIANT/app-$VARIANT.apk"
DEST_DIR="$ROOT/public/apk"
DEST="$DEST_DIR/kranthi-portfolio.apk"

if [[ ! -f "$SRC" ]]; then
  echo "✗ APK not found at: $SRC"
  echo "  Build it first (requires Android Studio / Android SDK):"
  echo "    cd android && ./gradlew assembleDebug"
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SRC" "$DEST"
echo "✓ Copied $(du -h "$SRC" | cut -f1) → $DEST"
echo "  Commit it and deploy so the website can serve the download."
