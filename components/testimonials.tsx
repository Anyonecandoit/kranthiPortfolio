"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

/* ─── halftone portrait visual (CSS-driven editorial halftone) ──────── */
function HalftonePortrait({ index, active }: { index: number; active: boolean }) {
  const hues = ["260", "200", "340", "30", "170"];
  const hue = hues[index % hues.length];

  return (
    <div
      className={`relative w-full aspect-[3/4] overflow-hidden transition-all duration-300 border ${
        active ? "border-[var(--accent)] shadow-md scale-[1.02]" : "border-[var(--border-color)] opacity-60 hover:opacity-90 hover:scale-[1.01]"
      }`}
      style={{ background: "var(--bg-card)" }}
    >
      {/* Silhouette gradient */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out hover:scale-105"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 35%, hsl(${hue}, 8%, 62%) 0%, transparent 70%),
            radial-gradient(ellipse 40% 25% at 50% 68%, hsl(${hue}, 8%, 56%) 0%, transparent 60%),
            linear-gradient(180deg, hsl(${hue}, 5%, 72%) 0%, hsl(${hue}, 5%, 60%) 100%)
          `,
        }}
      />
      {/* Halftone matrix pattern */}
      <div
        className="absolute inset-0 mix-blend-multiply opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.75) 1.2px, transparent 1.2px)",
          backgroundSize: "4px 4px",
        }}
      />
      {/* Active orange border indicator tag with live audio equalizer & HUD markers */}
      {active && (
        <>
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--accent)] text-white font-mono text-[9px] font-bold z-10 shadow-xs flex items-center gap-1.5">
            <span>VERIFIED</span>
            {/* Live audio equalizer bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              <motion.span
                animate={{ height: ["25%", "90%", "40%"] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-[1.5px] bg-white rounded-full"
              />
              <motion.span
                animate={{ height: ["60%", "20%", "100%"] }}
                transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                className="w-[1.5px] bg-white rounded-full"
              />
              <motion.span
                animate={{ height: ["30%", "100%", "50%"] }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="w-[1.5px] bg-white rounded-full"
              />
              <motion.span
                animate={{ height: ["80%", "30%", "70%"] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="w-[1.5px] bg-white rounded-full"
              />
            </div>
          </div>
          {/* Scanning beam line */}
          <motion.div
            animate={{ y: ["-120%", "280%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-[var(--accent)]/20 to-transparent pointer-events-none z-10"
          />
          {/* Corner viewfinder HUD */}
          <span className="absolute top-1.5 right-1.5 text-[var(--accent)] font-mono text-[10px] font-bold leading-none select-none z-10">
            ┐
          </span>
          <span className="absolute bottom-1.5 left-1.5 text-[var(--accent)] font-mono text-[10px] font-bold leading-none select-none z-10">
            └
          </span>
          <span className="absolute bottom-1.5 right-1.5 text-[var(--accent)] font-mono text-[10px] font-bold leading-none select-none z-10">
            ┘
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Authentic Oberon '09 TESTIMONIALS' section (from img_6.png):
 * - Oberon two-piece badge: [09 | TESTIMONIALS]
 * - Display heading 'What clients say'
 * - Carousel navigation '<' '>'
 * - Halftone portrait matrix row with live audio equalizer
 * - Selected client feedback testimonial card with floating quotation
 * - Bottom metrics: 4.9 /5 & BASED ON 5+ YEARS OF ENTERPRISE CLIENT VERIFICATIONS
 */
export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = resumeData.testimonials?.length || 4;

  const next = () => setCurrent((c) => (c + 1) % total);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  const activeTestimonial = resumeData.testimonials?.[current] || {
    name: "Engineering Manager",
    role: "QA Lead at Fintech Enterprise",
    text: "Kranthi revolutionized our regression pipeline, reducing release gate testing from 14 hours down to under 30 minutes with zero flaky tests.",
    rating: 5,
  };

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <SectionLabel number="09" title="ENDORSEMENTS" />
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.08]"
            >
              Recommendations
            </motion.h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center hover:border-[var(--accent)] transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} className="text-[var(--text-primary)]" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Halftone Portrait Row matching Oberon img_6.png */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} onClick={() => setCurrent(i % total)} className="cursor-pointer">
              <HalftonePortrait index={i} active={current % 4 === i} />
            </div>
          ))}
        </div>

        {/* Active Testimonial Card with floating quote watermark */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-10 border border-[var(--border-color)] bg-[var(--bg-card)] mb-12 shadow-card relative overflow-hidden"
          >
            {/* Background watermark quote icon */}
            <Quote
              size={120}
              className="absolute -right-4 -bottom-4 text-[var(--border-color)] opacity-30 pointer-events-none select-none"
            />

            {/* Corner HUD markers */}
            <span className="absolute top-2.5 left-2.5 text-[var(--accent)] font-mono text-[9px] select-none">
              ┌
            </span>
            <span className="absolute bottom-2.5 right-2.5 text-[var(--accent)] font-mono text-[9px] select-none">
              ┘
            </span>

            <div className="flex items-center gap-1.5 text-[var(--accent)] mb-4 relative z-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Star size={15} fill="currentColor" />
                </motion.div>
              ))}
              <span className="font-mono text-[10px] text-[var(--accent)] font-bold ml-2">
                5.0 VERIFIED
              </span>
            </div>

            <p className="text-base sm:text-xl font-normal text-[var(--text-primary)] leading-relaxed italic mb-6 relative z-10">
              &ldquo;{activeTestimonial.text}&rdquo;
            </p>

            <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4 relative z-10">
              <div>
                <div className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  {activeTestimonial.name}
                </div>
                <div className="font-mono text-xs text-[var(--text-secondary)] mt-0.5">
                  {activeTestimonial.role}
                </div>
              </div>
              <span className="font-mono text-xs text-[var(--accent)] font-bold px-2 py-0.5 rounded-xs bg-[var(--bg-primary)] border border-[var(--border-color)]">
                0{current + 1} / 0{total}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Metrics matching Oberon img_6.png (4.9 /5 & VERIFIED REVIEWS) */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center shadow-xs">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              4.9
            </span>
            <span className="font-mono text-lg text-[var(--text-secondary)]">/5</span>
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping ml-2 self-center" />
          </div>
          <div className="md:text-right">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              BASED ON 5+ YEARS OF ENGINEERING COLLABORATION &amp; LEADERSHIP
            </div>
            <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase mt-0.5">
              FEEDBACK FROM ENGINEERING MANAGERS, CTOS &amp; PRODUCT LEADS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
