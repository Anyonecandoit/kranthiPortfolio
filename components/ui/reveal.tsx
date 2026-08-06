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
  scale = 0.98,
  blur = false,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
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
        scale,
        filter: blur ? "blur(10px)" : "blur(0px)",
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y, scale, filter: blur ? "blur(10px)" : "blur(0px)" }
      }
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
