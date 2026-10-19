"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { Target, Zap, Sliders, Shield } from "lucide-react";

/**
 * Authentic Oberon '08 VALUE' section (from img_5.png):
 * - Oberon two-piece badge: [08 | VALUE]
 * - Display heading 'Why choose us' / 'Why work with me'
 * - Left attribution: KRANTHI KUMAR KATTA / WE ARE FOCUSED ONLY ON MEASURABLE RESULTS
 * - 4 architectural quadrant cells (.01, .02, .03, .04)
 * - Bottom indicator: '+ MUCH MORE'
 */
export function Value() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = [
    {
      num: ".01",
      title: "SHIFT-LEFT & PREVENTATIVE QA",
      desc: "Review user stories, schemas, and API contracts early to catch design edge cases and integration gaps before code is written.",
      icon: Target,
    },
    {
      num: ".02",
      title: "ZERO-FLAKINESS ARCHITECTURE",
      desc: "Design atomic, self-contained tests with dynamic condition polling and isolated fixtures to maintain a trusted 95%+ pass rate.",
      icon: Sliders,
    },
    {
      num: ".03",
      title: "FAST PARALLEL EXECUTION",
      desc: "Leverage Docker containers and distributed test runners in Jenkins & GitHub Actions to provide rapid CI/CD build feedback.",
      icon: Zap,
    },
    {
      num: ".04",
      title: "OBSERVABILITY & ROOT CAUSE TRACES",
      desc: "Equip test failures with rich execution traces, video replays, and network logs so developers can diagnose and resolve bugs in minutes.",
      icon: Shield,
    },
  ];

  return (
    <section id="value" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start">
          {/* Left Column — Badge, Heading & Attribution */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <SectionLabel number="08" title="PRINCIPLES" />
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08] mb-8"
              >
                Engineering
                <br />
                principles
              </motion.h2>
            </div>

            {/* Quote Card matching Oberon img_5.png */}
            <div className="border-t border-[var(--border-color)] pt-6 mt-6 max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded bg-[var(--accent)] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                  KK
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--text-primary)]">
                    KRANTHI KUMAR KATTA
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
                    SENIOR SDET &amp; AUTOMATION ARCHITECT
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] leading-relaxed font-semibold">
                QUALITY IS BUILT INTO THE ARCHITECTURE FROM SPRINT ZERO, NOT INSPECTED IN AT THE END.
              </p>
            </div>
          </div>

          {/* Right Column — 4 Quadrant Cells */}
          <div className="lg:col-span-7 relative border border-[var(--border-color)] bg-[var(--bg-card)] shadow-card overflow-hidden">
            {/* Center Orange Crosshair '+' Marker with hover rotation */}
            <motion.span
              animate={{ rotate: hoveredIdx !== null ? 90 : 0, scale: hoveredIdx !== null ? 1.2 : 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent)] font-mono text-sm font-bold z-20 pointer-events-none select-none bg-[var(--bg-card)] w-6 h-6 rounded-full border border-[var(--border-color)] flex items-center justify-center shadow-xs"
            >
              +
            </motion.span>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)]">
              {/* Left Column */}
              <div className="divide-y divide-[var(--border-color)]">
                {values.slice(0, 2).map((val, i) => (
                  <motion.div
                    key={val.num}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-8 hover:bg-[var(--bg-primary)]/40 transition-all duration-300 flex flex-col justify-between min-h-[220px] relative group overflow-hidden"
                  >
                    <span className="absolute top-2 left-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                      ┌
                    </span>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        <span className="text-[var(--accent)]">.</span>
                        {val.num.replace(".", "")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {val.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right Column */}
              <div className="divide-y divide-[var(--border-color)]">
                {values.slice(2, 4).map((val, i) => {
                  const idx = i + 2;
                  return (
                    <motion.div
                      key={val.num}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      className="p-8 hover:bg-[var(--bg-primary)]/40 transition-all duration-300 flex flex-col justify-between min-h-[220px] relative group overflow-hidden"
                    >
                      <span className="absolute bottom-2 right-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ┘
                      </span>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                          <span className="text-[var(--accent)]">.</span>
                          {val.num.replace(".", "")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {val.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {val.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom indicator '+ MUCH MORE' */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent)] font-mono font-bold">+</span>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-[var(--text-primary)]">
              MUCH MORE (INTEGRATED ATS CV ANALYZER, RECRUITER SCREENING, AI AGENT COPILOT)
            </span>
          </div>
          <span className="font-mono text-xs text-[var(--text-secondary)]">08 — VALUE</span>
        </div>
      </div>
    </section>
  );
}
