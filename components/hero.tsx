"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Database,
  Cpu,
  Activity,
  Zap,
  Download,
  Award,
  LayoutGrid,
  Radio,
} from "lucide-react";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedHeroName } from "@/components/animated-hero-name";
import { HeroRadar, type RadarNode } from "@/components/hero-radar";

/**
 * All official Technical Skills directly extracted from Kranthi's resume
 */
const resumeSkillsMatrix = [
  {
    category: "Automation Testing",
    code: "AUTO",
    badge: "CORE",
    skills: [
      { name: "Selenium WebDriver", desc: "Cross-browser grid automation & POM architecture" },
      { name: "Hybrid Framework", desc: "Modular keyword & data-driven harnesses" },
      { name: "TestNG", desc: "Test runner, listeners, parallel execution & assertions" },
      { name: "Cucumber (BDD)", desc: "Behavior-driven development & Gherkin feature files" },
      { name: "Appium", desc: "Mobile automation for Android & iOS native/hybrid apps" },
    ],
  },
  {
    category: "API & Event Systems",
    code: "API",
    badge: "FINTECH",
    skills: [
      { name: "Rest Assured", desc: "HTTP/REST automated schema & JSON/XML validation" },
      { name: "Apache Kafka", desc: "Asynchronous transaction streaming & retry mechanisms" },
      { name: "Postman", desc: "API collection runners, mock servers & environment configs" },
      { name: "Swagger UI", desc: "OpenAPI contract verification & interactive docs" },
      { name: "Temporal Workflows", desc: "Distributed durable state execution & sagas" },
    ],
  },
  {
    category: "CI/CD & DevOps",
    code: "DEVOPS",
    badge: "PIPELINES",
    skills: [
      { name: "Jenkins", desc: "Automated PR gating pipelines & zero-defect quality gates" },
      { name: "Docker", desc: "Containerized testing runtime & isolated containers" },
      { name: "Kubernetes", desc: "Cluster deployments, Helm charts & pod orchestration" },
      { name: "Terraform", desc: "Infrastructure as Code & configuration management" },
      { name: "Maven & Nexus", desc: "Java build automation & artifact repository" },
      { name: "Argo CD", desc: "GitOps continuous delivery & declarative deployment" },
    ],
  },
  {
    category: "Languages & Databases",
    code: "CORE",
    badge: "DATA",
    skills: [
      { name: "Java", desc: "Core OOP, collections, multithreading & JVM harnesses" },
      { name: "SQL", desc: "Complex queries, join assertions & data validation" },
      { name: "MySQL (Master-Slave)", desc: "Master-slave replication & transactional consistency" },
      { name: "Redis", desc: "In-memory caching, key-value stores & session state" },
      { name: "GCP", desc: "Google Cloud Platform microservices infrastructure" },
    ],
  },
  {
    category: "Performance & Telemetry",
    code: "PERF",
    badge: "SCALE",
    skills: [
      { name: "Apache JMeter", desc: "10,000+ virtual user load, stress & latency profiling" },
      { name: "Datadog", desc: "APM distributed tracing, alert monitors & metrics" },
      { name: "Grafana", desc: "Real-time telemetry dashboards & system metrics" },
    ],
  },
  {
    category: "Version Control & QA Tools",
    code: "TOOLS",
    badge: "QA TOOLS",
    skills: [
      { name: "Git & GitLab", desc: "Version control, branching strategies & PR reviews" },
      { name: "JIRA & Confluence", desc: "Agile sprint planning, defect tracking & test plans" },
      { name: "LambdaTest", desc: "Cloud cross-browser & mobile device execution" },
      { name: "Airflow & Swagger", desc: "Workflow orchestration & API contract specs" },
    ],
  },
];

export function Hero() {
  const { summary } = resumeData;
  const [selectedRadarNode, setSelectedRadarNode] = useState<RadarNode | null>(null);
  const [matrixFilter, setMatrixFilter] = useState<string>("ALL");
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; desc: string; cat: string } | null>(null);

  // 3D Tilt motion values
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-180, 180], [6, -6]), { stiffness: 220, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-180, 180], [-6, 6]), { stiffness: 220, damping: 25 });

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
  };

  const filteredMatrix =
    matrixFilter === "ALL"
      ? resumeSkillsMatrix
      : resumeSkillsMatrix.filter((m) => m.code === matrixFilter);

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]"
    >
      {/* Continuous architectural background grid with orange guide line */}
      <GridBackground columns={4} showAccentGuide={true} />

      <div
        className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-16 sm:pt-20 lg:pt-16 pb-4 sm:pb-6 flex flex-col justify-between"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column — Badge, Typography, CTA */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Live Specialization & Location Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2.5 sm:mb-3 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs cursor-default select-none hover:border-[var(--accent)] transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="flex items-end gap-[1.5px] h-2.5 shrink-0" aria-hidden="true">
                <motion.span
                  animate={{ height: ["3px", "10px", "4px", "8px", "3px"] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[2px] bg-emerald-500 rounded-full"
                />
                <motion.span
                  animate={{ height: ["7px", "3px", "10px", "4px", "7px"] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                  className="w-[2px] bg-emerald-500 rounded-full"
                />
                <motion.span
                  animate={{ height: ["4px", "8px", "3px", "9px", "4px"] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="w-[2px] bg-emerald-500 rounded-full"
                />
              </span>
              <span className="font-mono text-[9.5px] tracking-wider text-[var(--text-secondary)] uppercase font-semibold">
                SDET 2 • FINTECH &amp; DISTRIBUTED MICROSERVICES • BANGALORE, INDIA
              </span>
            </motion.div>

            <SectionLabel number="01" title="INTRO" className="mb-2 sm:mb-2.5" />

            {/* Role Pre-Title */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-1.5 flex items-center gap-2"
            >
              <span className="w-2.5 h-0.5 bg-[var(--accent)]" />
              SDET 2 &amp; QA AUTOMATION ENGINEER
            </motion.div>

            {/* Display Headline with Sequential Letter-by-Letter Timing Animation starting with 'K' */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-bold tracking-tight text-[var(--text-primary)] leading-[1.06] mb-2 sm:mb-2.5">
              <AnimatedHeroName />
            </h1>

            {/* Monospace uppercase architectural subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="space-y-1.5 mb-3 sm:mb-3.5 max-w-xl"
            >
              <p className="font-mono text-[11px] sm:text-xs tracking-[0.14em] uppercase text-[var(--accent)] font-semibold leading-snug">
                5+ YEARS ARCHITECTING ENTERPRISE TEST SUITES • FINTECH, PAYMENTS &amp; HEALTHCARE
              </p>
              <p className="text-xs sm:text-[12.5px] text-[var(--text-secondary)] opacity-90 leading-relaxed font-sans">
                {summary || "Senior SDET with 5+ years of specialized experience designing, developing, and executing comprehensive test automation frameworks for enterprise-grade web, mobile, API, and microservices architectures."}
              </p>
            </motion.div>

            {/* Core Technical Expertise Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              className="w-full max-w-xl mb-3.5 sm:mb-4 space-y-1.5 pt-2 border-t border-[var(--border-color)]/70"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-secondary)] font-bold flex items-center gap-1.5">
                  <Zap size={10} className="text-[var(--accent)]" />
                  CORE TECHNICAL EXPERTISE :
                </span>
                <span className="font-mono text-[8.5px] text-[var(--accent)] font-semibold">5+ YRS PROVEN</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono">
                <div className="p-1.5 px-2 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xs hover:border-[var(--accent)] transition-colors">
                  <div className="text-[8.5px] uppercase tracking-wider text-[var(--accent)] font-bold mb-0.5">Automation &amp; E2E</div>
                  <div className="text-[10.5px] text-[var(--text-primary)] font-medium leading-tight">Selenium • Hybrid Framework • TestNG • BDD • Appium</div>
                </div>
                <div className="p-1.5 px-2 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xs hover:border-[var(--accent)] transition-colors">
                  <div className="text-[8.5px] uppercase tracking-wider text-[var(--accent)] font-bold mb-0.5">API &amp; Event Systems</div>
                  <div className="text-[10.5px] text-[var(--text-primary)] font-medium leading-tight">Rest Assured • Apache Kafka • Postman • Swagger UI</div>
                </div>
                <div className="p-1.5 px-2 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xs hover:border-[var(--accent)] transition-colors">
                  <div className="text-[8.5px] uppercase tracking-wider text-[var(--accent)] font-bold mb-0.5">Performance &amp; Scale</div>
                  <div className="text-[10.5px] text-[var(--text-primary)] font-medium leading-tight">Apache JMeter (10,000+ VUs) • Latency Profiling</div>
                </div>
                <div className="p-1.5 px-2 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xs hover:border-[var(--accent)] transition-colors">
                  <div className="text-[8.5px] uppercase tracking-wider text-[var(--accent)] font-bold mb-0.5">CI/CD, Cloud &amp; DB</div>
                  <div className="text-[10.5px] text-[var(--text-primary)] font-medium leading-tight">Jenkins • Docker • Kubernetes • Terraform • MySQL</div>
                </div>
              </div>

              {/* Certifications Quick Bar */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mr-1 flex items-center gap-1">
                  <Award size={9} className="text-[var(--accent)]" />
                  CREDENTIALS:
                </span>
                <span className="px-1.5 py-0.5 rounded-xs border border-[var(--border-color)] bg-[var(--bg-card)] font-mono text-[8.5px] text-[var(--text-primary)] font-semibold">
                  DevOps Training – Eureka
                </span>
                <span className="px-1.5 py-0.5 rounded-xs border border-[var(--border-color)] bg-[var(--bg-card)] font-mono text-[8.5px] text-[var(--text-primary)] font-semibold">
                  CI/CD Pipelines
                </span>
                <span className="px-1.5 py-0.5 rounded-xs border border-[var(--border-color)] bg-[var(--bg-card)] font-mono text-[8.5px] text-[var(--text-primary)] font-semibold">
                  Docker, K8s &amp; Terraform
                </span>
                <span className="px-1.5 py-0.5 rounded-xs border border-[var(--border-color)] bg-[var(--bg-card)] font-mono text-[8.5px] text-[var(--text-primary)] font-semibold">
                  Git &amp; Build Automation
                </span>
              </div>
            </motion.div>

            {/* Flush triple CTA bar with high-end hover micro-interactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="group relative flex flex-col sm:flex-row items-stretch w-full sm:w-auto border border-[var(--border-color)] overflow-hidden shadow-card bg-[var(--bg-card)] rounded-sm"
            >
              <a
                href="#contact"
                className="relative px-5 py-2.5 sm:px-6 sm:py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 text-xs font-mono font-bold tracking-[0.14em] uppercase text-center inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  GET IN TOUCH
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              <a
                href="#experience"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors duration-200 text-xs font-mono font-bold tracking-[0.14em] uppercase text-center border-t sm:border-t-0 sm:border-l border-[var(--border-color)]"
              >
                EXPERIENCE BY YEAR
              </a>
              <a
                href="/resume/kranthi-kumar-katta-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-200 text-xs font-mono font-bold tracking-[0.14em] uppercase text-center border-t sm:border-t-0 sm:border-l border-[var(--border-color)] inline-flex items-center justify-center gap-1.5"
              >
                <Download size={13} />
                RESUME (PDF)
              </a>
            </motion.div>
          </div>

          {/* Right Column — Separated into Two Distinct Boxes to Distinguish Radar & Skills */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-3 w-full max-w-[490px] pt-0">
            {/* BOX 1: TECHNICAL RADAR (SDET LIVE TELEMETRY) */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative w-full rounded-sm border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 sm:p-3 shadow-card-hover overflow-hidden group/canvas cursor-default"
            >
              {/* Subtle background coordinate grid */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Dynamic Header */}
              <div className="relative z-20 flex items-center justify-between border-b border-[var(--border-color)]/70 pb-1.5 pointer-events-auto">
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-[var(--accent)] animate-pulse" />
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--text-primary)] tracking-wider uppercase">
                    TECHNICAL RADAR
                  </span>
                  <span className="font-mono text-[8.5px] px-1.5 py-0.5 rounded-xs bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                    LIVE TELEMETRY
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-500 font-semibold">360° ACTIVE SWEEP</span>
                </div>
              </div>

              {/* Compact Cybernetic SDET Radar Constellation with Sweep Blip Detection */}
              <div className="my-1">
                <HeroRadar
                  activeNodeId={selectedRadarNode?.id || null}
                  onSelectNode={(node) => {
                    setSelectedRadarNode(node);
                    if (node) setHoveredSkill(null);
                  }}
                />
              </div>

              {/* Corner HUD markers */}
              <span className="absolute top-1.5 left-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">┌</span>
              <span className="absolute top-1.5 right-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">┐</span>
              <span className="absolute bottom-1.5 left-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">└</span>
              <span className="absolute bottom-1.5 right-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">┘</span>
            </motion.div>

            {/* BOX 2: TECHNICAL SKILLS MATRIX (RESUME SPECIFICATIONS - CRISP 2D RENDERING) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{
                WebkitFontSmoothing: "antialiased",
                textRendering: "optimizeLegibility",
              }}
              className="relative w-full rounded-sm border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-card-hover overflow-hidden group/matrix cursor-default"
            >
              {/* Category Filter Pills Header */}
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2 pb-1.5 border-b border-[var(--border-color)]/70">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid size={11} className="text-[var(--accent)]" />
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    SKILLS MATRIX
                  </span>
                  <span className="font-mono text-[8.5px] px-1.5 py-0.5 rounded-xs bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                    RESUME
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["ALL", "AUTO", "API", "DEVOPS", "CORE", "PERF", "TOOLS"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMatrixFilter(cat)}
                      className={`px-1.5 py-0.5 text-[8.5px] font-mono font-bold transition-all rounded-xs border cursor-pointer ${
                        matrixFilter === cat
                          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                          : "border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Categories of Real Resume Technical Skills — Crystal Clear Text */}
              <div className="overflow-y-auto max-h-[130px] sm:max-h-[145px] space-y-2 pr-1.5 scrollbar-thin overscroll-contain">
                {filteredMatrix.map((group) => (
                  <div
                    key={group.category}
                    className="p-2 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xs hover:border-[var(--accent)]/50 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[9.5px] sm:text-[10.5px] font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-xs bg-[var(--accent)]" />
                        {group.category}
                      </span>
                      <span className="font-mono text-[8px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-xs">
                        {group.badge}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill.name}
                          onMouseEnter={() => {
                            setHoveredSkill({
                              name: skill.name,
                              desc: skill.desc,
                              cat: group.category,
                            });
                            setSelectedRadarNode(null);
                          }}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className="px-2 py-0.5 text-[9.5px] sm:text-[10px] font-mono font-medium border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-[1.03] transition-all rounded-xs cursor-pointer select-none"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Telemetry Box — Inspects hovered skill or active radar blip */}
              <div className="relative z-20 border-t border-[var(--border-color)]/60 pt-2 min-h-[30px] flex items-center justify-between mt-2">
                {hoveredSkill ? (
                  <motion.div
                    key={hoveredSkill.name}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex items-center justify-between font-mono text-[9.5px]"
                  >
                    <div className="flex items-center gap-1.5 truncate flex-1">
                      <span className="font-bold text-[var(--accent)] uppercase">{hoveredSkill.name}</span>
                      <span className="text-[var(--text-secondary)] opacity-50">•</span>
                      <span className="text-[var(--text-secondary)] text-[9px] truncate">{hoveredSkill.desc}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-xs bg-[var(--accent)]/10 text-[var(--accent)] font-semibold text-[8px] uppercase shrink-0 ml-1.5">
                      {hoveredSkill.cat}
                    </span>
                  </motion.div>
                ) : selectedRadarNode ? (
                  <motion.div
                    key={selectedRadarNode.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex items-center justify-between font-mono text-[9.5px]"
                  >
                    <div className="flex items-center gap-1.5 truncate flex-1">
                      <span className="font-bold text-[var(--accent)] uppercase">{selectedRadarNode.name}</span>
                      <span className="text-[var(--text-secondary)] opacity-50">•</span>
                      <span className="text-[var(--text-secondary)] text-[9px] truncate">{selectedRadarNode.capability}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1.5">
                      <span className="text-[8px] font-semibold text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded-xs">
                        {selectedRadarNode.passRate} PASS
                      </span>
                      <span className="px-1 py-0.5 rounded-xs bg-[var(--accent)]/10 text-[var(--accent)] font-semibold text-[8px] uppercase">
                        {selectedRadarNode.latency}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-full flex items-center justify-between font-mono text-[9px] text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Zap size={10} className="text-[var(--accent)] animate-pulse" />
                      HOVER ANY RADAR BLIP OR SKILL FOR TELEMETRY
                    </span>
                    <span className="text-[var(--accent)] font-bold tracking-wider">30+ SKILLS &gt;</span>
                  </div>
                )}
              </div>
              {/* Corner HUD markers */}
              <span className="absolute top-1.5 left-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">┌</span>
              <span className="absolute top-1.5 right-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">┐</span>
              <span className="absolute bottom-1.5 left-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">└</span>
              <span className="absolute bottom-1.5 right-1.5 text-[var(--accent)] font-mono text-[8.5px] font-bold select-none">┘</span>
            </motion.div>
          </div>
        </div>

        {/* 3-Column Metrics Row with Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-3.5"
        >
          <motion.div
            whileHover={{ y: -2, borderColor: "var(--accent)" }}
            transition={{ duration: 0.2 }}
            className="relative p-3.5 sm:p-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-sm transition-colors group cursor-default"
          >
            <span className="absolute -top-1.5 -left-1 text-[var(--accent)] font-mono text-sm leading-none font-bold group-hover:scale-125 transition-transform">
              ┌
            </span>
            <div className="font-mono text-xs md:text-sm font-bold tracking-[0.08em] text-[var(--text-primary)] mb-0.5 group-hover:text-[var(--accent)] transition-colors">
              <AnimatedCounter value="5+" /> YEARS SDET EXPERIENCE
            </div>
            <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-sans">
              Specialized in scalable test frameworks &amp; distributed systems
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, borderColor: "var(--accent)" }}
            transition={{ duration: 0.2 }}
            className="relative p-3.5 sm:p-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-sm transition-colors group cursor-default"
          >
            <span className="absolute -top-1.5 -left-1 text-[var(--accent)] font-mono text-sm leading-none font-bold group-hover:scale-125 transition-transform">
              ┌
            </span>
            <div className="font-mono text-xs md:text-sm font-bold tracking-[0.08em] text-[var(--text-primary)] mb-0.5 group-hover:text-[var(--accent)] transition-colors">
              <AnimatedCounter value="1000+" /> AUTOMATED TEST SUITES
            </div>
            <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-sans">
              Selenium, Playwright, REST Assured &amp; JMeter
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, borderColor: "var(--accent)" }}
            transition={{ duration: 0.2 }}
            className="relative p-3.5 sm:p-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-sm transition-colors group cursor-default"
          >
            <span className="absolute -top-1.5 -left-1 text-[var(--accent)] font-mono text-sm leading-none font-bold group-hover:scale-125 transition-transform">
              ┌
            </span>
            <div className="font-mono text-xs md:text-sm font-bold tracking-[0.08em] text-[var(--text-primary)] mb-0.5 group-hover:text-[var(--accent)] transition-colors">
              <AnimatedCounter value="3" /> ENTERPRISE PLATFORMS
            </div>
            <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-sans">
              Barraq Remittance, PayU Gateway &amp; AHA Atlas
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
