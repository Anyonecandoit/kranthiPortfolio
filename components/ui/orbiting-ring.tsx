"use client";

import { motion } from "framer-motion";

/**
 * Orbiting ring with dots — for around hero badge or section titles.
 * Gives the site a futuristic / tech-demo feel.
 */
export function OrbitingRings({
  size = 320,
  rings = 2,
  className,
}: {
  size?: number;
  rings?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {Array.from({ length: rings }).map((_, i) => {
        const radius = (i + 1) * (size / (rings + 1)) / 2;
        const dots = 6 + i * 2;
        const speed = 20 + i * 8;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/[0.06]"
            style={{
              width: radius * 2,
              height: radius * 2,
              left: "50%",
              top: "50%",
              marginLeft: -radius,
              marginTop: -radius,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: speed, ease: "linear", repeat: Infinity }}
          >
            {Array.from({ length: dots }).map((_, j) => {
              const angle = (j / dots) * Math.PI * 2;
              return (
                <div
                  key={j}
                  className={cn(
                    "absolute rounded-full",
                    j % 3 === 0 ? "bg-violet-400/60" : j % 3 === 1 ? "bg-blue-400/40" : "bg-pink-400/40",
                  )}
                  style={{
                    width: j % 3 === 0 ? 5 : 3,
                    height: j % 3 === 0 ? 5 : 3,
                    left: "50%",
                    top: "50%",
                    marginLeft: -((j % 3 === 0 ? 5 : 3) / 2),
                    marginTop: -((j % 3 === 0 ? 5 : 3) / 2),
                    transform: `rotate(${angle}rad) translateX(${radius}px) rotate(${-angle}rad)`,
                    boxShadow: j % 3 === 0 ? "0 0 8px rgba(139,92,246,0.6)" : "none",
                  }}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
