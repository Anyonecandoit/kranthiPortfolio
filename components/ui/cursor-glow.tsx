"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for aura
  const auraX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const auraY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  // Faster spring for micro cursor dot
  const dotX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsPointerFine(window.matchMedia("(pointer: fine)").matches);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isPointerFine) return null;

  return (
    <>
      {/* Soft Ambient Radial Glow Following Cursor */}
      <motion.div
        style={{ x: auraX, y: auraY }}
        className="fixed top-0 left-0 w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[90] opacity-[0.08] dark:opacity-[0.18]"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-[var(--accent)] blur-[80px]" />
      </motion.div>

      {/* Sleek Trailing Dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99] rounded-full bg-[var(--accent)] opacity-60 shadow-sm"
        aria-hidden="true"
      />
    </>
  );
}
