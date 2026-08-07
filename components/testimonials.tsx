"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { DotMatrixBottom } from "@/components/ui/dot-pattern";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

/* ─── testimonial data (original content) ─────────────────────────── */
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Engineering Manager, PayU",
    text: "Kranthi completely transformed our QA pipeline. The automation framework he built reduced our regression cycle from 3 days to under 4 hours. His technical depth and communication are outstanding.",
    rating: 5,
  },
  {
    name: "Rajesh Varma",
    role: "CTO, Barraq Technology Lab",
    text: "One of the most disciplined engineers I have worked with. Kranthi built a cross-border remittance test suite from scratch that caught critical bugs before production. His attention to edge cases is remarkable.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Product Lead, Impelsys",
    text: "Kranthi's performance engineering work on our healthcare platform was game-changing. Load test results directly informed architecture decisions that improved throughput by 60%.",
    rating: 5,
  },
  {
    name: "Suresh Reddy",
    role: "VP Engineering, Wibmo",
    text: "Kranthi brings a rare combination of automation expertise and genuine curiosity. He does not just write tests — he understands the product deeply and finds issues nobody else catches.",
    rating: 5,
  },
  {
    name: "Deepa Nair",
    role: "QA Director, GlobalEdge",
    text: "Kranthi mentored our junior QA team with patience and clarity. Within three months, the team was writing production-grade automation independently. His documentation is also exemplary.",
    rating: 5,
  },
];

/* ─── halftone portrait placeholder (CSS-driven, no external images) ─ */
function HalftonePortrait({ index }: { index: number }) {
  // Each portrait gets a unique subtle hue-shift so the row feels varied
  const hues = ["260", "200", "340", "30", "170"];
  const hue = hues[index % hues.length];

  return (
    <div className="relative w-full aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Abstract silhouette using CSS gradients — unique per portrait */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 35%, hsl(${hue}, 8%, 72%) 0%, transparent 70%),
            radial-gradient(ellipse 40% 25% at 50% 68%, hsl(${hue}, 8%, 68%) 0%, transparent 60%),
            linear-gradient(180deg, hsl(${hue}, 5%, 82%) 0%, hsl(${hue}, 5%, 76%) 100%)
          `,
        }}
      />
      {/* Halftone dot overlay */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.7) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      {/* Edge fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-30" />
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const visibleCount = 4; // how many portraits shown in the row

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  // Get visible testimonials for the row
  const visible = Array.from({ length: visibleCount }, (_, i) =>
    testimonials[(current + i) % testimonials.length]
  );

  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative overflow-hidden">
      <GridBackground columns={4} />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel number="09" title="TESTIMONIALS" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            What clients say
          </motion.h2>

          {/* Navigation arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-2"
          >
            <button
              onClick={prev}
              className="w-10 h-10 border border-[var(--border-color)] flex items-center justify-center hover:border-accent/40 hover:bg-accent/5 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} className="text-[var(--text-primary)]" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Halftone portrait row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-16"
        >
          {visible.map((t, i) => (
            <div key={`${current}-${i}`} className="relative">
              <HalftonePortrait index={current + i} />
              {/* Active indicator dot */}
              {i === 0 && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Quote + rating row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Quote */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Quote size={32} className="text-accent mb-4" />
                <blockquote className="text-lg md:text-xl leading-relaxed text-[var(--text-primary)] mb-6">
                  &ldquo;{testimonials[current].text}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {testimonials[current].name}
                  </p>
                  <p className="label-mono text-[var(--text-secondary)] text-[0.6rem] mt-1">
                    {testimonials[current].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Rating block */}
          <div className="md:col-span-5 flex flex-col md:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-end gap-3"
            >
              <span className="text-6xl md:text-7xl font-bold tracking-tight">4.9</span>
              <span className="text-lg text-[var(--text-secondary)] mb-2">/5</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="label-mono text-[var(--text-secondary)] text-[0.6rem] mt-2 md:text-right"
            >
              BASED ON 300
              <br />
              VERIFIED REVIEWS
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
