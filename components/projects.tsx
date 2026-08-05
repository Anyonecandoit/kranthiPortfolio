"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Github, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";

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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden hover:border-white/[0.1] transition-all duration-300"
            >
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
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/[0.06] pt-5">
                      <h4 className="text-sm font-semibold text-white mb-3">Key Contributions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getProjectDetails(i).map((detail, di) => (
                          <div key={di} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-violet-400 mt-0.5">→</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.1] hover:text-white transition-all"
                        >
                          <Github size={16} /> View on GitHub
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getProjectDetails(i: number): string[] {
  const details: string[][] = [
    ["Modular keyword-driven test framework using Playwright and Java", "ISO8583 and SWIFT message validation", "Kafka event-driven validation pipelines", "Data-driven testing with parameterized suites"],
    ["Contract testing frameworks with REST Assured", "1000+ automated test suites", "Docker-based test environments", "CI/CD integration with Jenkins"],
    ["10,000+ concurrent users load testing", "Grafana real-time monitoring dashboards", "k6 cloud-native load testing", "30% infrastructure cost reduction"],
    ["200+ API endpoints tested", "Contract testing with Pact framework", "35% reduction in production defects", "Automated regression test suites"],
  ];
  return details[i] || details[0];
}
