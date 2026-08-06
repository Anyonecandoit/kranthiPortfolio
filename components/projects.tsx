"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function Projects() {
  const { projects } = resumeData;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Projects"
          title="Featured work"
          description="Enterprise-scale test automation frameworks that deliver measurable impact."
        />

        <div className="space-y-6">
          {projects?.map((project, i) => (
            <Reveal key={i} delay={i * 0.08} y={24}>
              <SpotlightCard className="overflow-hidden">
                {/* Project image (only when a real image URL is provided) */}
                {project.image && (
                  <div className="relative w-full h-48 md:h-56 bg-white/[0.03]">
                    <Image
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      fill
                      sizes="(max-width: 768px) 100vw, 896px"
                      className="object-cover transition-transform duration-500 group-hover/spot:scale-105"
                    />
                  </div>
                )}

                {/* Project header */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{
                          i === 0 ? "🌐" : i === 1 ? "🔗" : i === 2 ? "⚡" : "🔌"
                        }</span>
                        <h3 className="text-xl font-semibold text-white">
                          {project.title}
                        </h3>
                      </div>
                      {project.period && (
                        <span className="text-xs text-gray-500">{project.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, ti) => (
                      <span
                        key={ti}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 transition-colors"
                  >
                    {expandedIdx === i ? (
                      <>Show less <ChevronUp size={14} /></>
                    ) : (
                      <>Show details <ChevronDown size={14} /></>
                    )}
                  </button>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/[0.06]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Contributions</h4>
                            <ul className="space-y-1.5 text-sm text-gray-400">
                              {project.keyContributions?.map((contribution, ci) => (
                                <li key={ci} className="flex items-start gap-2">
                                  <span className="text-violet-400 mt-1">→</span>
                                  <span>{contribution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Links</h4>
                            <div className="flex flex-wrap gap-3">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                >
                                  <Github size={14} /> Code
                                </a>
                              )}
                              {project.demoUrl && (
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                  <ExternalLink size={14} /> Live
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}