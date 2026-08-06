"use client";

import { motion } from "framer-motion";
import { resumeData, Skill } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const categoryColors: Record<string, string> = {
  Automation: "from-violet-500/20 to-purple-500/20 border-violet-500/20",
  Programming: "from-purple-500/20 to-violet-500/20 border-purple-500/20",
  "API Testing": "from-purple-500/20 to-purple-500/20 border-purple-500/20",
  Performance: "from-amber-500/20 to-orange-500/20 border-amber-500/20",
  "Build Tools": "from-emerald-500/20 to-green-500/20 border-emerald-500/20",
  DevOps: "from-rose-500/20 to-pink-500/20 border-rose-500/20",
};

const categoryIcons: Record<string, string> = {
  Automation: "⚡",
  Programming: "💻",
  "API Testing": "🔌",
  Performance: "📊",
  "Build Tools": "🔧",
  DevOps: "🚀",
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

  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Skills"
          title="Technical expertise"
          description="Technologies I use to build reliable, scalable test automation frameworks."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, catIdx) => (
            <Reveal key={category} delay={catIdx * 0.08} y={24}>
              <SpotlightCard className="p-6">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xl">{categoryIcons[category] || "📦"}</span>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    {category}
                  </h3>
                </div>

                {/* Skill items */}
                <div className="space-y-3">
                  {grouped[category].map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIdx * 0.1 + i * 0.05 }}
                      className="group/skill"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-200 group-hover/skill:text-white transition-colors">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <span className="text-xs text-gray-500 group-hover/skill:text-violet-400 transition-colors">
                            {skill.level}%
                          </span>
                        )}
                      </div>
                      {skill.level && (
                        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: catIdx * 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full bg-gradient-to-r ${categoryColors[category] || "from-violet-500 to-purple-500"}`}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}