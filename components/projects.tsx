"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { DotMatrixBottom } from "@/components/ui/dot-pattern";
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

/* ─── halftone project image placeholder (CSS only, no external imgs) ─ */
function HalftoneProjectImage({ index }: { index: number }) {
  const palettes = [
    { bg: "hsl(260, 15%, 82%)", dot: "hsl(260, 15%, 60%)" },
    { bg: "hsl(200, 12%, 80%)", dot: "hsl(200, 12%, 55%)" },
    { bg: "hsl(340, 10%, 83%)", dot: "hsl(340, 10%, 58%)" },
    { bg: "hsl(30, 14%, 81%)", dot: "hsl(30, 14%, 57%)" },
  ];
  const p = palettes[index % palettes.length];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: p.bg }}>
      {/* Abstract shapes — unique per project (zooms on card hover) */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 60% 40%, ${p.dot} 0%, transparent 70%),
            radial-gradient(circle 80px at 30% 70%, ${p.dot}88 0%, transparent 100%),
            linear-gradient(160deg, ${p.bg} 0%, ${p.dot}44 100%)
          `,
        }}
      />
      {/* Halftone dot overlay */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-35"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.65) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />
      {/* Grid lines overlay for editorial feel */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--bg-dark)] to-transparent" />
    </div>
  );
}

export function Projects() {
  const { projects } = resumeData;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [carouselHover, setCarouselHover] = useState(false);

  // Auto-advance the featured slider (Oberon-style) every 6s, paused on hover.
  useEffect(() => {
    if (carouselHover) return;
    const timer = window.setInterval(() => {
      setCarouselIdx((c) => (c + 1) % (projects?.length || 1));
    }, 6000);
    return () => window.clearInterval(timer);
  }, [carouselHover, projects?.length]);

  const nextProject = () => setCarouselIdx((c) => (c + 1) % (projects?.length || 1));
  const prevProject = () => setCarouselIdx((c) => (c - 1 + (projects?.length || 1)) % (projects?.length || 1));

  // Show current project as the featured carousel item
  const featured = projects?.[carouselIdx] ?? projects?.[0];

  return (
    <section id="projects" className="py-32 px-6 bg-[var(--bg-dark)] text-[var(--text-light)] relative overflow-hidden">
      <DotMatrixBottom className="text-[var(--text-light)]" />
      <GridBackground columns={4} light={false} />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with navigation arrows */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <SectionLabel number="05" title="PROJECTS" light={false} />
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.05em]"
            >
              Case studies
            </motion.h2>
          </div>
          {/* Arrow navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-2"
          >
            <button
              onClick={prevProject}
              className="w-10 h-10 border border-[var(--border-dark)] flex items-center justify-center hover:border-accent/40 hover:bg-white/5 transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft size={16} className="text-[var(--text-light)]" />
            </button>
            <button
              onClick={nextProject}
              className="w-10 h-10 bg-[var(--text-light)] text-[var(--bg-dark)] flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Next project"
            >
              <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Featured project with halftone image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setCarouselHover(true)}
            onMouseLeave={() => setCarouselHover(false)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-20"
          >
            {/* Left — halftone image (zooms on hover) */}
            <div className="group lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden">
              <HalftoneProjectImage index={carouselIdx} />
            </div>

            {/* Right — project info */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between border border-[var(--border-dark)] border-l-0 lg:border-l-0">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-accent text-white flex items-center justify-center text-xs font-bold font-mono">
                    {String(carouselIdx + 1).padStart(2, "0")}
                  </span>
                  <span className="label-mono text-[var(--text-light-muted)] text-[0.6rem]">
                    {featured?.period || ""}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-[-0.04em] mb-4">{featured?.title}</h3>
                <p className="text-[var(--text-light-muted)] text-sm leading-relaxed mb-6">
                  {featured?.description}
                </p>
                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured?.technologies.map((tech, ti) => (
                    <span
                      key={ti}
                      className="px-3 py-1 text-[10px] border border-[var(--border-dark)] text-[var(--text-light-muted)]"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {/* Key contributions (compact) */}
                {featured?.keyContributions && featured.keyContributions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                      KEY CONTRIBUTIONS
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[var(--text-light-muted)]">
                      {featured.keyContributions.slice(0, 3).map((c, ci) => (
                        <li key={ci} className="flex items-start gap-2">
                          <ArrowRight size={12} className="text-accent mt-1 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <a
                href="/tools"
                className="btn-solid inline-flex items-center justify-center w-full mt-4"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.75rem", letterSpacing: "0.1em" }}
              >
                SEE ALL PROJECTS
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom row — big stat + additional project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left — big stat */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="sticky top-32"
            >
              <div className="text-6xl md:text-7xl font-medium tracking-tight mb-2">{projects?.length ?? 0}</div>
              <div className="label-mono text-[var(--text-light-muted)] text-[0.6rem]">PROJECTS SHIPPED</div>
              <div className="mt-6 h-px bg-[var(--border-dark)]" />
              <p className="mt-6 text-sm text-[var(--text-light-muted)] leading-relaxed">
                From cross-border remittance automation to performance engineering at scale.
              </p>
            </motion.div>
          </div>

          {/* Right — compact project cards */}
          <div className="lg:col-span-9 space-y-3">
            {projects?.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="border border-[var(--border-dark)] hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-accent/20 border border-accent/30 flex items-center justify-center text-[10px] font-bold font-mono text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold">{project.title}</h3>
                      {project.period && (
                        <span className="label-mono text-[var(--text-light-muted)] text-[0.55rem] hidden sm:inline">
                          {project.period}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                      className="text-[var(--text-light-muted)] hover:text-accent transition-colors"
                      aria-label={expandedIdx === i ? "Collapse" : "Expand"}
                    >
                      {expandedIdx === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  <p className="text-[var(--text-light-muted)] text-sm leading-relaxed mt-3 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.technologies.slice(0, 5).map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-2 py-0.5 text-[10px] border border-[var(--border-dark)] text-[var(--text-light-muted)]"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="text-[10px] text-[var(--text-light-muted)] py-0.5">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-[var(--border-dark)]">
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                            KEY CONTRIBUTIONS
                          </h4>
                          <ul className="space-y-1.5 text-sm text-[var(--text-light-muted)]">
                            {project.keyContributions?.map((contribution, ci) => (
                              <li key={ci} className="flex items-start gap-2">
                                <ArrowRight size={12} className="text-accent mt-1 shrink-0" />
                                <span>{contribution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
