"use client";

import { motion } from "framer-motion";

interface TextSplitProps {
  children: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextSplit({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
  as: Tag = "span",
}: TextSplitProps) {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`overflow-hidden ${className}`}
      style={{ display: "flex", flexWrap: "wrap" }}
      aria-label={children}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block mr-[0.3em]"
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
      {/* Accessible hidden text */}
      <Tag className="sr-only">{children}</Tag>
    </motion.div>
  );
}
