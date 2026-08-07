"use client";

import { motion } from "framer-motion";
import { resumeData, Skill } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { useState } from "react";

const categoryIcons: Record<string, string> = {
  Automation: "01",
  Programming: "02",
  "API Testing": "03",
  Performance: "04",
  "Build Tools": "05",
  DevOps: "06",
};

export function Skills() {
  const { skills } = resumeData;
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
  const categories = Object.keys(grouped);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayCategories = activeCategory
    ? categories.filter((c) => c === activeCategory)
    : categories;

  return (
    <section id="skills" className="py-32 px-6 bg-[var(--bg-dark)] text-[var(--text-light)]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          number="03"
          label="EXPERTISE"
          title="Technical Stack"
          description="Technologies I use to build reliable, scalable test automation frameworks."
          light={false}
        />

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 text-xs transition-colors border ${
              activeCategory === null
                ? "border-accent text-accent bg-accent/10"
                : "border-[var(--border-dark)] text-[var(--text-light-muted)] hover:text-[var(--text-light)] hover:border-[var(--border-dark)]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-2 text-xs transition-colors border ${
                activeCategory === cat
                  ? "border-accent text-accent bg-accent/10"
                  : "border-[var(--border-dark)] text-[var(--text-light-muted)] hover:text-[var(--text-light)] hover:border-[var(--border-dark)]"
              }`}
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Skills grid — Oberon-style numbered categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category, catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: catIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border border-[var(--border-dark)] p-6 hover:border-accent/30 transition-colors duration-300"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 bg-accent text-white flex items-center justify-center text-xs font-bold font-mono">
                  {categoryIcons[category] || String(catIdx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                  {category}
                </h3>
              </div>

              {/* Skill items with progress */}
              <div className="space-y-4">
                {grouped[category].map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm">{skill.name}</span>
                      {skill.level && (
                        <span className="text-xs text-[var(--text-light-muted)]">{skill.level}%</span>
                      )}
                    </div>
                    {skill.level && (
                      <div className="h-1 bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: catIdx * 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-accent"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
