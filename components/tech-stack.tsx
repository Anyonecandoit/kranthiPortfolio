"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Cpu, ArrowRight, Zap, CheckCircle2, Layers, Terminal, Cloud, Database, Activity } from "lucide-react";
import Link from "next/link";

/* ─── Tech tools with protocols, metrics, and categories ───────── */
const toolsCatalog = [
  {
    name: "Selenium WebDriver",
    category: "AUTOMATION",
    role: "Cross-browser hybrid regression suites, Page Object Model & parallelization",
    protocol: "W3C WebDriver",
    metric: "60% faster runs",
    icon: Terminal,
  },
  {
    name: "TestNG & BDD",
    category: "AUTOMATION",
    role: "Cucumber BDD, parameterized data-driven suites & test lifecycle runners",
    protocol: "BDD Gherkin",
    metric: "95% pass rate",
    icon: Layers,
  },
  {
    name: "Appium",
    category: "AUTOMATION",
    role: "Native & hybrid mobile test automation across Android and iOS devices",
    protocol: "Mobile JSON Wire",
    metric: "Cross-device",
    icon: Terminal,
  },
  {
    name: "Java & Maven",
    category: "AUTOMATION",
    role: "Enterprise test harnesses, Maven build automation & dependency orchestration",
    protocol: "JVM Enterprise",
    metric: "Core Harness",
    icon: Terminal,
  },
  {
    name: "Rest Assured",
    category: "API & EVENT",
    role: "Automated API schema, authentication tokens & JSON payload assertions",
    protocol: "HTTP/REST",
    metric: "200+ endpoints",
    icon: Activity,
  },
  {
    name: "Apache Kafka",
    category: "API & EVENT",
    role: "Asynchronous transaction processing, event retries & consistency validation",
    protocol: "Kafka Distributed",
    metric: "25% fewer bugs",
    icon: Zap,
  },
  {
    name: "Postman & Swagger",
    category: "API & EVENT",
    role: "Interactive API specification validation, mock servers & contract testing",
    protocol: "OpenAPI Spec",
    metric: "100% contracts",
    icon: Activity,
  },
  {
    name: "Temporal Workflows",
    category: "API & EVENT",
    role: "Distributed durable execution & multi-step transaction workflow validation",
    protocol: "Temporal SDK",
    metric: "Durable flows",
    icon: Zap,
  },
  {
    name: "Apache JMeter",
    category: "PERFORMANCE",
    role: "Distributed load generation, thread pools & transaction latency profiling",
    protocol: "TCP Multi-thread",
    metric: "10,000+ VUs",
    icon: Cpu,
  },
  {
    name: "Datadog & Grafana",
    category: "PERFORMANCE",
    role: "APM distributed tracing, server resource telemetry & bottleneck detection",
    protocol: "Telemetry & APM",
    metric: "Real-time traces",
    icon: Activity,
  },
  {
    name: "Jenkins CI/CD",
    category: "CI/CD & DEVOPS",
    role: "Automated pull request gating pipelines, artifact publishing & alerts",
    protocol: "Jenkinsfile Pipelines",
    metric: "Zero defect gates",
    icon: Terminal,
  },
  {
    name: "Docker & Kubernetes",
    category: "CI/CD & DEVOPS",
    role: "Containerized test runners, Helm chart deployments & environment parity",
    protocol: "K8s & Docker Engine",
    metric: "1-min spinup",
    icon: Cloud,
  },
  {
    name: "Terraform",
    category: "CI/CD & DEVOPS",
    role: "Infrastructure as Code configuration management & Git-based automation",
    protocol: "HCL / Cloud IaC",
    metric: "Reproducible",
    icon: Cloud,
  },
  {
    name: "MySQL & Redis",
    category: "DATABASE",
    role: "Master-slave replication validation, cache consistency & transactional state",
    protocol: "SQL & In-Memory",
    metric: "99.9% integrity",
    icon: Database,
  },
];

const categories = ["ALL", "AUTOMATION", "API & EVENT", "PERFORMANCE", "CI/CD & DEVOPS", "DATABASE"];

/**
 * Ultra High-End Sleek Oberon '07 STACK' Section:
 * - Category filter pills with liquid spring physics
 * - Architectural integration matrix grid with animated layout transitions
 * - Card hover telemetry, protocol badges, and HUD corner brackets
 * - Metrics with AnimatedCounter and system inspection console
 */
export function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const filteredTools =
    selectedCategory === "ALL"
      ? toolsCatalog
      : toolsCatalog.filter((t) => t.category === selectedCategory);

  const activeToolData = toolsCatalog.find((t) => t.name === hoveredTool);

  return (
    <section id="stack" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <SectionLabel number="07" title="STACK" />
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08]"
            >
              Technical Stack
            </motion.h2>
          </div>

          {/* Category Filter Pills with liquid layoutId */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-sm shadow-xs self-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="relative px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors z-10"
              >
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="stackCategoryPill"
                    className="absolute inset-0 bg-[var(--text-primary)] rounded-xs z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={
                    selectedCategory === cat
                      ? "text-[var(--bg-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                >
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Architectural Tool Matrix */}
          <div className="lg:col-span-8">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isHovered = hoveredTool === tool.name;
                  return (
                    <motion.div
                      layout
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      onMouseEnter={() => setHoveredTool(tool.name)}
                      onMouseLeave={() => setHoveredTool(null)}
                      whileHover={{ y: -2 }}
                      className={`p-5 rounded-xs border transition-all duration-200 relative group overflow-hidden ${
                        isHovered
                          ? "border-[var(--accent)] bg-[var(--bg-card)] shadow-card-hover"
                          : "border-[var(--border-color)] bg-[var(--bg-card)]"
                      }`}
                    >
                      {/* Corner HUD brackets */}
                      <span className="absolute top-2 left-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ┌
                      </span>
                      <span className="absolute bottom-2 right-2 text-[var(--accent)] font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ┘
                      </span>

                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors shadow-xs">
                            <Icon size={15} className="text-[var(--accent)]" />
                          </div>
                          <div>
                            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                              {tool.name}
                            </div>
                            <div className="font-mono text-[9px] text-[var(--text-secondary)]">
                              {tool.protocol}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] font-semibold text-[var(--accent)] px-2 py-0.5 rounded-xs bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                          {tool.metric}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans relative z-10">
                        {tool.role}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Copy, Active Telemetry Box & Animated Counters */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] font-semibold leading-relaxed mb-6">
                WE CONNECT YOUR TOOLS INTO ONE SEAMLESS AUTOMATION SYSTEM, ELIMINATING MANUAL WORK AND ACCELERATING RELEASES.
              </p>

              {/* Active Telemetry Box */}
              <div className="p-5 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-sm mb-8 transition-all min-h-[120px] flex flex-col justify-center shadow-card relative overflow-hidden">
                <span className="absolute top-2 right-2 text-[var(--accent)] font-mono text-[9px] select-none">
                  ┐
                </span>
                {activeToolData ? (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={activeToolData.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                        {activeToolData.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded font-semibold">
                        {activeToolData.category}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-primary)] font-mono leading-relaxed mb-1">
                      {activeToolData.role}
                    </p>
                    <div className="font-mono text-[9px] text-[var(--text-secondary)]">
                      PROTOCOL: <span className="text-[var(--text-primary)]">{activeToolData.protocol}</span> • GAIN: <span className="text-[var(--accent)]">{activeToolData.metric}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-[var(--text-primary)] mb-1">
                      <Zap size={13} className="text-[var(--accent)]" />
                      HOVER ANY TOOL TO INSPECT PROTOCOL
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Connects test suites, contract validators, container runtimes, and CI pipelines into a unified engine.
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Grid with AnimatedCounter */}
              <div className="grid grid-cols-2 gap-6 border-t border-[var(--border-color)] pt-8 mb-8">
                {[
                  { num: "17+", label: "TECHNOLOGIES" },
                  { num: "5+", label: "CLOUD PLATFORMS" },
                  { num: "10+", label: "FRAMEWORKS" },
                  { num: "3+", label: "CI/CD ENGINES" },
                ].map((stat, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      <AnimatedCounter value={stat.num} />
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-[var(--accent)] hover:underline"
            >
              EXPLORE OUR 50+ SPECIALIZED SDET TOOLS
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OrbitalDiagram() {
  return null;
}

export function IntegrationsBlock() {
  return null;
}

