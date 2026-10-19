"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  number?: string;
  label: string;
  title: string;
  description?: string;
  light?: boolean;
}

export function SectionHeader({ number, label, title, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14"
    >
      {/* Section number + label (Oberon two-piece badge) */}
      {number && (
        <div className="inline-flex items-center gap-1.5 mb-6 select-none">
          <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 bg-[var(--accent)] text-white text-[11px] font-mono font-bold tracking-tight rounded-sm shadow-sm">
            {number}
          </span>
          <span className="inline-flex items-center h-[26px] px-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-mono font-semibold tracking-[0.18em] uppercase rounded-sm">
            {label}
          </span>
        </div>
      )}

      {/* Large display heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[1.08] text-[var(--text-primary)]">
        {title}
      </h2>

      {/* Optional description */}
      {description && (
        <p className="mt-4 text-base sm:text-lg max-w-2xl leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </motion.div>
  );
}
