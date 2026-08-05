"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";

const metrics = [
  { value: "5+", label: "Years Experience", sublabel: "Test Automation" },
  { value: "4", label: "Major Projects", sublabel: "Enterprise Scale" },
  { value: "4", label: "Certifications", sublabel: "AWS · ISTQB · Oracle · Azure" },
  { value: "60%", label: "Efficiency Gain", sublabel: "Through Automation" },
];

export function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="About"
          title="Building reliable software through intelligent automation"
        />

        {/* Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed"
        >
          Senior SDET with 5+ years of experience designing test automation
          frameworks for enterprise-grade web, mobile, API, and microservices applications.
          Passionate about building robust test frameworks that ensure software quality.
        </motion.p>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm text-center group hover:border-violet-500/20 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-gray-300 mb-0.5">
                {metric.label}
              </div>
              <div className="text-xs text-gray-500">
                {metric.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
