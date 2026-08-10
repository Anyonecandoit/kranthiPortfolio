"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { GridBackground } from "@/components/ui/grid-background";
import { AnimatedCounter } from "./animated-counter";
import { TestTube, FolderOpen, Award, TrendingUp } from "lucide-react";

export function About() {
  const metrics = useMemo(() => {
    const startYears = (resumeData.experience ?? [])
      .map((e) => Number(e.period?.match(/\d{4}/)?.[0]))
      .filter((y): y is number => Number.isFinite(y));
    const yearsExp = startYears.length
      ? `${Math.max(new Date().getFullYear() - Math.min(...startYears), 1)}+`
      : "5+";

    const efficiencyMatch = (resumeData.achievements ?? [])
      .join(" ")
      .match(/(\d+)%\s*(?:manual testing effort|efficiency)/i);

    const years = startYears.length
      ? Math.max(new Date().getFullYear() - Math.min(...startYears), 1)
      : 5;

    return [
      { value: years, suffix: "+", label: "YEARS EXPERIENCE", icon: TestTube },
      { value: resumeData.projects?.length ?? 0, suffix: "", label: "PROJECTS SHIPPED", icon: FolderOpen },
      { value: resumeData.certifications?.length ?? 0, suffix: "", label: "CERTIFICATIONS", icon: Award },
      { value: efficiencyMatch ? Number(efficiencyMatch[1]) : 60, suffix: "%", label: "EFFICIENCY GAIN", icon: TrendingUp },
    ];
  }, []);

  const capabilities = [
    {
      title: "Test Automation",
      description: "Designing and building robust automation frameworks for enterprise-scale web, mobile, and API applications.",
    },
    {
      title: "Performance Engineering",
      description: "Load testing with JMeter, Grafana dashboards, and infrastructure optimization to reduce costs by 30%.",
    },
    {
      title: "API Validation",
      description: "Comprehensive API test automation covering 200+ endpoints with REST Assured and contract testing.",
    },
    {
      title: "CI/CD Integration",
      description: "Seamless test pipeline integration with Jenkins, GitHub Actions, and Docker-based environments.",
    },
  ];

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <GridBackground columns={4} />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          number="02"
          label="ABOUT"
          title="What I Do"
          description="Senior SDET with 5+ years of experience designing test automation frameworks for enterprise-grade applications."
        />

        {/* Capability cards — 4-column grid (Oberon-style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card-clean p-6 group hover:bg-[var(--bg-card)] transition-colors duration-300"
            >
              <div className="w-10 h-10 border border-accent/30 bg-accent/5 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <span className="text-accent font-mono text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats row — Oberon-style bottom metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--border-color)] pt-12">
          {metrics.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-3xl md:text-4xl font-bold mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="label-mono text-[var(--text-secondary)] text-[0.6rem]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
