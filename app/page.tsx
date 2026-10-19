import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { TechStack } from "@/components/tech-stack";
import { Value } from "@/components/value";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { BackToTop } from "@/components/back-to-top";

/**
 * Kranthi Kumar Katta — Senior SDET & Quality Automation Architect
 *
 * Authentic Oberon Editorial Layout:
 *   01 INTRO        (Hero — Kranthi Kumar Katta, Bio, Credentials & 3D Tech Constellation)
 *   02 ABOUT        (Specialization — Core Competencies & Companies Worked With)
 *   03 EXPERIENCE   (Career Journey — Work Experience By Year & QA Methodology)
 *   05 PROJECTS     (Featured Projects — Enterprise Automation Case Studies)
 *   07 STACK        (Technical Stack — Constellation Node Graph & Categories)
 *   08 PRINCIPLES   (Engineering Principles — Shift-Left, Flakiness Elimination & Speed)
 *   09 ENDORSEMENTS (Recommendations — Engineering Leadership & Colleague Feedback)
 *   10 ENGAGEMENT   (Open to Roles — Senior SDET, Automation Architect & Advisory)
 *   11 FAQ          (Frequently Asked Questions — Recruiter & Technical FAQs)
 *   12 CONTACT      (Get In Touch — Direct Coordinates & Inquiry Form)
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* 01 INTRO */}
      <section id="home" className="scroll-mt-20">
        <Hero />
      </section>

      {/* 02 PROJECTS */}
      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>

      {/* 03 PROCESS */}
      <section id="experience" className="scroll-mt-20">
        <Experience />
      </section>

      {/* 05 ABOUT */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      {/* 07 STACK */}
      <section id="stack" className="scroll-mt-20">
        <TechStack />
      </section>

      {/* 08 VALUE */}
      <section id="value" className="scroll-mt-20">
        <Value />
      </section>

      {/* 09 TESTIMONIALS */}
      <section id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </section>

      {/* 10 COST */}
      <section id="pricing" className="scroll-mt-20">
        <Pricing />
      </section>

      {/* 11 HELP */}
      <section id="faq" className="scroll-mt-20">
        <Faq />
      </section>

      {/* 12 CONTACTS */}
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>

      {/* Floating Animated HOME Back-to-Top Button */}
      <BackToTop />
    </main>
  );
}
