"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { Plus, Minus } from "lucide-react";

/* ─── FAQ data (original content) ─────────────────────────────────── */
const faqs = [
  {
    q: "What types of projects do you take on?",
    a: "I specialize in test automation frameworks, performance engineering, full-stack web applications, and AI/LLM integrations. I work best on projects that need reliable, scalable quality infrastructure — from greenfield builds to legacy modernization.",
  },
  {
    q: "Do clients need technical knowledge to get started?",
    a: "Not at all. I translate business requirements into technical solutions. You describe what you need — faster releases, better test coverage, a new feature — and I handle the architecture, implementation, and documentation.",
  },
  {
    q: "Which tools and platforms do you work with?",
    a: "My core stack includes Java, Python, TypeScript, Selenium, Playwright, Cypress, Next.js, React, AWS, Docker, PostgreSQL, and Redis. I adapt to whatever your team already uses and recommend additions where they add real value.",
  },
  {
    q: "How long does a typical project take?",
    a: "A focused test automation framework: 2-4 weeks. A full-stack web application: 6-12 weeks. Performance engineering engagement: 2-6 weeks. Every project starts with a clear scope and milestone plan so there are no surprises.",
  },
  {
    q: "Can you work with our existing software and workflows?",
    a: "Yes — that is actually where I add the most value. I integrate into your existing CI/CD pipelines, extend current test suites, and improve what is already there rather than forcing a rewrite. The goal is to enhance, not replace.",
  },
  {
    q: "What is your approach to documentation?",
    a: "Every framework I build ships with comprehensive documentation: architecture diagrams, setup guides, contribution guidelines, and runbooks. I believe code that cannot be understood by your team in 6 months is code that will eventually be replaced.",
  },
];

/* ─── single FAQ item ─────────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }: {
  faq: typeof faqs[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--border-color)]">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-base md:text-lg font-medium text-[var(--text-primary)] group-hover:text-accent transition-colors pr-4">
          {faq.q}
        </h3>
        <span className="mt-1 shrink-0 w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] group-hover:text-accent transition-colors">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // first open by default

  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative overflow-hidden">
      <GridBackground columns={4} />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel number="11" title="HELP" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-16"
        >
          FAQ
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ grid — 2-column on desktop */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FaqItem
                    faq={faq}
                    isOpen={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar — quote + CTA (like img_8 bottom area) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <p
                className="text-xs text-[var(--text-secondary)] tracking-widest uppercase mb-3"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                KRANTHI KUMAR, ENGINEER
              </p>
              <blockquote className="text-sm leading-relaxed text-[var(--text-primary)] italic">
                &ldquo;Everything you need to know about building reliable, automated software systems — from architecture to execution.&rdquo;
              </blockquote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p
                className="text-xs text-[var(--text-secondary)] tracking-widest uppercase mb-4"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                GOT SOME OTHER QUESTIONS?
              </p>
              <a
                href="mailto:kranthikumarkattatech@gmail.com"
                className="btn-solid inline-flex items-center justify-center w-full"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.75rem", letterSpacing: "0.1em" }}
              >
                SEND MESSAGE
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
