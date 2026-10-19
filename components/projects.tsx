/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown, ChevronUp, Share2, ExternalLink, Clock, Calendar } from "lucide-react";
import { shareContent } from "@/lib/native";
import { hapticSelection } from "@/lib/haptics";
import Link from "next/link";

/**
 * Calculates exact days worked on a project based on its date range
 */
function calculateProjectDuration(period?: string, index?: number) {
  const now = new Date(); // Current live date

  // Project 0: BARQ (03 June 2025 – Present)
  if (index === 0 || period?.toLowerCase().includes("present")) {
    const start = new Date(2025, 5, 3); // 03 June 2025
    const diffTime = Math.max(now.getTime() - start.getTime(), 0);
    const days = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 139);
    const months = Math.floor(days / 30.4375);
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const durationText = years > 0 ? `${years} YR ${remMonths} MOS` : `${months} MONTHS`;

    return {
      days,
      daysFormatted: `${days.toLocaleString()}+ DAYS`,
      durationText,
      badge: "ACTIVE ROLE",
      isOngoing: true,
      periodText: "03 JUNE 2025 – PRESENT",
    };
  }

  // Project 1: PayU / Wibmo (03 March 2025 – 02 June 2025)
  if (index === 1 || period?.includes("March 2025")) {
    const start = new Date(2025, 2, 3);
    const end = new Date(2025, 5, 2);
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // 92 days

    return {
      days,
      daysFormatted: `${days} DAYS`,
      durationText: "3 MONTHS SPRINT",
      badge: "COMPLETED",
      isOngoing: false,
      periodText: "03 MAR 2025 – 02 JUN 2025",
    };
  }

  // Project 2: American Heart Association / Impelsys (28 June 2021 – 28 February 2025)
  if (index === 2 || period?.includes("2021")) {
    const start = new Date(2021, 5, 28);
    const end = new Date(2025, 1, 28);
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // 1,342 days

    return {
      days,
      daysFormatted: `${days.toLocaleString()} DAYS`,
      durationText: "3 YRS 8 MOS TENURE",
      badge: "COMPLETED",
      isOngoing: false,
      periodText: "28 JUN 2021 – 28 FEB 2025",
    };
  }

  return {
    days: 365,
    daysFormatted: "365 DAYS",
    durationText: "1 YEAR",
    badge: "COMPLETED",
    isOngoing: false,
    periodText: period || "PROJECT TENURE",
  };
}

/* ─── Enterprise Project Brand & Logo Showcase ───────────────────────── */
const PROJECT_VISUAL_METADATA = [
  {
    // 0: BARQ
    glowColor: "rgba(230, 88, 0, 0.28)",
    accentTone: "text-[var(--accent)]",
    badgeBorder: "border-[var(--accent)]/40",
    tag: "FINTECH • INTERNATIONAL REMITTANCE",
    subtitle: "Distributed Microservices Architecture",
    statBadge: "7+ MTO PARTNERS • KAFKA STREAM • 99.9% INTEGRITY",
    bgGradient: "radial-gradient(circle at 50% 45%, rgba(230,88,0,0.16) 0%, rgba(230,88,0,0.04) 45%, transparent 75%)",
  },
  {
    // 1: WIBMO / PAYU
    glowColor: "rgba(16, 185, 129, 0.28)",
    accentTone: "text-emerald-500",
    badgeBorder: "border-emerald-500/40",
    tag: "PAYMENT GATEWAY • SWITCH & 3DS",
    subtitle: "High-Throughput Switch Layer Routing",
    statBadge: "PCI-DSS COMPLIANT • 3DS SECURITY • T+1 SETTLEMENT",
    bgGradient: "radial-gradient(circle at 50% 45%, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.04) 45%, transparent 75%)",
  },
  {
    // 2: AHA ATLAS
    glowColor: "rgba(225, 29, 72, 0.28)",
    accentTone: "text-rose-500",
    badgeBorder: "border-rose-500/40",
    tag: "HEALTHCARE LMS • CERTIFICATION PLATFORM",
    subtitle: "Global Medical Training & eCard Verification",
    statBadge: "200+ REST APIS • 45% EFFICIENCY GAIN • SELENIUM GRID",
    bgGradient: "radial-gradient(circle at 50% 45%, rgba(225,29,72,0.16) 0%, rgba(225,29,72,0.04) 45%, transparent 75%)",
  },
];

function EnterpriseProjectVisual({
  project,
  index,
}: {
  project: (typeof resumeData.projects)[0];
  index: number;
}) {
  const meta = PROJECT_VISUAL_METADATA[index % PROJECT_VISUAL_METADATA.length];

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none bg-[var(--bg-primary)]/85">
      {/* Dynamic Brand Ambient Aura Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: meta.bgGradient }}
      />

      {/* Cybernetic Grid Texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-color) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--border-color) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Futuristic Telemetry Scanning Laser Sweep */}
      <motion.div
        animate={{ x: ["-120%", "260%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Top HUD Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 font-mono text-[9px] sm:text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
            ENTERPRISE PLATFORM 0{index + 1}
          </span>
          <span className="text-[var(--text-secondary)] opacity-50">•</span>
          <span className="text-[var(--accent)] font-semibold uppercase hidden sm:inline">
            SDET ARCHITECTURE
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-500 font-semibold text-[8px] sm:text-[9px]">LIVE PRODUCTION</span>
        </div>
      </div>

      {/* Center Stage — Grand Official Brand Emblem Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-8 text-center my-auto">
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ duration: 0.25 }}
          className="relative mb-5 group/emblem cursor-pointer"
        >
          {/* Luminous aura bloom */}
          <div
            className="absolute -inset-4 rounded-2xl opacity-60 blur-xl transition-all duration-500 group-hover/emblem:opacity-95"
            style={{ background: meta.glowColor }}
          />

          {/* Elevated Official Brand Logo Card */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl border-2 border-[var(--border-color)] bg-white p-5 sm:p-6 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/emblem:border-[var(--accent)]">
            {project?.logo ? (
              <img
                src={project.logo}
                alt={project.company || project.title}
                className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover/emblem:scale-105"
              />
            ) : (
              <span className="font-mono text-3xl font-extrabold text-[var(--accent)]">
                0{index + 1}
              </span>
            )}

            {/* Corner HUD marks */}
            <span className="absolute -top-1 -left-1 text-[var(--accent)] font-mono text-[9px] leading-none">+</span>
            <span className="absolute -top-1 -right-1 text-[var(--accent)] font-mono text-[9px] leading-none">+</span>
            <span className="absolute -bottom-1 -left-1 text-[var(--accent)] font-mono text-[9px] leading-none">+</span>
            <span className="absolute -bottom-1 -right-1 text-[var(--accent)] font-mono text-[9px] leading-none">+</span>
          </div>
        </motion.div>

        {/* Company & Domain Title */}
        <div className="space-y-1.5 max-w-md px-2">
          <h4 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
            {project?.company}
          </h4>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">
            {meta.tag}
          </div>
          <div className="font-mono text-[9px] text-[var(--text-secondary)] opacity-80">
            {meta.subtitle}
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="relative z-10 pt-3 border-t border-[var(--border-color)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[9px]">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="text-[var(--accent)] font-bold">SPECS:</span>
          <span className="truncate">{meta.statBadge}</span>
        </div>

        {project?.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200 text-[9px] font-mono font-bold tracking-wider uppercase shadow-xs shrink-0"
          >
            <span>VISIT PLATFORM</span>
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* Corner HUD framing brackets */}
      <span className="absolute top-2.5 left-2.5 text-[var(--accent)] font-mono text-[9px] font-bold select-none">
        ┌
      </span>
      <span className="absolute top-2.5 right-2.5 text-[var(--accent)] font-mono text-[9px] font-bold select-none">
        ┐
      </span>
      <span className="absolute bottom-2.5 left-2.5 text-[var(--accent)] font-mono text-[9px] font-bold select-none">
        └
      </span>
      <span className="absolute bottom-2.5 right-2.5 text-[var(--accent)] font-mono text-[9px] font-bold select-none">
        ┘
      </span>
    </div>
  );
}

/**
 * Authentic Oberon '05 PROJECTS' section (from img_3.png):
 * - Oberon two-piece badge: [05 | PROJECTS]
 * - Display heading 'Case studies'
 * - Carousel navigation arrows '<' '>'
 * - Featured Case Study with halftone visual & project info
 * - 3D Interactive Mouse Parallax tilt on featured card
 * - Bottom split bar: big animated metric on left | solid orange 'SEE ALL CASE STUDIES' on right
 * - Interactive expandable project cards below
 */
export function Projects() {
  const { projects } = resumeData;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselHover, setCarouselHover] = useState(false);

  // 3D Tilt motion values
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [3, -3]), { stiffness: 220, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-3, 3]), { stiffness: 220, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setCarouselHover(false);
  };

  useEffect(() => {
    if (carouselHover) return;
    const timer = window.setInterval(() => {
      setCarouselIdx((c) => (c + 1) % (projects?.length || 1));
    }, 6000);
    return () => window.clearInterval(timer);
  }, [carouselHover, projects?.length]);

  const nextProject = () => setCarouselIdx((c) => (c + 1) % (projects?.length || 1));
  const prevProject = () => setCarouselIdx((c) => (c - 1 + (projects?.length || 1)) % (projects?.length || 1));

  const featured = projects?.[carouselIdx] ?? projects?.[0];

  const metrics = [
    { value: "40%", label: "REGRESSION EFFICIENCY IMPROVED (BARQ REMITTANCE)" },
    { value: "35%", label: "TRANSACTION STABILITY GAIN (PAYU PAYMENT GATEWAY)" },
    { value: "45%", label: "AUTOMATION COVERAGE & DEFECT REDUCTION (ATLAS LMS)" },
  ];

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <SectionLabel number="02" title="PROJECTS" />
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08]"
            >
              Enterprise Projects
            </motion.h2>
          </div>

          {/* Carousel Arrows matching Oberon img_3.png */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevProject}
              className="w-10 h-10 border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center hover:border-[var(--accent)] transition-colors shadow-sm"
              aria-label="Previous project"
            >
              <ChevronLeft size={16} className="text-[var(--text-primary)]" />
            </button>
            <button
              onClick={nextProject}
              className="w-10 h-10 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors shadow-sm"
              aria-label="Next project"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Featured Case Study Card matching Oberon img_3.png with 3D Tilt */}
        <div style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              ref={cardRef}
              key={carouselIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setCarouselHover(true)}
              onMouseLeave={handleMouseLeave}
              className="border border-[var(--border-color)] bg-[var(--bg-card)] mb-16 shadow-card overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column — Official Enterprise Brand Logo & Architecture Showcase */}
                <div className="lg:col-span-7 relative border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">
                  <EnterpriseProjectVisual project={featured} index={carouselIdx} />
                </div>

                {/* Right Column — Project Information */}
                <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        {featured?.logo && (
                          <div className="w-9 h-9 rounded-sm border border-[var(--border-color)] bg-[var(--bg-primary)] p-1 flex items-center justify-center shrink-0 shadow-xs">
                            <img
                              src={featured.logo}
                              alt={featured.company || featured.title}
                              className="w-full h-full object-contain rounded-xs"
                            />
                          </div>
                        )}
                        <div>
                          <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider block">
                            PROJECT 0{carouselIdx + 1} OF 0{projects?.length ?? 3}
                          </span>
                          <span className="font-mono text-[9px] text-[var(--text-secondary)]">
                            {featured?.role || "ENTERPRISE ROLE"}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-secondary)] rounded">
                        {featured?.period || "ENTERPRISE"}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text-primary)] mb-1">
                      {featured?.title}
                    </h3>

                    {featured?.company && (
                      <div className="font-mono text-xs text-[var(--text-secondary)] mb-3 font-semibold flex items-center gap-1.5 flex-wrap">
                        <span className="text-[var(--accent)]">{featured.company}</span>
                        {featured.role && <span>• {featured.role}</span>}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                      {featured?.description}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {featured?.technologies.map((tech, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 text-[9px] font-mono border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* What I Did In This Project */}
                    {featured?.keyContributions && (
                      <div className="space-y-2 mb-6">
                        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-xs" />
                          WHAT I DID IN THIS PROJECT :
                        </div>
                        <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                          {featured.keyContributions.slice(0, 4).map((c, ci) => (
                            <li key={ci} className="flex items-start gap-2">
                              <span className="text-[var(--accent)] font-mono shrink-0">&gt;</span>
                              <span className="leading-relaxed">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)] flex-wrap">
                  {/* Dynamic Calculated Number of Days Worked in Project */}
                  <div suppressHydrationWarning className="flex-1 min-w-[220px] py-2.5 px-4 bg-[var(--accent)] text-white rounded-xs shadow-sm flex items-center justify-between font-mono select-none">
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="text-white shrink-0 animate-pulse" />
                      <div className="flex flex-col text-left">
                        <div suppressHydrationWarning className="text-xs sm:text-[13px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 leading-tight">
                          <span suppressHydrationWarning>{calculateProjectDuration(featured?.period, carouselIdx).daysFormatted} WORKED</span>
                          {calculateProjectDuration(featured?.period, carouselIdx).isOngoing && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          )}
                        </div>
                        <span suppressHydrationWarning className="text-[9.5px] opacity-90 font-medium tracking-tight">
                          {calculateProjectDuration(featured?.period, carouselIdx).durationText} • {calculateProjectDuration(featured?.period, carouselIdx).periodText}
                        </span>
                      </div>
                    </div>
                    <span className="text-[8px] font-extrabold bg-black/25 text-white px-2 py-0.5 rounded-xs tracking-wider uppercase shrink-0">
                      {calculateProjectDuration(featured?.period, carouselIdx).badge}
                    </span>
                  </div>
                  {featured?.websiteUrl && (
                    <a
                      href={featured.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors text-xs font-mono font-semibold tracking-wider uppercase text-center flex items-center gap-1.5 shrink-0"
                    >
                      <span>PLATFORM</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      void hapticSelection();
                      void shareContent({
                        title: featured?.title,
                        text: `${featured?.title} — ${featured?.description ?? ""}`.slice(0, 140),
                        url: "https://www.kranthikumarkatta.in/#projects",
                      });
                    }}
                    className="w-11 h-11 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] flex items-center justify-center transition-colors rounded-sm"
                    aria-label="Share case study"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Metric on Left + Orange CTA on Right matching Oberon img_3.png */}
            <div className="border-t border-[var(--border-color)] grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
              <div className="md:col-span-6 p-6 flex items-center justify-between bg-[var(--bg-card)]">
                <div>
                  <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                    <AnimatedCounter
                      key={`${carouselIdx}-${metrics[carouselIdx % metrics.length].value}`}
                      value={metrics[carouselIdx % metrics.length].value}
                      duration={1.2}
                    />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">
                    {metrics[carouselIdx % metrics.length].label}
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--accent)] font-bold">
                  METRIC 0{carouselIdx + 1}
                </span>
              </div>
              <div className="md:col-span-6 flex">
                <a
                  href="#contact"
                  className="w-full p-6 bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] transition-colors flex items-center justify-center gap-3 font-mono text-xs sm:text-sm font-bold tracking-[0.14em] uppercase"
                >
                  SEE ALL CASE STUDIES
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

        {/* All Resume Projects Accordion */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              ALL RESUME PROJECTS WORKED ON ({projects?.length ?? 0})
            </div>
            <span className="font-mono text-[10px] text-[var(--accent)] font-semibold">
              CLICK ANY PROJECT TO EXPAND &amp; VIEW WORK DETAILS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects?.map((project, i) => (
              <div
                key={i}
                className="border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all rounded-sm shadow-xs"
              >
                <div
                  onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1">
                    {/* Official Project Brand Logo */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-sm border border-[var(--border-color)] bg-[var(--bg-primary)] p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover:border-[var(--accent)] transition-colors overflow-hidden">
                      {project.logo ? (
                        <img
                          src={project.logo}
                          alt={project.company || project.title}
                          className="w-full h-full object-contain rounded-xs"
                        />
                      ) : (
                        <span className="font-mono text-sm font-bold text-[var(--accent)]">
                          0{i + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[var(--accent)]">
                          0{i + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                          {project.title}
                        </h4>
                        {project.company && (
                          <span className="font-mono text-[10px] text-[var(--accent)] px-2 py-0.5 rounded-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30 font-semibold">
                            {project.company}
                          </span>
                        )}
                        {project.role && (
                          <span className="font-mono text-[10px] text-[var(--text-secondary)] px-2 py-0.5 rounded-xs bg-[var(--bg-primary)] border border-[var(--border-color)]">
                            {project.role}
                          </span>
                        )}
                        {project.period && (
                          <span className="font-mono text-[9px] text-[var(--accent)] font-bold ml-auto hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                            <Clock size={10} className="shrink-0" />
                            <span>{calculateProjectDuration(project.period, i).daysFormatted} WORKED</span>
                            <span className="text-[var(--text-secondary)] font-normal">({calculateProjectDuration(project.period, i).durationText})</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedIdx(expandedIdx === i ? null : i);
                    }}
                    className="p-2 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors rounded-sm shrink-0 mt-1 sm:mt-0"
                    aria-label="Toggle details"
                  >
                    {expandedIdx === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-[var(--border-color)] px-5 pb-6 pt-4 bg-[var(--bg-primary)]/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
                          TECHNOLOGIES &amp; ENVIRONMENT:
                        </div>
                        {project.websiteUrl && (
                          <a
                            href={project.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1 rounded-xs"
                          >
                            <span>OFFICIAL PLATFORM</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.technologies.map((t, ti) => (
                          <span key={ti} className="px-2 py-0.5 text-[9px] font-mono border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-xs">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--accent)] mb-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-xs" />
                        WHAT I DID IN THIS PROJECT ({project.keyContributions?.length ?? 0} KEY DELIVERABLES):
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                        {project.keyContributions?.map((c, ci) => (
                          <li key={ci} className="flex items-start gap-2.5">
                            <span className="text-[var(--accent)] font-mono shrink-0 mt-0.5">&gt;</span>
                            <span className="leading-relaxed">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
