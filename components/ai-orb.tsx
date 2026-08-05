"use client";

import { motion } from "framer-motion";

/**
 * Animated AI orb — pulsing gradient sphere with floating particles.
 * Premium hero centerpiece inspired by OpenAI/Linear.
 */
export function AIOrb() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute inset-2 rounded-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 40%, #A855F7 70%, #C084FC 100%)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Inner shimmer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)",
          }}
          animate={{
            x: [-10, 10, -10],
            y: [-10, 10, -10],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating particles around orb */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-400"
          style={{
            top: `${20 + Math.sin(i * 1.047) * 40}%`,
            left: `${50 + Math.cos(i * 1.047) * 50}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" opacity="0.9" />
            <path d="M2 17l10 5 10-5" opacity="0.7" />
            <path d="M2 12l10 5 10-5" opacity="0.5" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
