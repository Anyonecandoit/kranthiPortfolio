"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Copy, Check, X, Sparkles, Play, RotateCcw, Shield, Code, FileText, Globe, Zap, AlertTriangle } from "lucide-react";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { TOOLS, TOOL_CATEGORIES, type ToolDefinition } from "@/lib/tools";
import { ToolIcon } from "@/components/tools/tool-icon";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { apiUrl } from "@/lib/api";

type ToolValues = Record<string, string>;

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  Writing: FileText,
  Coding: Code,
  Testing: Shield,
  Content: Globe,
  Productivity: Zap,
  "All": Sparkles,
};

export default function ToolsPage() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ToolDefinition | null>(null);
  const [values, setValues] = useState<ToolValues>({});
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const tool = TOOLS.find((t) => t.id === hash);
      if (tool) {
        setSelected(tool);
        setValues({});
        setOutput(null);
        history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  const tools = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOOLS.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q || `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(q))
    );
  }, [category, query]);

  const openTool = (tool: ToolDefinition) => {
    setSelected(tool);
    setValues({});
    setOutput(null);
    setError(null);
    trackEvent("tool_use", { tool: tool.id, action: "open" });
  };

  const run = async () => {
    if (!selected || running) return;
    setRunning(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch(apiUrl("/api/tools/run"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: selected.id, inputs: values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Run failed");
      setOutput(data.output);
      trackEvent("tool_use", { tool: selected.id, action: "run" });
    } catch (e) {
      setError((e as Error).message || "Something went wrong.");
    } finally {
      setRunning(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      void import("@/lib/haptics").then(({ hapticSuccess }) => hapticSuccess());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    m.set("All", TOOLS.length);
    for (const c of TOOL_CATEGORIES) m.set(c, TOOLS.filter((t) => t.category === c).length);
    return m;
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <SectionLabel number="AI" title="TOOLS" />
          <h1 className="text-4xl sm:text-5xl font-medium tracking-[-0.05em] mb-2">AI Tools Library</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            <Badge variant="accent" className="mr-2">{TOOLS.length} tools</Badge>
            across {TOOL_CATEGORIES.length} categories
          </p>
          <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed mt-2">
            A library of AI-powered utilities — writing, coding, testing, content, and productivity.
            Pick a tool, fill in the fields, and run it.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center gap-2"
        >
          <div className="flex items-center gap-2 border border-[var(--border-color)] px-3 py-1.5 w-64 mr-2 focus-within:border-accent/40 transition-colors bg-[var(--bg-card)]">
            <Search size={14} className="text-[var(--text-secondary)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none text-sm"
            />
          </div>
          {["All", ...TOOL_CATEGORIES].map((c) => {
            const Icon = CATEGORY_ICONS[c] || Sparkles;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-medium border transition-all duration-200 flex items-center gap-1.5",
                  c === category
                    ? "bg-accent text-white border-accent"
                    : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent/40 hover:text-[var(--text-primary)]"
                )}
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <Icon size={12} />
                {c} <span className="text-[10px] opacity-60">({counts.get(c)})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tools Grid or Tool Detail */}
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools.map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      onClick={() => openTool(tool)}
                      className="w-full text-left p-4 border border-[var(--border-color)] hover:border-accent/30 bg-[var(--bg-card)] transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <ToolIcon name={tool.icon} size={24} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--text-primary)] truncate">{tool.name}</h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">{tool.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px]">{tool.category}</Badge>
                            <span className="text-[10px] text-[var(--text-secondary)]">{tool.fields.length} inputs</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              {tools.length === 0 && (
                <div className="p-12 text-center border border-[var(--border-color)] bg-[var(--bg-card)]">
                  <Search size={48} className="mx-auto text-[var(--text-secondary)] mb-4" />
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">No tools found</h3>
                  <p className="text-[var(--text-secondary)]">Try adjusting your search or category filter.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <ToolIcon name={selected.icon} size={32} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-medium tracking-[-0.04em] text-[var(--text-primary)]">{selected.name}</h2>
                        <Badge variant="accent">{selected.category}</Badge>
                      </div>
                      <p className="text-[var(--text-secondary)]">{selected.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/30 transition-colors"
                    aria-label="Close tool"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Inputs */}
                <div className="space-y-4 mb-6">
                  {selected.fields.map((input) => (
                    <div key={input.name}>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        {input.label} {input.required && <span className="text-accent">*</span>}
                      </label>
                      {input.type === "textarea" ? (
                        <textarea
                          value={values[input.name] || ""}
                          onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                          placeholder={input.placeholder}
                          rows={input.rows || 4}
                          className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-accent/40 transition-colors resize-none text-sm"
                        />
                      ) : input.type === "select" ? (
                        <select
                          value={values[input.name] || ""}
                          onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                          className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-accent/40 transition-colors text-sm"
                        >
                          <option value="" disabled>{input.placeholder}</option>
                          {input.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={input.type}
                          value={values[input.name] || ""}
                          onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                          placeholder={input.placeholder}
                          className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-accent/40 transition-colors text-sm"
                        />
                      )}
                      {input.help && <p className="text-xs text-[var(--text-secondary)] mt-1">{input.help}</p>}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <button
                    onClick={run}
                    disabled={running}
                    className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                    {running ? "Running…" : "RUN TOOL"}
                  </button>
                  {output && (
                    <>
                      <button
                        onClick={copy}
                        className="inline-flex items-center gap-1.5 border border-[var(--border-color)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-accent/40 transition-colors"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => { setOutput(null); setError(null); }}
                        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <RotateCcw size={13} /> Run again
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="inline-flex items-center gap-1.5 border border-[var(--border-color)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-accent/40 transition-colors"
                      >
                        Done
                      </button>
                    </>
                  )}
                </div>

                {/* Output / Error */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-red-300 bg-red-50 p-4"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                        <pre className="text-red-700 text-sm whitespace-pre-wrap font-mono">{error}</pre>
                      </div>
                    </motion.div>
                  )}
                  {output && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 max-h-96 overflow-auto"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--text-secondary)]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>OUTPUT</span>
                        <button
                          onClick={copy}
                          className="inline-flex items-center gap-1.5 border border-[var(--border-color)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-accent/40 transition-colors"
                        >
                          {copied ? <Check size={11} /> : <Copy size={11} />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="prose prose-sm max-w-none text-[var(--text-primary)]">
                        <Markdown>{output}</Markdown>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
