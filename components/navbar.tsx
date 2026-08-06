"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Moon, Sun, MessageCircle, Briefcase, Bell, Search, Sparkles, Calculator, NotebookPen, ChevronDown } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/lib/auth-context";
import { useUnreadContactCount } from "@/lib/contact";
import Link from "next/link";

/* Navigation items — section links on the homepage, apps in the dropdown */
const sectionItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const appItems = [
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Tools", href: "/tools", icon: Sparkles },
  { name: "Recruiter", href: "/recruiter", icon: Briefcase },
  { name: "Estimate", href: "/estimator", icon: Calculator },
  { name: "Notes", href: "/notes", icon: NotebookPen },
];

const navItems = [...sectionItems, ...appItems];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const unreadContacts = useUnreadContactCount();

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
      else if (e.key === "Escape") setAppsOpen(false);
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
        fixed inset-x-0 top-0 z-50 transition-all duration-500
        ${scrolled
          ? "bg-white/[0.06] dark:bg-[rgba(8,8,12,0.78)] backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
          : "bg-transparent border-b border-transparent"}
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
        <div className="hidden md:flex items-center gap-1">
          {sectionItems.map((item) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3.5 py-2 rounded-xl transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
                ${activeSection === item.href.substring(1)
                  ? "bg-violet-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"}
              `}
            >
              {item.name}
            </motion.button>
          ))}

          {/* Apps dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setAppsOpen((v) => !v)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={appsOpen}
              className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl transition-colors duration-200 ${
                appsOpen ? "bg-violet-600/20 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Apps
              <ChevronDown size={14} className={`transition-transform duration-200 ${appsOpen ? "rotate-180" : ""}`} />
            </motion.button>
            <AnimatePresence>
              {appsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/[0.08] bg-[rgba(16,16,20,0.98)] backdrop-blur-lg shadow-2xl shadow-black/50 p-1.5"
                >
                  {appItems.map((item) => {
                    const Icon = item.icon!;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          scrollToSection(item.href);
                          setAppsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Icon size={15} className="text-violet-400" />
                        {item.name}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          {unreadContacts > 0 && (
            <Link
              href="/admin"
              className="relative p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              title={`${unreadContacts} new contact request${unreadContacts === 1 ? "" : "s"}`}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </Link>
          )}

          {/* Search */}
          <motion.button
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Search (⌘K)"
            className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <Search size={18} />
          </motion.button>

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

          {/* Auth button */}
          {user ? (
            <div className="flex items-center gap-2 ml-1">
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white hover:opacity-90 transition-opacity"
                title="Dashboard"
              >
                {(user.email ?? "U")[0]?.toUpperCase()}
              </Link>
              <button
                onClick={signOut}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-1 px-3.5 py-1.5 rounded-xl bg-violet-600/90 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
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

              {/* Mobile auth */}
              {user ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {(user.email ?? "U")[0]?.toUpperCase()}
                  </Link>
                  <span className="text-sm text-gray-300 flex-1 truncate">{user.email}</span>
                  <button onClick={() => { signOut(); setIsOpen(false); }}
                    className="text-xs text-gray-500 hover:text-gray-300">Sign Out</button>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
