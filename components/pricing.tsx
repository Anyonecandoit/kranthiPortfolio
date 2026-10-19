"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { ArrowRight, Check, Briefcase, Zap, ShieldCheck } from "lucide-react";

/* ─── Role / Engagement profiles for Kranthi's SDET Portfolio ─── */
const engagementRoles = [
  {
    name: "SENIOR SDET",
    subtitle: "FOR ENTERPRISE PRODUCT SQUADS & SCALE",
    level: "SENIOR LEVEL",
    focus: "Web, Mobile & High-Throughput APIs",
    popular: false,
    deliverables: [
      "Lead test automation architecture across web and mobile (Selenium & Playwright)",
      "Build and maintain resilient 1,000+ test suites with 95%+ pass rates",
      "Validate high-volume REST APIs and Kafka event streaming (REST Assured)",
      "Enforce automated zero-defect quality gates in Jenkins & GitHub Actions",
      "Cross-functional collaboration with PMs, Developers, and DevOps teams",
      "Production release signoff, risk assessments, and defect triage",
    ],
    cta: "GET IN TOUCH",
  },
  {
    name: "AUTOMATION ARCHITECT",
    subtitle: "FOR HIGH-VELOCITY PLATFORMS & TEST INFRASTRUCTURE",
    level: "PRIMARY FOCUS",
    focus: "Framework Engineering & Performance",
    popular: true,
    deliverables: [
      "Design custom Page Object Model & data-driven frameworks from scratch",
      "Apache JMeter & k6 performance benchmarking (10,000+ concurrent VUs)",
      "Containerized Docker test runners & cloud infrastructure (AWS Certified)",
      "Contract testing with Pact and service virtualization with WireMock",
      "Flakiness elimination, atomic test design, and smart retry policies",
      "Comprehensive architectural documentation and engineering runbooks",
    ],
    cta: "DISCUSS OPPORTUNITIES",
  },
  {
    name: "QA LEAD & ADVISORY",
    subtitle: "FOR TEST AUDITS, MODERNIZATION & COMPLIANCE",
    level: "LEAD / CONSULTING",
    focus: "Strategy, Compliance & Mentorship",
    popular: false,
    deliverables: [
      "Comprehensive test debt and flakiness root-cause audit & stabilization",
      "Migration roadmaps from legacy Selenium suites to modern Playwright",
      "Fintech compliance validation: 3D Secure 2.0, EMVCo, and ISO 20022 / SWIFT",
      "Database transactional data integrity audits (MySQL 8.0, PostgreSQL)",
      "CI/CD build time acceleration through parallelization and test sharding",
      "Mentor QA engineers and establish team-wide quality engineering standards",
    ],
    cta: "CONNECT WITH KRANTHI",
  },
];

/**
 * Authentic Oberon '10 ENGAGEMENT' Section:
 * Replaces commercial agency pricing with professional SDET role profiles & ways to collaborate.
 * - Preserves Oberon aesthetic, 3-column architectural grid, and Framer Motion animations
 * - Center card highlighted with orange PRIMARY FOCUS tag and solid orange CTA button
 * - Bullet list with orange '>' markers
 */
export function Pricing() {
  const [activeMode, setActiveMode] = useState<"fulltime" | "contract">("fulltime");

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Role Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <SectionLabel number="10" title="ENGAGEMENT" />
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08]"
            >
              Open to roles
            </motion.h2>
          </div>

          {/* Liquid Spring-Physics Toggle Pill */}
          <div className="relative inline-flex border border-[var(--border-color)] bg-[var(--bg-card)] p-1 rounded-sm shadow-xs self-start select-none">
            <button
              onClick={() => setActiveMode("fulltime")}
              className="relative px-4 py-2 text-xs font-mono font-bold tracking-wider transition-colors z-10 cursor-pointer"
            >
              {activeMode === "fulltime" && (
                <motion.div
                  layoutId="engagementToggle"
                  className="absolute inset-0 bg-[var(--text-primary)] rounded-xs z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={activeMode === "fulltime" ? "text-[var(--bg-primary)]" : "text-[var(--text-secondary)]"}>
                FULL-TIME ROLES
              </span>
            </button>
            <button
              onClick={() => setActiveMode("contract")}
              className="relative px-4 py-2 text-xs font-mono font-bold tracking-wider transition-colors z-10 cursor-pointer"
            >
              {activeMode === "contract" && (
                <motion.div
                  layoutId="engagementToggle"
                  className="absolute inset-0 bg-[var(--text-primary)] rounded-xs z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={activeMode === "contract" ? "text-[var(--bg-primary)]" : "text-[var(--text-secondary)]"}>
                CONTRACT &amp; ADVISORY
              </span>
            </button>
          </div>
        </div>

        {/* 3-Column Architectural Table */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-color)] shadow-card">
          {engagementRoles.map((role, i) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-8 lg:p-10 flex flex-col justify-between relative transition-shadow duration-300 ${
                role.popular ? "bg-[var(--bg-primary)]/40 shadow-md" : "hover:bg-[var(--bg-primary)]/20"
              }`}
            >
              {/* Popular Shimmer Border */}
              {role.popular && (
                <div className="absolute inset-0 pointer-events-none border border-[var(--accent)] z-20">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
                  />
                </div>
              )}

              <div>
                {/* Top Role Label */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    {role.name}
                  </span>
                  {role.popular ? (
                    <span className="px-2 py-0.5 bg-[var(--accent)] text-white font-mono text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      {role.level}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] font-mono text-[9px] font-semibold uppercase tracking-wider rounded-sm">
                      {role.level}
                    </span>
                  )}
                </div>

                {/* Monospace Subtitle */}
                <p className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-6 leading-relaxed">
                  {role.subtitle}
                </p>

                {/* Role Focus Scope Banner */}
                <div className="mb-6 border-b border-[var(--border-color)] pb-5">
                  <div className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold mb-1">
                    PRIMARY FOCUS :
                  </div>
                  <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
                    {role.focus}
                  </div>
                </div>

                {/* Deliverables List with Orange '>' */}
                <ul className="space-y-3 mb-10">
                  {role.deliverables.map((item, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed group">
                      <span className="text-[var(--accent)] font-mono font-bold text-xs mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">&gt;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-4">
                <a
                  href="#contact"
                  className={`w-full py-3.5 px-4 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all rounded-sm ${
                    role.popular
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] shadow-sm hover:scale-[1.01]"
                      : "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white"
                  }`}
                >
                  {role.cta}
                  <ArrowRight size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
