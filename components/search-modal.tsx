"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Home, Bot, FolderGit2, Wrench, Briefcase, Sparkles,
  Award, GraduationCap, CornerDownLeft, type LucideIcon,
} from "lucide-react";
import { searchSite, type SearchResult, type SearchGroup } from "@/lib/site-search";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const GROUP_ICONS: Record<SearchGroup, LucideIcon> = {
  Pages: Home,
  Agents: Bot,
  Projects: FolderGit2,
  Skills: Wrench,
  Experience: Briefcase,
  Tools: Sparkles,
  Certifications: Award,
  Education: GraduationCap,
};

const GROUP_ORDER: SearchGroup[] = [
  "Pages",
  "Agents",
  "Tools",
  "Projects",
  "Skills",
  "Experience",
  "Certifications",
  "Education",
];

/**
 * Global command palette (⌘K / Ctrl+K). Rendered once from the root layout.
 * A magnifier in the navbar dispatches an "open-search" event to open it.
 */
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchSite(query), [query]);

  const groups = useMemo(() => {
    const byGroup = new Map<SearchGroup, SearchResult[]>();
    for (const r of results) {
      if (!byGroup.has(r.group)) byGroup.set(r.group, []);
      byGroup.get(r.group)!.push(r);
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
      group: g,
      items: byGroup.get(g)!.slice(0, 6),
    }));
  }, [results]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    if (query.trim()) trackEvent("search", { query: query.trim().slice(0, 120) });
    window.location.href = href.startsWith("#") ? `/${href}` : href;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      go(flat[active].href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl rounded-2xl bg-[rgba(20,20,24,0.98)] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-white/[0.06]">
              <Search size={17} className="text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onKeyDown={onKeyDown}
                placeholder="Search pages, agents, projects, skills, tools…"
                className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none h-14 text-sm"
              />
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {query && flat.length === 0 && (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">
                  No results for “{query}”
                </p>
              )}
              {groups.map(({ group, items }) => {
                const Icon = GROUP_ICONS[group];
                return (
                  <div key={group} className="mb-1">
                    <p className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-wider text-gray-600">
                      {group}
                    </p>
                    {items.map((r) => {
                      const idx = flat.indexOf(r);
                      return (
                        <button
                          key={r.id}
                          onClick={() => go(r.href)}
                          onMouseEnter={() => setActive(idx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            idx === active ? "bg-violet-600/20" : ""
                          )}
                        >
                          <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-violet-300" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm text-white truncate">{r.title}</span>
                            {r.subtitle && (
                              <span className="block text-[11px] text-gray-500 truncate">{r.subtitle}</span>
                            )}
                          </span>
                          {idx === active && <CornerDownLeft size={13} className="text-gray-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              {!query && (
                <p className="px-4 py-6 text-sm text-gray-600 text-center">
                  Start typing to search the portfolio.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-gray-600">
              <span><kbd className="px-1 py-0.5 rounded bg-white/[0.06]">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 rounded bg-white/[0.06]">↵</kbd> open</span>
              <span><kbd className="px-1 py-0.5 rounded bg-white/[0.06]">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
