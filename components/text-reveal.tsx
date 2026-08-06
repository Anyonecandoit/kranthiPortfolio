"use client";

import { motion } from "framer-motion";

/**
 * Letter-by-letter fade-in reveal — clean, no blur.
 * Used for hero headline.
 */
interface LetterRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function LetterReveal({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.035,
}: LetterRevealProps) {
  const chars = children.split("");

  return (
    <span className={className} aria-label={children}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: "bottom" }}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: delay + i * staggerDelay }}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Word-by-word slide-up reveal — clean fade, no blur.
 */
interface WordRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function WordReveal({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
}: WordRevealProps) {
  const words = children.split(" ");

  return (
    <span className={className} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: delay + i * staggerDelay }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Gradient word reveal — clean slide-up, no blur.
 */
interface GradientWordRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function GradientWordReveal({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
}: GradientWordRevealProps) {
  const words = children.split(" ");

  return (
    <span
      className={`bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: delay + i * staggerDelay }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Paragraph reveal — word-by-word fade-up, no blur.
 */
interface ParagraphRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function ParagraphReveal({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.08,
}: ParagraphRevealProps) {
  const words = children.split(" ");

  return (
    <p className={className} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: delay + i * staggerDelay }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  );
}
