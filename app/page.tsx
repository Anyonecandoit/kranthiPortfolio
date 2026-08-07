import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { TechStack } from "@/components/tech-stack";
import { Testimonials } from "@/components/testimonials";
import { Experience } from "@/components/experience";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";

/**
 * Default entry page for the Next.js application.
 *
 * The component stitches together the main sections of the portfolio
 * following the Oberon-inspired editorial layout:
 *   01 INTRO (Hero)
 *   02 ABOUT
 *   03 EXPERTISE (Skills)
 *   05 PROJECTS (Case Studies — carousel)
 *   07 STACK (Integrations — orbital diagram)
 *   09 TESTIMONIALS
 *   08 PROCESS (Experience — timeline)
 *   10 PRICING
 *   11 HELP (FAQ)
 *   12 CONTACTS
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* 01 INTRO — Hero */}
      <section id="home" className="scroll-mt-20">
        <Hero />
      </section>

      {/* 02 ABOUT */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      {/* 03 EXPERTISE — Skills */}
      <section id="skills" className="scroll-mt-20">
        <Skills />
      </section>

      {/* 05 PROJECTS — Case Studies carousel */}
      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>

      {/* 07 STACK — Integrations / orbital diagram */}
      <section id="stack" className="scroll-mt-20">
        <TechStack />
      </section>

      {/* 09 TESTIMONIALS */}
      <section id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </section>

      {/* 08 PROCESS — Experience timeline */}
      <section id="experience" className="scroll-mt-20">
        <Experience />
      </section>

      {/* 10 PRICING */}
      <section id="pricing" className="scroll-mt-20">
        <Pricing />
      </section>

      {/* 11 HELP — FAQ */}
      <section id="faq" className="scroll-mt-20">
        <Faq />
      </section>

      {/* 12 CONTACTS */}
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>
    </main>
  );
}
