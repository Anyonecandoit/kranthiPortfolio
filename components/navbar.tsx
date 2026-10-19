"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  MessageCircle,
  Briefcase,
  Search,
  Sparkles,
  Calculator,
  NotebookPen,
  ChevronDown,
  Home,
  User,
  FolderGit2,
  Cpu,
  Handshake,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/lib/auth-context";
import { useUnreadContactCount } from "@/lib/contact";
import { NavVisitorCount } from "./nav-visitor-count";
import { NavLiveStatus } from "./nav-live-status";
import Link from "next/link";

/* Navigation items — section links on the homepage with distinct icons */
const sectionItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Projects", href: "#projects", icon: FolderGit2 },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "About", href: "#about", icon: User },
  { name: "Stack", href: "#stack", icon: Cpu },
  { name: "Roles", href: "#pricing", icon: Handshake },
  { name: "Contact", href: "#contact", icon: Mail },
];

const appItems = [
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Tools", href: "/tools", icon: Sparkles },
  { name: "Recruiter", href: "/recruiter", icon: Briefcase },
  { name: "Estimate", href: "/estimator", icon: Calculator },
  { name: "Notes", href: "/notes", icon: NotebookPen },
];

export function Navbar() {
  const { scrollYProgress } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const unreadContacts = useUnreadContactCount();

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
      else if (e.key === "Escape") setAppsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /**
   * Section links use the crawlable "/#section" form so they work across
   * pages; when we are already on the homepage we smooth-scroll in place
   * instead of triggering a full navigation.
   */
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const id = href.split("#")[1];
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ paddingTop: "var(--sat)" }}
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-[#0B0D11]/95 backdrop-blur-xl border-b border-[#21262D] shadow-md"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo — monospace brand name (Oberon-style) with click-to-home */}
        <div className="flex items-center">
          <Link
            href="/#home"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            aria-label="Kranthi Kumar Katta – Home"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] group"
            >
              <div className="w-7 h-7 bg-[var(--accent)] flex items-center justify-center rounded-xs shadow-xs relative overflow-hidden">
                <span className="text-white font-mono font-bold text-[11px] relative z-10">◱</span>
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white/25 skew-x-12 pointer-events-none"
                />
              </div>
              <span className="text-base font-semibold tracking-tight hidden sm:flex items-center gap-1.5 font-mono text-white">
                <span>KRANTHI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              </span>
            </motion.div>
          </Link>

          {/* Live Bangalore Telemetry & Status Pill (after SDET 2 • BANGALORE, IN) */}
          <NavLiveStatus />
        </div>

        {/* Desktop navigation — clean center links with icons */}
        <div className="hidden md:flex items-center gap-1">
          {sectionItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.name}
                href={`/#${item.href.substring(1)}`}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm transition-all duration-200 rounded-xs
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
                  ${isActive
                    ? "text-[var(--accent)] font-semibold bg-[var(--accent)]/15 border border-[var(--accent)]/30"
                    : "text-zinc-300 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10"
                  }
                `}
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <Icon size={14} className={isActive ? "text-[var(--accent)]" : "opacity-80 group-hover:text-[var(--accent)]"} />
                <span>{item.name}</span>
              </a>
            );
          })}

          {/* Dedicated Resume Action Button with icon */}
          <a
            href="/resume/kranthi-kumar-katta-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs lg:text-sm font-semibold text-[var(--accent)] hover:text-white hover:bg-[var(--accent)] border border-[var(--accent)]/50 bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all duration-200 rounded-xs ml-1 shadow-xs"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            title="Download Official Resume (PDF)"
          >
            <FileText size={14} />
            <span>Resume</span>
            <Download size={11} className="opacity-80" />
          </a>

          {/* Apps dropdown */}
          <div className="relative">
            <button
              onClick={() => setAppsOpen((v) => !v)}
              aria-expanded={appsOpen}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm transition-colors duration-200 ${
                appsOpen ? "text-[var(--accent)]" : "text-zinc-300 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Apps
              <ChevronDown size={12} className={`transition-transform duration-200 ${appsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {appsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg p-1"
                >
                  {appItems.map((item) => {
                    const Icon = item.icon!;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setAppsOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <Icon size={14} className="text-accent" />
                        {item.name}
                      </Link>
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
              className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              title={`${unreadContacts} new contact request${unreadContacts === 1 ? "" : "s"}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 5a4 4 0 018 0c0 3 1 5 2 6H2c1-1 2-3 2-6z" />
                <path d="M6 10v1a2 2 0 004 0v-1" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
            </Link>
          )}

          {/* Search */}
          <button
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            aria-label="Search (⌘K)"
            className="p-2 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Search size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => {
              void import("@/lib/haptics").then(({ hapticSelection }) => hapticSelection());
              toggleTheme();
            }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="p-2 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User profile (only when signed in, no SIGN IN button) */}
          {user && (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/dashboard"
                className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white hover:opacity-90 transition-opacity"
                title="Dashboard"
              >
                {(user.email ?? "U")[0]?.toUpperCase()}
              </Link>
              <button
                onClick={signOut}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Live visitor count */}
          <NavVisitorCount />
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[var(--bg-primary)] border-t border-[var(--border-color)]"
          >
            <div className="px-6 py-4 space-y-1">
              {sectionItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.name}
                    href={`/#${item.href.substring(1)}`}
                    onClick={(e) => {
                      scrollToSection(e, item.href);
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors
                      ${isActive
                        ? "text-[var(--accent)] font-semibold bg-[var(--accent)]/10"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      }
                    `}
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    <Icon size={16} className={isActive ? "text-[var(--accent)]" : "opacity-80"} />
                    <span>{item.name}</span>
                  </a>
                );
              })}

              {/* Mobile Resume Link */}
              <div className="pt-2 pb-1">
                <a
                  href="/resume/kranthi-kumar-katta-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 font-semibold"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  <span className="flex items-center gap-3">
                    <FileText size={16} />
                    <span>Resume (Official PDF)</span>
                  </span>
                  <Download size={14} />
                </a>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)]">
                <p className="px-3 py-1.5 text-xs text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>APPS</p>
                {appItems.map((item) => {
                  const Icon = item.icon!;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <Icon size={14} className="text-accent" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-3">
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                  {theme === "light" ? "Dark mode" : "Light mode"}
                </button>
              </div>

              {user && (
                <div className="flex items-center gap-3 px-3 py-3 border-t border-[var(--border-color)]">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
                    {(user.email ?? "U")[0]?.toUpperCase()}
                  </Link>
                  <span className="text-sm text-[var(--text-secondary)] flex-1 truncate">{user.email}</span>
                  <button onClick={() => { signOut(); setIsOpen(false); }}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Sign Out</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Reading Progress Laser Line */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] via-orange-400 to-[var(--accent)] pointer-events-none z-50 shadow-[0_0_8px_var(--accent)]"
      />
    </motion.nav>
  );
}
