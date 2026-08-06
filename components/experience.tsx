"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const companyLogos: Record<string, string> = {
  "Barraq Technology Lab India Private Limited": "BT",
  "American Heart Association (Impelsys)": "AHA",
  "PayU Digital Labs Private Limited (Wibmo)": "PU",
};

const companyColors: Record<string, string> = {
  "Barraq Technology Lab India Private Limited": "from-purple-500 to-purple-700",
  "American Heart Association (Impelsys)": "from-rose-500 to-red-600",
  "PayU Digital Labs Private Limited (Wibmo)": "from-emerald-500 to-green-600",
};

export function Experience() {
  const { experience } = resumeData;

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          label="Experience"
          title="Career journey"
          description="5+ years of building test automation frameworks across fintech, healthcare, and payments."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06]" />

          {experience?.map((exp, i) => (
            <Reveal key={i} delay={i * 0.12} y={28}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-[15px] md:left-1/2 -translate-x-1/2 w-[9px] h-[9px] rounded-full bg-violet-500 border-2 border-black z-10" />

                {/* Company logo */}
                <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-white/[0.08] items-center justify-center text-xs font-bold text-violet-300 z-10">
                  {companyLogos[exp.company] || "🏢"}
                </div>

                {/* Content card */}
                <div className={`flex-1 w-full md:ml-0 md:w-[calc(50%-30px)] ${
                  i % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}>
                  <SpotlightCard className="p-5">
                    {/* Role & Period */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
                        {exp.role}
                      </span>
                      {exp.location && (
                        <span className="text-[10px] text-gray-500">· {exp.location}</span>
                      )}
                    </div>

                    {/* Company */}
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {exp.company}
                    </h3>

                    {/* Period */}
                    <p className="text-xs text-gray-500 mb-3">
                      {exp.period}
                    </p>

                    {/* Description bullets */}
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((desc, di) => (
                        <li key={di} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-violet-500 mt-1 shrink-0">→</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech, ti) => (
                          <span
                            key={ti}
                            className="px-2 py-0.5 text-[11px] rounded-full bg-white/[0.05] text-gray-400 border border-white/[0.06]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </SpotlightCard>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}