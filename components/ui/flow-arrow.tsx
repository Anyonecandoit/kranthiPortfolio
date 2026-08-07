"use client";

import { motion } from "framer-motion";

interface FlowArrowProps {
  className?: string;
  direction?: "horizontal" | "vertical";
}

export function FlowArrow({ className = "", direction = "horizontal" }: FlowArrowProps) {
  if (direction === "vertical") {
    return (
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex flex-col items-center gap-1 ${className}`}
      >
        <div className="w-px h-8 border-l border-dashed border-current opacity-30" />
        <svg width="8" height="8" viewBox="0 0 8 8" className="text-current opacity-30">
          <path d="M4 0 L4 6 M1 4 L4 7 L7 4" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-1 ${className}`}
    >
      <div className="h-px flex-1 border-t border-dashed border-current opacity-30" />
      <svg width="8" height="8" viewBox="0 0 8 8" className="text-current opacity-30">
        <path d="M0 4 L6 4 M4 1 L7 4 L4 7" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
