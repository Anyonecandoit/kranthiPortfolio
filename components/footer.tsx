"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Kranthi Kumar Katta. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-3">
          <Link href="#home" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="#about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link href="#skills" className="hover:text-gray-300 transition-colors">
            Skills
          </Link>
          <Link href="#projects" className="hover:text-gray-300 transition-colors">
            Projects
          </Link>
          <Link href="#experience" className="hover:text-gray-300 transition-colors">
            Experience
          </Link>
          <Link href="#contact" className="hover:text-gray-300 transition-colors">
            Contact
          </Link>
        </div>

        {/* Social icons */}
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
            href="https://linkedin.com/in/kranthikumarkatta"
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
