"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

interface AnimatedHeroNameProps {
  className?: string;
}

/**
 * AnimatedHeroName
 * Futuristic kinetic typography animation for "Kranthi Kumar Katta".
 *
 * Features:
 * - Non-stop sequential typing entrance starting from 'K' through "Kranthi" -> "Kumar" -> "Katta".
 * - Sleek, cohesive color architecture: "Kranthi Kumar" in crisp primary text, "Katta" in signature vibrant brand orange.
 *   Eliminates single-letter color splits (e.g. orange 'K' + black 'ranthi') while keeping the rich brand color.
 * - Dynamic typing pulse caret during entrance.
 * - 2.5s steady hold phase with ambient luminous orange sheen sweep across the entire name.
 * - Smooth dissolve exit and automated continuous replay loop.
 * - Interactive: Hover letter physics + click anywhere to replay immediately.
 */
export function AnimatedHeroName({ className = "" }: AnimatedHeroNameProps) {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"entering" | "holding" | "exiting">("entering");

  // Words configuration — cohesive coloring per word
  const words = useMemo(
    () => [
      { text: "Kranthi", isAccent: false, id: "kranthi" },
      { text: "Kumar", isAccent: false, id: "kumar" },
      { text: "Katta", isAccent: true, id: "katta" },
    ],
    []
  );

  // Pre-calculate cumulative stagger delays starting with first letter 'K'
  const letterMatrix = useMemo(() => {
    let currentDelay = 0.05;
    return words.map((word, wIdx) => {
      const letters = Array.from(word.text).map((char, cIdx) => {
        const delay = currentDelay;
        currentDelay += 0.045; // 45ms per character
        return {
          char,
          wordIdx: wIdx,
          charIdx: cIdx,
          isAccent: word.isAccent,
          delay,
        };
      });
      currentDelay += 0.09; // 90ms breath between words
      return letters;
    });
  }, [words]);

  // Automated non-stop lifecycle: entering (~1.1s) -> holding (2.5s) -> exiting (0.35s) -> replay
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "entering") {
      // Entrance typing completes in ~1.15s
      timer = setTimeout(() => {
        setPhase("holding");
      }, 1150);
    } else if (phase === "holding") {
      // Hold completed name prominently for 2.5 seconds
      timer = setTimeout(() => {
        setPhase("exiting");
      }, 2500);
    } else if (phase === "exiting") {
      // Quick smooth dissolve exit then restart next cycle
      timer = setTimeout(() => {
        setCycle((c) => c + 1);
        setPhase("entering");
      }, 350);
    }

    return () => clearTimeout(timer);
  }, [phase, cycle]);

  const handleManualReplay = useCallback(() => {
    if (phase !== "exiting") {
      setPhase("exiting");
    }
  }, [phase]);

  return (
    <div
      onClick={handleManualReplay}
      className={`relative inline-flex items-center flex-wrap gap-y-2 select-none cursor-pointer group ${className}`}
      title="Click to replay animation"
    >
      <div className="relative inline-flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 overflow-hidden py-1">
        {letterMatrix.map((wordLetters, wIdx) => {
          const isAccentWord = words[wIdx].isAccent;

          return (
            <span
              key={`cycle-${cycle}-word-${wIdx}`}
              className={`inline-flex items-baseline whitespace-nowrap font-bold tracking-tight ${
                isAccentWord
                  ? "text-[var(--accent)] drop-shadow-[0_0_16px_rgba(230,88,0,0.38)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {wordLetters.map((item) => {
                const { char, charIdx, isAccent, delay } = item;

                return (
                  <motion.span
                    key={`cycle-${cycle}-w${wIdx}-c${charIdx}`}
                    initial={{
                      opacity: 0,
                      y: 18,
                      scale: 0.8,
                    }}
                    animate={
                      phase === "entering" || phase === "holding"
                        ? {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }
                        : {
                            opacity: 0,
                            y: -12,
                            scale: 0.94,
                          }
                    }
                    transition={
                      phase === "entering"
                        ? {
                            type: "spring",
                            damping: 16,
                            stiffness: 270,
                            delay,
                          }
                        : phase === "exiting"
                        ? {
                            duration: 0.22,
                            ease: "easeInOut",
                            delay: delay * 0.12,
                          }
                        : { duration: 0.2 }
                    }
                    whileHover={{
                      y: -4,
                      scale: 1.15,
                      color: "var(--accent)",
                      transition: { duration: 0.12 },
                    }}
                    className={`inline-block transition-colors duration-150 ${
                      isAccent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}

        {/* Dynamic typing cursor indicator during entrance */}
        {phase === "entering" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block w-1 h-7 sm:h-9 bg-[var(--accent)] ml-1 self-center rounded-xs shadow-[0_0_8px_var(--accent)]"
          />
        )}

        {/* Luminous light sweep that travels across the full name during the holding phase */}
        {phase === "holding" && (
          <motion.div
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "240%", opacity: [0, 0.65, 0] }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent pointer-events-none skew-x-[-20deg]"
          />
        )}
      </div>

      {/* Subtle live radar ping indicator showing non-stop active state */}
      <span className="hidden sm:inline-flex items-center ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
        </span>
      </span>
    </div>
  );
}
