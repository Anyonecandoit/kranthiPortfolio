"use client";

import { useEffect, useRef, useState } from "react";
import { isNative } from "@/lib/platform";

/** Where the built APK is served from (see scripts/copy-apk.sh). */
const APK_URL = "/apk/kranthi-portfolio.apk";

/** Animated Android-robot logo (pure SVG + CSS bounce). */
function AndroidRobotLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        {/* antennae */}
        <path d="M9.4 6.1 8.6 3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M14.6 6.1l0.8-2.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <circle cx="8.4" cy="3.5" r="0.9" />
        <circle cx="15.6" cy="3.5" r="0.9" />
        {/* head */}
        <path d="M12 6.4A5.6 5.6 0 0 1 17.6 12v1H6.4v-1A5.6 5.6 0 0 1 12 6.4z" />
        {/* eyes */}
        <circle cx="9.7" cy="10.5" r="1.05" fill="var(--bg-primary)" />
        <circle cx="14.3" cy="10.5" r="1.05" fill="var(--bg-primary)" />
        {/* arms */}
        <path d="M7 14.4 5.3 15.6M17 14.4l1.7 1.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* body */}
        <path d="M6.7 13.2h10.6l-1 6.1a1.2 1.2 0 0 1-1.2 1H8.9a1.2 1.2 0 0 1-1.2-1z" />
        {/* legs */}
        <rect x="9.2" y="20.5" width="2" height="1.5" rx="0.75" />
        <rect x="12.8" y="20.5" width="2" height="1.5" rx="0.75" />
      </g>
    </svg>
  );
}

/**
 * Android APK download button. Rendered on the right side of the navbar.
 * The animated robot bounces; clicking downloads public/apk/kranthi-portfolio.apk.
 * If the APK hasn't been built/copied yet, it shows a short inline hint instead.
 */
export function AndroidDownload() {
  const [hint, setHint] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  // Clean up the hint timer on unmount.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async () => {
    if (isNative()) return;
    const ok = await fetch(APK_URL, { method: "HEAD" })
      .then((r) => r.ok)
      .catch(() => false);
    if (ok) {
      setHint(null);
      window.location.href = APK_URL;
      return;
    }
    setHint("The APK isn't built yet — run `npm run copy:apk` (see README).");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHint(null), 5000);
  };

  // Inside the native app the button is pointless — hide it.
  if (isNative()) return null;

  return (
    <span className="relative inline-block">
      <button
        onClick={handleClick}
        aria-label="Download the Android app (APK)"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
      >
        <span className="animate-android-bounce inline-flex" aria-hidden="true">
          <AndroidRobotLogo className="w-4 h-4" />
        </span>
        GET APK
      </button>

      {hint && (
        <span
          role="status"
          className="absolute top-full right-0 mt-2 z-[80] w-56 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-[11px] text-[var(--text-secondary)] shadow-lg shadow-black/10"
        >
          {hint}
        </span>
      )}
    </span>
  );
}
