"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop (HOME) Floating Action Button
 * Provides a sleek, animated one-click return to the top of the website.
 * Features:
 * - Appears with a spring entrance once the user scrolls past the hero section
 * - Interactive circular SVG scroll progress ring showing exact page position
 * - Continuous subtle bounce on the upward arrow icon
 * - One-click smooth scroll to top (#home)
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 280);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setProgress(latest);
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Circular progress math (radius = 16, circumference = 2 * PI * 16 ≈ 100.53)
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--text-primary)] shadow-lg hover:border-[var(--accent)] hover:shadow-[0_0_20px_rgba(230,88,0,0.25)] transition-colors cursor-pointer select-none"
          aria-label="Scroll back to top of website (Home)"
          title="Back to Top (Home)"
        >
          {/* Circular SVG Scroll Progress Indicator */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6 -rotate-90 pointer-events-none" viewBox="0 0 36 36">
              {/* Background ring */}
              <circle
                cx="18"
                cy="18"
                r={radius}
                className="stroke-[var(--border-color)]/60"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Active accent progress ring */}
              <circle
                cx="18"
                cy="18"
                r={radius}
                className="stroke-[var(--accent)] transition-all duration-75"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <motion.div
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ArrowUp size={11} className="text-[var(--accent)]" />
            </motion.div>
          </div>

          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            HOME
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
