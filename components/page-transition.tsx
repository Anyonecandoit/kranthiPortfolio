"use client";

import { motion } from "framer-motion";

/**
 * Page entrance transition — smooth fade + slide-up for every route,
 * matching the Oberon feel (0.5–0.8s, ease-out).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
