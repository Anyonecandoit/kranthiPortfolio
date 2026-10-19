"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  number: string;
  title: string;
  light?: boolean;
  className?: string;
}

export function SectionLabel({ number, title, light, className }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-1.5 select-none ${className || "mb-8"}`}
    >
      {/* Orange numbered box */}
      <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 bg-[var(--accent)] text-white text-[11px] font-mono font-bold tracking-tight rounded-sm shadow-sm">
        {number}
      </span>
      {/* Attached neutral label pill */}
      <span className="inline-flex items-center h-[26px] px-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-mono font-semibold tracking-[0.18em] uppercase rounded-sm">
        {title}
      </span>
    </motion.div>
  );
}
