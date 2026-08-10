"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Loader2, Sparkles, ClipboardList, Cpu, AlertTriangle, Footprints } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { EstimateResult } from "@/app/api/estimate/route";

const PROJECT_TYPES = [
  "Custom web app",
  "SaaS product",
  "E-commerce",
  "AI / LLM integration",
  "Mobile app",
  "Test automation framework",
  "API / integration project",
  "Landing page / portfolio",
];

export default function EstimatorPage() {
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const estimate = async () => {
    if (!description.trim() && !projectType) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType, description, features, timeline, budget }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Estimate failed");
      setResult(data as EstimateResult);
      trackEvent("lead_submit", { kind: "estimate" });
    } catch (e) {
      setError((e as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40";

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <Calculator size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight">Project Estimator</h1>
            <Badge variant="accent">For clients</Badge>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Describe your project and get a structured estimate — scope, timeline,
            cost range, milestones, and next steps. Free and no commitment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Tell me about your project</CardTitle>
              </CardHeader>
              <div className="space-y-3.5 px-4 pb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Project type</label>
                  <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className={inputClasses}>
                    <option value="">Select a type…</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What are you building, and who is it for?"
                    rows={4}
                    className={`${inputClasses} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Key features (one per line)</label>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder={"User login\nDashboard with charts\nAdmin panel\nPayments"}
                    rows={4}
                    className={`${inputClasses} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Timeline expectation</label>
                    <input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 3 months" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Budget (optional)</label>
                    <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $15k" className={inputClasses} />
                  </div>
                </div>
                {error && <p className="text-xs text-amber-400">{error}</p>}
                <Button variant="primary" className="w-full" onClick={estimate} disabled={(!description.trim() && !projectType) || loading} loading={loading}>
                  <Sparkles size={15} /> {loading ? "Estimating…" : "Get Estimate"}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            {!result && !loading && (
              <Card>
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                    <Calculator size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Your estimate appears here</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Fill in the form to get a structured project estimate with scope,
                    timeline, cost, and milestones.
                  </p>
                </div>
              </Card>
            )}
            {loading && (
              <Card>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 size={28} className="text-emerald-400 animate-spin mb-3" />
                  <p className="text-sm text-gray-400">Crunching the numbers…</p>
                </div>
              </Card>
            )}

            <AnimatePresence>
              {result && (
                <>
                  {/* Headline numbers */}
                  <motion.div key="head" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-3xl font-bold text-white">{result.personWeeks}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Person-weeks</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-emerald-400">${result.costRange[0]}–${result.costRange[1]}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Est. cost</p>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-sky-400">{result.timelineMonths} mo</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Timeline</p>
                        </div>
                      </div>
                      {result.summary && (
                        <p className="mt-4 text-sm text-gray-300 leading-relaxed">{result.summary}</p>
                      )}
                      <p className="mt-3 text-[10px] text-gray-600">
                        {result.source === "llm" ? "AI-generated estimate" : "Heuristic estimate"} · assumes a small team of 1–2 engineers
                      </p>
                    </Card>
                  </motion.div>

                  {/* Scope + stack */}
                  <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm"><ClipboardList size={15} className="text-violet-400" /> Scope</CardTitle>
                      </CardHeader>
                      <ul className="space-y-1.5 px-4 pb-4 text-sm text-gray-300">
                        {result.scope.map((s, i) => <li key={i} className="flex gap-2"><span className="text-violet-400 mt-0.5">•</span>{s}</li>)}
                      </ul>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm"><Cpu size={15} className="text-emerald-400" /> Recommended stack</CardTitle>
                      </CardHeader>
                      <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                        {result.techStack.map((t, i) => <Badge key={i} variant="outline">{t}</Badge>)}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Milestones */}
                  {result.milestones.length > 0 && (
                    <motion.div key="milestones" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Milestones</CardTitle>
                        </CardHeader>
                        <div className="px-4 pb-4 space-y-2.5">
                          {result.milestones.map((m, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="flex flex-col items-center mt-0.5">
                                <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-semibold">{i + 1}</span>
                                {i < result.milestones.length - 1 && <span className="w-px h-full bg-white/[0.06] my-1" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-white">{m.phase}</p>
                                  <span className="text-[10px] text-gray-500 shrink-0">~{m.weeks} wk</span>
                                </div>
                                <p className="text-xs text-gray-500">{m.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Risks + next steps */}
                  <motion.div key="bottom" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm"><AlertTriangle size={15} className="text-amber-400" /> Risks</CardTitle>
                      </CardHeader>
                      <ul className="space-y-1.5 px-4 pb-4 text-sm text-gray-300">
                        {result.risks.map((r, i) => <li key={i} className="flex gap-2"><span className="text-amber-400 mt-0.5">•</span>{r}</li>)}
                      </ul>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm"><Footprints size={15} className="text-sky-400" /> Next steps</CardTitle>
                      </CardHeader>
                      <ol className="space-y-1.5 px-4 pb-4 text-sm text-gray-300 list-decimal ml-5">
                        {result.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                    </Card>
                  </motion.div>

                  {/* CTA */}
                  <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
                        <p className="text-sm text-gray-300">
                          Want a detailed proposal? Let&apos;s talk.
                        </p>
                        <div className="flex items-center gap-2">
                          <Link href="#contact" onClick={() => { window.location.href = "/#contact"; }}>
                            <Button variant="primary">Contact Kranthi</Button>
                          </Link>
                          <Link href="/recruiter">
                            <Button variant="ghost">JD Matcher</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
