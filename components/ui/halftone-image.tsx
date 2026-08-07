"use client";

import { motion } from "framer-motion";

interface HalftoneImageProps {
  src?: string;
  alt: string;
  className?: string;
  dotSize?: number;
}

export function HalftoneImage({
  src,
  alt,
  className = "",
  dotSize = 4,
}: HalftoneImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover grayscale"
          style={{
            filter: "grayscale(100%) contrast(1.2)",
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-700 dark:to-neutral-900" />
      )}
      {/* Halftone dot overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
        style={{ opacity: 0.4 }}
      >
        <defs>
          <pattern
            id={`halftone-${alt.replace(/\s/g, '-')}`}
            x="0"
            y="0"
            width={dotSize * 2}
            height={dotSize * 2}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={dotSize}
              cy={dotSize}
              r={dotSize * 0.4}
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#halftone-${alt.replace(/\s/g, '-')})`} />
      </svg>
    </motion.div>
  );
}
