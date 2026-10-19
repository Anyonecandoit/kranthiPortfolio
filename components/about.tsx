"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { Code, CheckCircle, Database, Gauge, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Ultra High-End Sleek Oberon '02 AREAS' section:
 * - Dynamic infinite ticker for client logos
 * - Oberon two-piece badge: [02 | AREAS]
 * - 2x2 architectural quadrant grid with interactive mouse-follow spotlight glow
 * - Center rotating crosshair '+' marker with HUD coordinates
 * - Interactive '+ MUCH MORE' and 'EXPLORE ALL SOLUTIONS'
 */
export function About() {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const companies = [
    { name: "Barraq Tech Lab", domain: "Fintech & Enterprise" },
    { name: "PayU Digital Labs", domain: "Payments & Fraud" },
    { name: "American Heart Assoc.", domain: "Healthcare Systems" },
    { name: "Impelsys", domain: "Digital Publishing" },
    { name: "Wibmo", domain: "Payment Security" },
  ];

  // Double list for seamless infinite ticker
  const tickerCompanies = [...companies, ...companies];

  const quadrants = [
    {
      icon: Code,
      title: "TEST AUTOMATION & FRAMEWORKS",
      badge: "SELENIUM & TESTNG",
      description: "Modular, hybrid test automation frameworks eliminating 40-60% of manual regression cycles across web and mobile platforms.",
    },
    {
      icon: CheckCircle,
      title: "API VALIDATION & EVENT STREAMING",
      badge: "REST ASSURED & KAFKA",
      description: "Automated validation over high-volume REST APIs, Kafka asynchronous transaction flows, and distributed event systems.",
    },
    {
      icon: Gauge,
      title: "PERFORMANCE & LOAD TESTING",
      badge: "JMETER & TELEMETRY",
      description: "Distributed load generation simulating 10,000+ virtual users, stress profiling, and transaction resilience.",
    },
    {
      icon: Database,
      title: "CI/CD PIPELINES & DEVOPS",
      badge: "JENKINS, DOCKER & K8S",
      description: "Automated zero-defect build gates with Jenkins, Docker containers, Kubernetes, and Helm deployments.",
    },
  ];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top: TRUSTED BY client strip with animated infinite marquee ticker */}
        <div className="border-b border-[var(--border-color)] pb-8 mb-16 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-semibold shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              COMPANIES WORKED WITH :
            </span>

            {/* Continuous Marquee Ticker with fade mask */}
            <div
              className="relative overflow-hidden flex-1 max-w-full"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              }}
            >
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-8 w-max select-none"
              >
                {tickerCompanies.map((co, idx) => (
                  <div
                    key={`${co.name}-${idx}`}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xs border border-[var(--border-color)]/70 bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all cursor-pointer group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-80 group-hover:scale-125 transition-transform" />
                    <span className="font-mono text-xs tracking-wider text-[var(--text-primary)] font-bold whitespace-nowrap">
                      {co.name.toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] border-l border-[var(--border-color)] pl-2">
                      {co.domain}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column: Badge + Heading + Author Attribution */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <SectionLabel number="05" title="ABOUT" />
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[1.08] mb-8 text-[var(--text-primary)]"
              >
                What I do &amp;
                <br />
                specialize in
              </motion.h2>
            </div>

            {/* Author Attribution Card matching Oberon img_1.png */}
            <motion.div
              whileHover={{ y: -2 }}
              className="border-t border-[var(--border-color)] pt-6 mt-6 max-w-sm cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded bg-[var(--accent)] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                  KK
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--text-primary)]">
                    KRANTHI KUMAR KATTA
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
                    SDET 2 | QA AUTOMATION ENGINEER
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)] leading-relaxed font-semibold">
                SPECIALIZING IN 5+ YEARS OF TEST AUTOMATION, HIGH-THROUGHPUT APIS &amp; ENTERPRISE QUALITY ARCHITECTURE.
              </p>
            </motion.div>
          </div>

          {/* Right Column: 2x2 Architectural Quadrants with Spotlight Hover */}
          <div
            onMouseMove={handleMouseMove}
            className="lg:col-span-7 relative border border-[var(--border-color)] bg-[var(--bg-card)] shadow-card overflow-hidden"
          >
            {/* Center Orange Crosshair '+' Marker with slow continuous rotation + hover pop */}
            <motion.span
              animate={{
                rotate: hoveredQuadrant !== null ? 90 : 0,
                scale: hoveredQuadrant !== null ? 1.15 : 1,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent)] font-mono text-sm font-bold z-20 pointer-events-none select-none bg-[var(--bg-card)] w-6 h-6 rounded-full border border-[var(--border-color)] flex items-center justify-center shadow-xs"
            >
              +
            </motion.span>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)]">
              {/* Row 1 */}
              <div className="divide-y divide-[var(--border-color)]">
                {quadrants.slice(0, 2).map((q, i) => {
                  const Icon = q.icon;
                  const isHovered = hoveredQuadrant === i;
                  return (
                    <motion.div
                      key={q.title}
                      onMouseEnter={() => setHoveredQuadrant(i)}
                      onMouseLeave={() => setHoveredQuadrant(null)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="p-8 transition-all duration-300 group flex flex-col justify-between min-h-[230px] relative overflow-hidden"
                      style={{
                        background: isHovered
                          ? `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(230,88,0,0.08), transparent 70%)`
                          : "transparent",
                      }}
                    >
                      {/* Corner HUD markers on hover */}
                      <span className="absolute top-2 left-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ┌
                      </span>
                      <span className="absolute top-2 right-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ┐
                      </span>

                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-10 h-10 border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-xs flex items-center justify-center group-hover:border-[var(--accent)] group-hover:scale-105 transition-all shadow-xs">
                          <Icon size={18} className="text-[var(--accent)]" />
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-xs font-semibold">
                          {q.badge}
                        </span>
                      </div>
                      <div className="relative z-10">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {q.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {q.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Row 2 */}
              <div className="divide-y divide-[var(--border-color)]">
                {quadrants.slice(2, 4).map((q, i) => {
                  const Icon = q.icon;
                  const idx = i + 2;
                  const isHovered = hoveredQuadrant === idx;
                  return (
                    <motion.div
                      key={q.title}
                      onMouseEnter={() => setHoveredQuadrant(idx)}
                      onMouseLeave={() => setHoveredQuadrant(null)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      className="p-8 transition-all duration-300 group flex flex-col justify-between min-h-[230px] relative overflow-hidden"
                      style={{
                        background: isHovered
                          ? `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(230,88,0,0.08), transparent 70%)`
                          : "transparent",
                      }}
                    >
                      {/* Corner HUD markers on hover */}
                      <span className="absolute bottom-2 left-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        └
                      </span>
                      <span className="absolute bottom-2 right-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ┘
                      </span>

                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="w-10 h-10 border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-xs flex items-center justify-center group-hover:border-[var(--accent)] group-hover:scale-105 transition-all shadow-xs">
                          <Icon size={18} className="text-[var(--accent)]" />
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-xs font-semibold">
                          {q.badge}
                        </span>
                      </div>
                      <div className="relative z-10">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {q.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {q.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar: '+ MUCH MORE' and 'EXPLORE ALL SOLUTIONS' */}
        <motion.div
          whileHover={{ borderColor: "var(--accent)" }}
          className="border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-sm transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <span className="text-[var(--accent)] font-mono font-bold text-sm">+</span>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-[var(--text-primary)]">
              5+ YEARS DELIVERING RESILIENT AUTOMATION ACROSS PRODUCTION SYSTEMS
            </span>
          </div>
          <a
            href="#experience"
            className="px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200 text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 rounded-xs"
          >
            VIEW WORK EXPERIENCE
            <ArrowRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
