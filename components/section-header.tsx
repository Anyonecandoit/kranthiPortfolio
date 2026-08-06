"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-violet-500/60" />
        <span className="text-xs font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          {label}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-violet-500/60" />
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
        {title}
      </h2>

      {description && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto text-pretty">
          {description}
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <div className="h-1 w-16 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_100%] animate-shimmer" />
      </div>
    </motion.div>
  );
}
