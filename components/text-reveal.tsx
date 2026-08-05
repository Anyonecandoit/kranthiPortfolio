"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * 3D letter reveal — each character rotates in from the side with blur.
 * Premium effect used on Vercel/Linear landing pages.
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
    <span className={className} aria-label={children} style={{ perspective: "600px" }}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: "bottom" }}
        >
          <motion.span
            className="inline-block"
            initial={{ rotateX: -90, opacity: 0, filter: "blur(10px)" }}
            animate={{ rotateX: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Blur-to-clear word reveal — each word starts blurred and slides up.
 * Premium effect for subtitles.
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
            initial={{ y: 120, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Gradient word reveal with blur — premium gradient text animation.
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
    <span className={`bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent ${className}`} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: 120, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Paragraph reveal — line-by-line with blur clear.
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
            initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  );
}
