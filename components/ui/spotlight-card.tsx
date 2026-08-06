"use client";

import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  onClick?: () => void;
}

/**
 * Card with a subtle radial spotlight that follows the mouse.
 * Feels premium and interactive.
 */
export function SpotlightCard({
  children,
  className,
  glow = "rgba(139,92,246,0.1)",
  onClick,
}: SpotlightCardProps) {
  return (
    <div
      onClick={onClick}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        e.currentTarget.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.setProperty("--mx", "50%");
        e.currentTarget.style.setProperty("--my", "50%");
      }}
      className={cn(
        "relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300",
        "hover:border-white/[0.12] hover:bg-white/[0.04]",
        className
      )}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
      }}
    >
      {/* Spotlight glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 60%)`,
        }}
      />
      {/* Gradient border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, violet-500/30 50%, transparent 100%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}