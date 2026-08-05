"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Moon, Sun, MessageCircle } from "lucide-react";
import { useTheme } from "./theme-provider";
import Link from "next/link";

/* Navigation items */
const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
  { name: "Chat", href: "/chat", icon: MessageCircle },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();

  const navRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------
   * Scroll handling – adds subtle background after
   * the user scrolls and tracks the current section.
   * ------------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= top - 200) {
          current = section.getAttribute("id") ?? "";
        }
      });
      setActiveSection(current);
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    if (href.startsWith("/")) {
      // Page link — full navigation
      window.location.href = href;
      return;
    }
    // Hash link — try to scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // Section not found on this page (e.g., on /chat) — navigate to home with hash
      window.location.href = "/" + href;
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${scrolled ? "bg-white/10 dark:bg-gray-900/60 backdrop-blur-lg shadow-md" : "bg-transparent"}
      `}
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link href="#home" onClick={() => scrollToSection("#home")}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <motion.div
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-glow"
              whileHover={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-bold text-lg">KK</span>
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-white">Kranthi Kumar</span>
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Available for work</span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item, i) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-xl transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
                ${activeSection === item.href.substring(1)
                  ? "bg-violet-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"}
              `}
            >
              {item.name}
            </motion.button>
          ))}

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/10 dark:bg-gray-900/60 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    scrollToSection(item.href);
                    setIsOpen(false);
                  }}
                  className={`
                    flex w-full items-center px-4 py-3 rounded-xl text-left transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
                    ${activeSection === item.href.substring(1)
                      ? "bg-violet-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"}
                  `}
                >
                  {item.name}
                </motion.button>
              ))}

              {/* Mobile theme toggle */}
              <motion.button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className={`
                  flex w-full items-center px-4 py-3 rounded-xl text-left transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
                  text-gray-300 hover:text-white hover:bg-gray-800
                `}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                <span className="ml-2">{theme === "light" ? "Dark" : "Light"} mode</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
