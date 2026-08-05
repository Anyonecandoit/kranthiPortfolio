"use client";

import { Github, Linkedin } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Kranthi Kumar Katta. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="hover:text-gray-300 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://github.com/kranthi946"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-violet-400 hover:text-violet-200 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-full p-1"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/kranthi-kumar-katta-a40093318"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-violet-400 hover:text-violet-200 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-full p-1"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
