"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  number?: string;
  label: string;
  title: string;
  description?: string;
  light?: boolean;
}

export function SectionHeader({ number, label, title, description, light = true }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      {/* Section number + label (Oberon-style) */}
      {number && (
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-accent text-white text-xs font-bold">
            {number}
          </span>
          <span
            className={`label-mono ${light ? "text-[var(--text-secondary)]" : "text-[var(--text-light-muted)]"}`}
          >
            {label}
          </span>
        </div>
      )}

      {/* Large heading */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.05em] leading-[1.05]">
        {title}
      </h2>

      {/* Optional description */}
      {description && (
        <p className={`mt-4 text-lg max-w-2xl leading-relaxed ${light ? "text-[var(--text-secondary)]" : "text-[var(--text-light-muted)]"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
