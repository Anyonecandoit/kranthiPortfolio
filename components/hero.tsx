"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode } from "react";
import { Mail, Linkedin, Github, FileText, ArrowDown } from "lucide-react";
import { useTheme } from "./theme-provider";
import { TypeAnimation } from "./type-animation";
import { LetterReveal, GradientWordReveal, ParagraphReveal } from "./text-reveal";
import { resumeData } from "@/data/resume";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Premium Hero — full-screen with 3D text reveals, blur-to-clear effects,
 * magnetic hover CTAs, and particle constellation.
 */
export function Hero() {
  const { theme } = useTheme();
  const { name, title, email, github, linkedin, summary } = resumeData;

  const gradientFrom = theme === "light" ? "from-violet-200" : "from-violet-900";
  const gradientTo = theme === "light" ? "to-purple-200" : "to-purple-900";

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-purple-950/15`}
        aria-hidden="true"
      />

      {/* Animated blobs — soft purple glow */}
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden="true"
      />
      {/* Center glow — very subtle */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Name — 3D letter reveal with rotation + blur */}
        <div className="mb-5 overflow-hidden" style={{ perspective: "800px" }}>
          <LetterReveal
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white block"
            delay={0.5}
            staggerDelay={0.04}
          >
            {name || "Kranthi Kumar Katta"}
          </LetterReveal>
        </div>

        {/* Title — gradient blur-to-clear reveal */}
        <div className="mb-3 overflow-hidden">
          <GradientWordReveal
            className="text-2xl sm:text-3xl md:text-4xl font-semibold"
            delay={1.2}
            staggerDelay={0.12}
          >
            {title || "Senior SDET | Automation Expert"}
          </GradientWordReveal>
        </div>

        {/* Typewriter — letter-by-letter cycling roles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-violet-400 mb-8 h-12"
        >
          <TypeAnimation />
        </motion.div>

        {/* Summary — word-by-word blur reveal */}
        <div className="mb-10 max-w-2xl mx-auto">
          <ParagraphReveal
            className="text-lg sm:text-xl text-gray-300 leading-relaxed"
            delay={2.0}
            staggerDelay={0.04}
          >
            {summary || "Senior SDET with 5+ years of experience in automation, performance testing, and API testing. Passionate about building robust test frameworks and ensuring software quality."}
          </ParagraphReveal>
        </div>

        {/* CTA buttons — staggered with magnetic hover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="inline-block bg-white/5 backdrop-blur-xl border-white/10">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <MagneticButton>
                <Button as="a" href={`mailto:${email}`} variant="primary" className="flex items-center gap-2">
                  <Mail size={18} /> Email
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button as="a" href={linkedin} target="_blank" rel="noopener noreferrer" variant="primary" className="flex items-center gap-2">
                  <Linkedin size={18} /> LinkedIn
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button as="a" href={github} target="_blank" rel="noopener noreferrer" variant="primary" className="flex items-center gap-2">
                  <Github size={18} /> GitHub
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button as="a" href="/resume/kranthi-kumar-katta-resume.pdf" download variant="primary" className="flex items-center gap-2">
                  <FileText size={18} /> Resume
                </Button>
              </MagneticButton>
            </div>
          </Card>
        </motion.div>

        {/* Scroll arrow — bouncing with glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <motion.a
            href="#about"
            aria-label="Scroll to About section"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <ArrowDown size={20} className="text-white/70" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Magnetic hover wrapper — button subtly follows the cursor.
 */
function MagneticButton({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
