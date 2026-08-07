"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * Scroll-reveal primitive. Content fades/slides (optionally blur) in once it
 * enters the viewport. Wrap any section child to get the premium reveal feel.
 *
 * Use `delay` to stagger siblings (e.g. 0, 0.08, 0.16 …).
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  scale = 0.98,
  blur = false,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y,
        x,
        scale,
        filter: blur ? "blur(10px)" : "blur(0px)",
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y, x, scale, filter: blur ? "blur(10px)" : "blur(0px)" }
      }
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered reveal for lists/grids. Pass an array of children and it
 * automatically staggers the entrance.
 */
export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.06,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
