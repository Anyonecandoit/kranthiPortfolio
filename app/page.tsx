import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";

/**
 * Default entry page for the Next.js application.
 *
 * The component stitches together the main sections of the portfolio.
 * It is deliberately minimal – the heavy lifting is done by the
 * individual section components.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* Home / Hero Section */}
      <section id="home" className="scroll-mt-20">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      {/* Skills Section */}
      <section id="skills" className="scroll-mt-20">
        <Skills />
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <Experience />
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>
    </main>
  );
}
