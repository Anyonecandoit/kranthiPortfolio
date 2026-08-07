"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { DotMatrixBottom } from "@/components/ui/dot-pattern";
import { Check } from "lucide-react";

/* ─── pricing tiers (adapted for a freelancer portfolio) ────────────── */
const tiers = [
  {
    name: "CONSULTATION",
    description: "FOR TEAMS NEEDING\nQUICK EXPERT ADVICE",
    monthlyPrice: 1500,
    annualPrice: 1200,
    features: [
      "1-on-1 strategy session",
      "QA audit & recommendations",
      "Framework selection guidance",
      "Email support",
    ],
    cta: "BOOK A SESSION",
    popular: false,
  },
  {
    name: "PROJECT",
    description: "FOR COMPANIES\nREADY FOR AUTOMATION",
    monthlyPrice: 8500,
    annualPrice: 7200,
    features: [
      "End-to-end test automation",
      "CI/CD pipeline setup",
      "Custom framework build",
      "Priority support",
    ],
    cta: "START A PROJECT",
    popular: true,
  },
  {
    name: "RETAINER",
    description: "FOR ORGANIZATIONS\nWITH ONGOING NEEDS",
    monthlyPrice: 15000,
    annualPrice: 12500,
    features: [
      "Dedicated QA engineering",
      "Continuous test maintenance",
      "Performance monitoring",
      "Enterprise integrations",
    ],
    cta: "GET THE PLAN",
    popular: false,
  },
];

/* ─── main component ───────────────────────────────────────────────── */
export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-32 px-6 bg-[var(--bg-dark)] text-[var(--text-light)] relative overflow-hidden">
      <DotMatrixBottom className="text-[var(--text-light)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <SectionLabel number="10" title="PRICING" light={false} />
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Pricing
            </motion.h2>
          </div>

          {/* Annual / Monthly toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex border border-[var(--border-dark)] overflow-hidden"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 text-xs tracking-widest transition-all duration-300 ${
                annual
                  ? "bg-[var(--text-light)] text-[var(--bg-dark)]"
                  : "text-[var(--text-light-muted)] hover:text-[var(--text-light)]"
              }`}
            >
              ANNUAL
            </button>
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 text-xs tracking-widest transition-all duration-300 ${
                !annual
                  ? "bg-[var(--text-light)] text-[var(--bg-dark)]"
                  : "text-[var(--text-light-muted)] hover:text-[var(--text-light)]"
              }`}
            >
              MONTHLY
            </button>
          </motion.div>
        </div>

        {/* Pricing cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[var(--border-dark)]">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative p-8 flex flex-col ${
                i < tiers.length - 1 ? "border-r border-[var(--border-dark)]" : ""
              } ${tier.popular ? "bg-white/[0.03]" : ""}`}
            >
              {/* Icon placeholder (small squares like Oberon) */}
              <div className="w-10 h-10 bg-white/[0.06] border border-[var(--border-dark)] flex items-center justify-center mb-6">
                <span className="text-[var(--text-light-muted)] text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Tier description */}
              <p
                className="text-[var(--text-light-muted)] text-xs leading-relaxed mb-8 whitespace-pre-line min-h-[48px]"
                style={{ fontFamily: "var(--font-jetbrains-mono)", letterSpacing: "0.05em" }}
              >
                {tier.description}
              </p>

              {/* Spacer to push price to bottom area */}
              <div className="flex-1" />

              {/* Price */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="label-mono text-[var(--text-light-muted)] text-[0.6rem]">
                      {tier.name}
                    </span>
                    {tier.popular && (
                      <span className="label-mono text-accent text-[0.5rem] bg-accent/10 px-2 py-0.5">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl md:text-5xl font-bold tracking-tight">
                      ${annual ? tier.annualPrice.toLocaleString() : tier.monthlyPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-[var(--text-light-muted)] mb-2">/mo</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-sm text-[var(--text-light-muted)] max-w-[180px]">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={14} className="text-accent mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                className={`w-full py-3.5 text-xs tracking-widest font-medium transition-all duration-300 ${
                  tier.popular
                    ? "bg-accent text-white hover:bg-accent-2"
                    : "border border-[var(--border-dark)] text-[var(--text-light)] hover:bg-[var(--text-light)] hover:text-[var(--bg-dark)]"
                }`}
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
