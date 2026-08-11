"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, ArrowDown, Code, Database, Cloud, Shield } from "lucide-react";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { DotMatrixBottom } from "@/components/ui/dot-pattern";
import { IntegrationsBlock } from "@/components/tech-stack";

/**
 * Oberon-inspired Hero — bold typography, numbered section,
 * floating tech icons, dot-matrix background, minimal CTAs.
 */
export function Hero() {
  const { name, title, email, linkedin, summary } = resumeData;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -60]);
  const y2 = useTransform(scrollY, [0, 500], [0, -30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Subtle dot matrix at the bottom (Oberon-style) */}
      <DotMatrixBottom className="text-[var(--text-primary)]" />

      {/* Floating tech icons — orbital arrangement */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Left side icons */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[15%] w-12 h-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center"
        >
          <Code size={20} className="text-accent" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[45%] left-[8%] w-10 h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center"
        >
          <Database size={16} className="text-accent" />
        </motion.div>

        {/* Right side icons */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[30%] right-[12%] w-14 h-14 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center shadow-card"
        >
          <Cloud size={22} className="text-accent" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[50%] right-[18%] w-10 h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center"
        >
          <Shield size={16} className="text-accent" />
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left column — section label + text */}
          <div className="lg:col-span-7">
            <SectionLabel number="01" title="INTRO" />

            {/* Main heading — huge bold (Oberon-style) */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-display font-medium tracking-[-0.05em] leading-[1.05] mb-6"
            >
              Building AI systems
              <br />
              that work for you
            </motion.h1>

            {/* Monospace tagline — name + role for on-page keyword presence */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="label-mono text-[var(--text-secondary)] mb-8 max-w-lg"
            >
              {name.toUpperCase()} — {title || "SENIOR SDET | AUTOMATION EXPERT"}
            </motion.p>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-lg text-[var(--text-secondary)] leading-relaxed mb-10 max-w-xl"
            >
              {summary || "Senior SDET with 5+ years of experience in automation, performance testing, and API testing."}
            </motion.p>

            {/* CTA buttons — outline + solid (Oberon-style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="#projects"
                className="btn-outline inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                VIEW MY WORK
              </a>
              <a
                href={`mailto:${email}`}
                className="btn-solid inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                <Mail size={14} />
                LET&apos;S TALK
              </a>
            </motion.div>
          </div>

          {/* Right column — 07 STACK / Integrations block (first page, right side, under SIGN IN) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="label-mono text-[var(--text-secondary)] text-[0.65rem] tracking-[0.2em]"
            >
              07 — STACK
            </motion.span>
            <IntegrationsBlock variant="column" />
          </div>
        </div>

        {/* Stats row — Oberon-style bottom metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--border-color)] pt-8"
        >
          {[
            { number: "5+", label: "YEARS EXPERIENCE" },
            { number: "4", label: "PROJECTS SHIPPED" },
            { number: "1000+", label: "TEST SCRIPTS" },
            { number: "60%", label: "EFFICIENCY GAIN" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-3xl md:text-4xl font-medium tracking-tight mb-1">{stat.number}</div>
              <div className="label-mono text-[var(--text-secondary)] text-[0.65rem]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex justify-start"
        >
          <motion.a
            href="#about"
            aria-label="Scroll to About section"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <ArrowDown size={14} />
            SCROLL
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
