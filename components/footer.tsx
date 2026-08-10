"use client";

import { motion } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const appLinks = [
  { label: "Chat", href: "/chat" },
  { label: "Tools", href: "/tools" },
  { label: "Recruiter", href: "/recruiter" },
  { label: "Estimator", href: "/estimator" },
  { label: "Notes", href: "/notes" },
];

function scrollToSection(href: string) {
  if (href.startsWith("/")) {
    window.location.href = href;
    return;
  }
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Large headline (Oberon-style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.05em]">
            AI-Powered
            <br />
            Portfolio
          </h2>
        </motion.div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Navigation */}
          <div>
            <div className="label-mono text-[var(--text-secondary)] text-[0.6rem] mb-4">NAVIGATION</div>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Apps */}
          <div>
            <div className="label-mono text-[var(--text-secondary)] text-[0.6rem] mb-4">APPS</div>
            <ul className="space-y-2">
              {appLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="label-mono text-[var(--text-secondary)] text-[0.6rem] mb-4">LEGAL</div>
            <ul className="space-y-2">
              <li><span className="text-sm text-[var(--text-secondary)]">Privacy Policy</span></li>
              <li><span className="text-sm text-[var(--text-secondary)]">Terms of Service</span></li>
              <li><span className="text-sm text-[var(--text-secondary)]">Sitemap</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="label-mono text-[var(--text-secondary)] text-[0.6rem] mb-4">CONNECT</div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://linkedin.com/in/kranthi-kumar-katta-a40093318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:kranthikumarkattatech@gmail.com"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-[var(--border-color)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Kranthi Kumar Katta. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
