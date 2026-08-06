"use client";

import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Holographic card with animated gradient border, internal glow, and
 * optional mesh texture overlay. Feels futuristic and tactile.
 *
 * Props:
 * - glow: base color for the internal glow
 * - border: gradient colors for the animated border
 * - mesh: enable the subtle dot-mesh overlay
 */
export function HolographicCard({
  children,
  className,
  glow = "rgba(139,92,246,0.12)",
  mesh = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  mesh?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-transparent transition-all duration-500",
        "hover:border-white/[0.12] hover:shadow-[0_20px_80px_-20px_rgba(139,92,246,0.35)]",
        className
      )}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Animated gradient border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "conic-gradient(from var(--angle, 0deg) via violet-500/40 via-40% cyan-400/30 via-70% pink-500/30 to violet-500/40)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      {/* Mouse-tracking glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 50%)`,
        }}
      />
      {/* Dot mesh overlay */}
      {mesh && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      )}
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
