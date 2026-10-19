"use client";

import { motion } from "framer-motion";

interface GridBackgroundProps {
  className?: string;
  columns?: number;
  light?: boolean;
}

export function GridBackground({
  className = "",
  columns = 4,
  showAccentGuide = true,
}: GridBackgroundProps & { showAccentGuide?: boolean }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="h-full mx-auto max-w-7xl grid relative px-6"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-full relative ${
              i === 0
                ? "border-l border-r border-[var(--border-color)]"
                : "border-r border-[var(--border-color)]"
            } ${
              showAccentGuide && i === 1
                ? "after:absolute after:inset-y-0 after:left-0 after:border-l after:border-dashed after:border-[var(--accent)]/30"
                : ""
            }`}
          >
            {/* Traveling laser pulse along the accent guide line */}
            {showAccentGuide && i === 1 && (
              <>
                <motion.div
                  animate={{ y: ["-20%", "120%"] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                  className="absolute -left-[1.5px] w-[3px] h-28 bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent pointer-events-none opacity-80 shadow-[0_0_8px_var(--accent)]"
                />
                <motion.div
                  animate={{ y: ["120%", "-20%"] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 3 }}
                  className="absolute -left-[1px] w-[2px] h-16 bg-gradient-to-b from-transparent via-[var(--accent)]/60 to-transparent pointer-events-none opacity-50"
                />
              </>
            )}

            {/* Subtle intersection crosshairs '+' with slow pulse animation */}
            {i === 1 && (
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -left-2 text-[var(--accent)] font-mono text-[11px] leading-none select-none"
              >
                +
              </motion.span>
            )}
            {i === 2 && (
              <motion.span
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -left-2 text-[var(--text-secondary)] font-mono text-[10px] leading-none select-none"
              >
                +
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
