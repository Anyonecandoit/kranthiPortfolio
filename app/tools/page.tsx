"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Copy, Check, X, Sparkles, Play, RotateCcw, Zap, Shield, Code, FileText, Globe, AlertTriangle } from "lucide-react";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { TOOLS, TOOL_CATEGORIES, type ToolDefinition } from "@/lib/tools";
import { ToolIcon } from "@/components/tools/tool-icon";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { HolographicCard } from "@/components/ui/holographic-card";
import { TechMarquee } from "@/components/ui/tech-marquee";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SpotlightCard } from "@/components/ui/spotlight-card";

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

  // Auto-open a tool when arriving with a #hash (e.g. from smart search).
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
      const res = await fetch("/api/tools/run", {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    m.set("All", TOOLS.length);
    for (const c of TOOL_CATEGORIES) m.set(c, TOOLS.filter((t) => t.category === c).length);
    return m;
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-white pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Premium Hero Header */}
        <Reveal delay={0.1} y={24} blur>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(232,121,249,0.5)]">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1">AI Tools Library</h1>
                <p className="text-gray-400 text-lg">
                  <Badge variant="accent" className="mr-2">{TOOLS.length} tools</Badge>
                  across {TOOL_CATEGORIES.length} categories
                </p>
              </div>
            </div>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              A library of AI-powered utilities — writing, coding, testing, content, and productivity.
              Pick a tool, fill in the fields, and run it. Each tool is a self-contained micro-app.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25} y={24}>
          <HolographicCard className="p-4" glow="rgba(217,70,239,0.12)">
            <TechMarquee
              speed={28}
              items={[
                "GPT-4o", "Claude 3.5", "Gemini 1.5", "Mistral", "Llama 3",
                "RAG", "Vector Search", "Function Calling", "Streaming", "Code Gen",
                "Test Gen", "Doc Gen", "API Client", "Load Test", "Perf Analysis"
              ]}
            />
          </HolographicCard>
        </Reveal>

        {/* Filters */}
        <Reveal delay={0.3} y={20}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 w-64 mr-2 focus-within:border-violet-500/40 transition-colors">
              <Search size={14} className="text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools…"
                className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
              />
            </div>
            {["All", ...TOOL_CATEGORIES].map((c) => {
              const Icon = CATEGORY_ICONS[c] || Sparkles;
              return (
                <Reveal key={c} delay={0.02} y={10}>
                  <button
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all duration-200 flex items-center gap-1.5",
                      c === category
                        ? "bg-violet-600/30 border-violet-500/50 text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)]"
                        : "bg-white/[0.04] border-white/[0.08] text-gray-300 hover:border-violet-500/40 hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    <Icon size={12} />
                    {c} <span className="text-[10px] opacity-60">({counts.get(c)})</span>
                  </button>
                </Reveal>
              );
            })}
          </motion.div>
        </Reveal>

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
              <Reveal delay={0.4} y={20}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tools.map((tool, i) => (
                    <Reveal key={tool.id} delay={i * 0.03} y={16}>
                      <SpotlightCard
                        className="p-4 cursor-pointer hover:border-violet-500/30 transition-all duration-300"
                        glow="rgba(139,92,246,0.08)"
                        onClick={() => openTool(tool)}
                      >
                        <div className="flex items-start gap-3">
                          <ToolIcon name={tool.icon} size={24} />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{tool.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{tool.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-[10px]">{tool.category}</Badge>
                              <span className="text-[10px] text-gray-500">{tool.fields.length} inputs</span>
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Reveal>
                  ))}
                </div>
              </Reveal>

              {tools.length === 0 && (
                <Reveal delay={0.4}>
                  <HolographicCard className="p-12 text-center" glow="rgba(139,92,246,0.08)">
                    <Search size={48} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-1">No tools found</h3>
                    <p className="text-gray-400">Try adjusting your search or category filter.</p>
                  </HolographicCard>
                </Reveal>
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
              <Reveal delay={0.1} y={16}>
                <SpotlightCard className="p-6" glow="rgba(139,92,246,0.1)">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                      <ToolIcon name={selected.icon} size={32} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                          <Badge variant="accent">{selected.category}</Badge>
                        </div>
                        <p className="text-gray-400">{selected.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.15] transition-colors"
                      aria-label="Close tool"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4 mb-6">
                    {selected.fields.map((input) => (
                      <div key={input.name}>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          {input.label} {input.required && <span className="text-violet-400">*</span>}
                        </label>
                        {input.type === "textarea" ? (
                          <textarea
                            value={values[input.name] || ""}
                            onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                            placeholder={input.placeholder}
                            rows={input.rows || 4}
                            className={cn(
                              "w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition-colors",
                              "resize-none text-sm"
                            )}
                          />
                        ) : input.type === "select" ? (
                          <select
                            value={values[input.name] || ""}
                            onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                            className={cn(
                              "w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-white outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition-colors",
                              "text-sm"
                            )}
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
                            className={cn(
                              "w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition-colors",
                              "text-sm"
                            )}
                          />
                        )}
                        {input.help && <p className="text-xs text-gray-500 mt-1">{input.help}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <MagneticButton
                      onClick={run}
                      disabled={running}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-lg shadow-fuchsia-600/20"
                    >
                      {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                      {running ? "Running…" : "Run Tool"}
                    </MagneticButton>

                    {output && (
                      <>
                        <MagneticButton
                          onClick={copy}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] px-3.5 py-2 text-xs font-medium text-gray-200 hover:bg-white/[0.1] hover:border-white/[0.2] transition-colors"
                        >
                          {copied ? <Check size={13} /> : <Copy size={13} />}
                          {copied ? "Copied!" : "Copy"}
                        </MagneticButton>
                        <button
                          onClick={() => { setOutput(null); setError(null); }}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          <RotateCcw size={13} /> Run again
                        </button>
                        <button
                          onClick={() => setSelected(null)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] px-3.5 py-2 text-xs font-medium text-gray-200 hover:bg-white/[0.1] hover:border-white/[0.2] transition-colors"
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
                        className="rounded-lg bg-rose-500/15 border border-rose-500/30 p-4"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={18} className="text-rose-400 mt-0.5 shrink-0" />
                          <pre className="text-rose-300 text-sm whitespace-pre-wrap font-mono">{error}</pre>
                        </div>
                      </motion.div>
                    )}
                    {output && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-lg bg-white/[0.04] border border-white/[0.08] p-4 max-h-96 overflow-auto"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-400">Output</span>
                          <div className="flex items-center gap-2">
                            <MagneticButton
                              onClick={copy}
                              className="inline-flex items-center gap-1.5 rounded bg-white/[0.06] border border-white/[0.1] px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-white/[0.1] transition-colors"
                            >
                              {copied ? <Check size={11} /> : <Copy size={11} />}
                              {copied ? "Copied" : "Copy"}
                            </MagneticButton>
                          </div>
                        </div>
                        <div className="prose prose-invert max-w-none text-sm">
                          <Markdown>{output}</Markdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}