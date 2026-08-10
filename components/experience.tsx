"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { DotMatrixBottom } from "@/components/ui/dot-pattern";

const companyLogos: Record<string, string> = {
  "Barraq Technology Lab India Private Limited": "BT",
  "American Heart Association (Impelsys)": "AHA",
  "PayU Digital Labs Private Limited (Wibmo)": "PU",
};

export function Experience() {
  const { experience } = resumeData;

  // Process steps (Oberon-style "How it works" / process flow)
  const processSteps = [
    { num: ".01", title: "AUDIT & ANALYZE", description: "Review existing workflows, identify bottlenecks, and map testing coverage gaps." },
    { num: ".02", title: "DESIGN FRAMEWORK", description: "Architect modular, data-driven test frameworks tailored to the tech stack." },
    { num: ".03", title: "BUILD & AUTOMATE", description: "Implement automated suites covering functional, regression, and API testing." },
    { num: ".04", title: "OPTIMIZE & SCALE", description: "Integrate with CI/CD, monitor results, and continuously improve test efficiency." },
  ];

  return (
    <section id="experience" className="py-32 px-6 bg-[var(--bg-dark)] text-[var(--text-light)] relative overflow-hidden">
      <DotMatrixBottom className="text-[var(--text-light)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          number="08"
          label="PROCESS"
          title="How I Work"
          description="A systematic approach to building reliable test automation."
          light={false}
        />

        {/* Process flow — horizontal numbered steps (Oberon-style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Step number */}
              <div className="text-4xl md:text-5xl font-medium text-[var(--text-light)]/10 mb-4 font-mono">
                {step.num}
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-light-muted)] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline — work experience */}
        <div className="border-t border-[var(--border-dark)] pt-16">
          <div className="space-y-8">
            {experience?.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-[var(--border-dark)] pb-8 last:border-b-0"
              >
                {/* Left — company info */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-accent font-mono">
                        {companyLogos[exp.company] || String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{exp.role}</div>
                      <div className="text-xs text-[var(--text-light-muted)]">{exp.location}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mt-3">{exp.company}</h3>
                  <div className="label-mono text-[var(--text-light-muted)] text-[0.6rem] mt-1">{exp.period}</div>
                </div>

                {/* Right — details */}
                <div className="md:col-span-8">
                  <ul className="space-y-2">
                    {exp.description.map((desc, di) => (
                      <li key={di} className="flex items-start gap-2 text-sm text-[var(--text-light-muted)]">
                        <span className="text-accent mt-1 shrink-0">→</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech, ti) => (
                        <span
                          key={ti}
                          className="px-2.5 py-1 text-[10px] border border-[var(--border-dark)] text-[var(--text-light-muted)]"
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
