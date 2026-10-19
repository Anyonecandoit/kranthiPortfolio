/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { Briefcase, ExternalLink } from "lucide-react";

export function Experience() {
  const { experience } = resumeData;

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          <div className="lg:col-span-8">
            <SectionLabel number="03" title="EXPERIENCE" />
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08]"
            >
              Work Experience
            </motion.h2>
          </div>
          <div className="lg:col-span-4 lg:text-right pt-2">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-medium leading-relaxed">
              CAREER JOURNEY BY YEAR (2021 — PRESENT) • 5+ YEARS OF TEST AUTOMATION &amp; QUALITY LEADERSHIP.
            </p>
          </div>
        </div>

        {/* Enterprise Experience Timeline Arranged as per Years */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-[var(--border-color)]/70">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                WORK EXPERIENCE BY YEAR (2021 — PRESENT)
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-secondary)]">
              <span className="px-2 py-0.5 rounded-xs bg-[var(--accent)]/10 text-[var(--accent)] font-bold">
                5+ YEARS EXPERIENCE
              </span>
              <span>•</span>
              <span>REVERSE CHRONOLOGICAL</span>
            </div>
          </div>

          {/* Timeline Cards with Visual Year Spine */}
          <div className="relative pl-0 sm:pl-8 sm:border-l sm:border-[var(--border-color)] space-y-8">
            {/* Traveling laser beam along the vertical spine */}
            <div className="hidden sm:block absolute -left-[1.5px] top-0 bottom-0 w-[3px] overflow-hidden pointer-events-none">
              <motion.div
                animate={{ y: ["-10%", "110%"] }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                className="w-full h-28 bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent opacity-80 shadow-[0_0_8px_var(--accent)]"
              />
            </div>
            {experience?.map((exp, i) => {
              const isCurrent = exp.period.includes("Present");
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 3 }}
                  className="p-6 sm:p-8 border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all duration-300 relative group shadow-card"
                >
                  {/* Timeline connector dot on left spine (desktop) */}
                  <div className="hidden sm:flex absolute -left-[41px] top-8 w-4 h-4 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] items-center justify-center group-hover:border-[var(--accent)] transition-colors">
                    <span className={`w-2 h-2 rounded-full ${isCurrent ? "bg-[var(--accent)] animate-ping" : "bg-[var(--accent)]"}`} />
                  </div>

                  {/* Left vertical accent indicator bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Corner HUD marks */}
                  <span className="absolute top-2.5 right-2.5 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    ┐
                  </span>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      {/* Authentic Brand Logo */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm border border-[var(--border-color)] bg-[var(--bg-primary)] p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover:border-[var(--accent)] transition-all overflow-hidden">
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="w-full h-full object-contain rounded-xs"
                          />
                        ) : (
                          <Briefcase size={22} className="text-[var(--accent)]" />
                        )}
                      </div>

                      <div>
                        {/* Prominent Year Callout */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className="font-mono text-xs font-bold text-[var(--accent)] px-2.5 py-0.5 rounded-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                            {exp.year || exp.period}
                          </span>
                          {isCurrent && (
                            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              CURRENT ROLE
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                            {exp.location}
                          </span>
                        </div>

                        <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                          {exp.role}
                        </h4>

                        <div className="text-sm font-semibold text-[var(--text-secondary)] font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{exp.company}</span>
                          {exp.websiteUrl && (
                            <a
                              href={exp.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline font-mono"
                            >
                              <span>VISIT</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>

                        {exp.project && (
                          <div className="font-mono text-xs text-[var(--accent)] mt-1.5 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-xs bg-[var(--accent)]" />
                            {exp.project}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono text-xs text-[var(--text-secondary)] rounded self-start shrink-0">
                      {exp.period}
                    </span>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2 mt-4 pt-4 border-t border-[var(--border-color)]/60">
                    {exp.description.map((desc, di) => (
                      <li key={di} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        <span className="text-[var(--accent)] font-mono text-xs mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">&gt;</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack badges */}
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-[var(--border-color)]/50">
                      {exp.technologies.map((tech, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 text-[9px] font-mono border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
