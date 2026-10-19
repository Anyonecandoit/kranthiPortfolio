"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { Plus, Minus, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

/* ─── Recruiter & Technical FAQs for Kranthi's SDET Portfolio ───── */
const faqs = [
  {
    q: "What roles are you currently looking for?",
    a: "I am actively open to Senior SDET, Lead QA Automation Engineer, and Test Automation Architect positions — both full-time permanent roles and high-impact technical contracts.",
  },
  {
    q: "What is your primary technical stack for test automation?",
    a: "My primary languages are Java (Oracle Certified Professional) and Python. For web and mobile E2E, I use Selenium WebDriver and Playwright. For API testing, I specialize in REST Assured, Postman, and Apache Kafka event streams. For performance, I build JMeter (10,000+ VUs) and k6 distributed test rigs.",
  },
  {
    q: "How do you eliminate flakiness in large automated test suites?",
    a: "I isolate test state, enforce atomic test design, replace static sleeps with dynamic state-polling assertions, mock unstable third-party dependencies with WireMock, and quarantine flaky tests with automated alerting while diagnosing root causes.",
  },
  {
    q: "What domain experience do you bring to an engineering team?",
    a: "I bring deep expertise across Fintech, Payment Gateways (PayU, 3D Secure 2.0, EMVCo, PCI-DSS compliance), Cross-Border Remittance (Barraq, ISO 20022, SWIFT, multi-currency processing), and Healthcare Learning Platforms (American Heart Association / Impelsys).",
  },
  {
    q: "What is your location and work preference?",
    a: "I am based in Bangalore, India, and open to hybrid roles in Bangalore or remote opportunities globally. I am also open to relocation for compelling full-time roles.",
  },
  {
    q: "How can we review your technical work and code samples?",
    a: "You can explore my projects right here in the Projects section, check out my credentials in the Intro, download my resume PDF, or reach out directly to schedule a technical architecture walkthrough.",
  },
];

/**
 * Authentic Oberon '11 FAQ' Section:
 * Focuses on genuine recruiter and engineering hiring questions.
 */
export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="mb-14">
          <SectionLabel number="11" title="FAQ" />
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08]"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Attribution Note */}
          <div className="lg:col-span-4">
            <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 rounded-sm shadow-sm sticky top-28">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-[var(--accent)] text-white font-mono text-[11px] font-bold flex items-center justify-center">
                  KK
                </div>
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    KRANTHI KUMAR KATTA
                  </div>
                  <div className="font-mono text-[10px] uppercase text-[var(--text-secondary)]">
                    SENIOR SDET &amp; AUTOMATION ARCHITECT
                  </div>
                </div>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] leading-relaxed font-semibold">
                ANSWERS TO FREQUENT RECRUITER &amp; TECHNICAL QUESTIONS ABOUT MY EXPERIENCE, TOOLING, AND AVAILABILITY.
              </p>
            </div>
          </div>

          {/* Right Column: 2-Column FAQ Grid */}
          <div className="lg:col-span-8 border border-[var(--border-color)] bg-[var(--bg-card)] divide-y divide-[var(--border-color)] shadow-card overflow-hidden">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`p-6 transition-all duration-300 hover:bg-[var(--bg-primary)]/40 relative ${
                  openIdx === i ? "bg-[var(--bg-primary)]/25" : ""
                }`}
              >
                {/* Left accent indicator bar when active */}
                {openIdx === i && (
                  <motion.div
                    layoutId="faqIndicator"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-start justify-between gap-4 text-left group"
                  aria-expanded={openIdx === i}
                >
                  <span className="font-medium text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIdx === i ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="mt-1 w-6 h-6 border border-[var(--border-color)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors rounded-xs shrink-0 bg-[var(--bg-card)] shadow-xs"
                  >
                    <Plus size={14} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)] pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: HAVE A QUESTION? -> GET IN TOUCH */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)] font-mono font-bold text-sm">+</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              HAVE A SPECIFIC QUESTION OR WANT TO DISCUSS AN OPPORTUNITY?
            </span>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors text-xs font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 rounded-sm shrink-0"
          >
            GET IN TOUCH DIRECTLY
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
