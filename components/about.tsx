"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function About() {
  // Derive metric values from the resume data so they can't drift from the source of truth.
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

    return [
      { value: yearsExp, label: "Years Experience", sublabel: "Test Automation", color: "text-violet-400", icon: "⏱" },
      { value: String(resumeData.projects?.length ?? 0), label: "Major Projects", sublabel: "Enterprise Scale", color: "text-blue-400", icon: "📁" },
      { value: String(resumeData.certifications?.length ?? 0), label: "Certifications", sublabel: "AWS · ISTQB · Oracle · Azure", color: "text-amber-400", icon: "🏆" },
      { value: efficiencyMatch ? `${efficiencyMatch[1]}%` : "60%", label: "Efficiency Gain", sublabel: "Through Automation", color: "text-emerald-400", icon: "🚀" },
    ];
  }, []);
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="About"
          title="Building reliable software through intelligent automation"
        />

        {/* Statement */}
        <Reveal delay={0.2} y={24}>
          <p className="text-center text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            Senior SDET with 5+ years of experience designing test automation
            frameworks for enterprise-grade web, mobile, API, and microservices applications.
            Passionate about building robust test frameworks that ensure software quality.
          </p>
        </Reveal>

        {/* Metric Cards */}
        <Reveal delay={0.3} y={24}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 0.08} y={20}>
                <SpotlightCard className="p-6 text-center">
                  <div className="text-2xl mb-2">{metric.icon}</div>
                  <div className={`text-3xl md:text-4xl font-bold mb-1 ${metric.color} transition-colors`}>
                    {metric.value}
                  </div>
                  <div className="text-sm font-medium text-gray-300 mb-0.5">
                    {metric.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {metric.sublabel}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
