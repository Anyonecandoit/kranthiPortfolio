"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  number: string;
  title: string;
  light?: boolean;
}

export function SectionLabel({ number, title, light = true }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 mb-8"
    >
      <span
        className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold ${
          light
            ? "bg-accent text-white"
            : "bg-accent text-white"
        }`}
      >
        {number}
      </span>
      <span
        className={`font-mono text-xs tracking-[0.2em] uppercase ${
          light ? "text-[var(--text-secondary)]" : "text-[var(--text-light-muted)]"
        }`}
      >
        {title}
      </span>
    </motion.div>
  );
}
