"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/**
 * Animated number counter — counts up from 0 to the target value
 * when scrolled into view. Used for stats/metrics.
 */
export function AnimatedCounter({
  value,
  duration = 2,
  suffix = "",
  className,
}: {
  value: string;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!inView || animated) return;
    setAnimated(true);

    const target = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    const suffixOnly = value.replace(/[0-9.]/g, "");
    const durationMs = duration * 1000;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(`${current}${suffix || suffixOnly}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [inView, duration, value, suffix, animated]);

  return <span ref={ref} className={className}>{display}</span>;
}
