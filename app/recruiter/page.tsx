"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Upload, Loader2, CheckCircle2, AlertTriangle, Sparkles,
  MessageSquare, X,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { MatchResult } from "@/app/api/recruiter/route";

const OVERALL_STYLES: Record<MatchResult["overall"], { badge: "success" | "warning" | "default"; bar: string; text: string }> = {
  Excellent: { badge: "success", bar: "from-emerald-500 to-teal-400", text: "text-emerald-400" },
  Strong: { badge: "success", bar: "from-emerald-500 to-teal-400", text: "text-emerald-400" },
  Moderate: { badge: "warning", bar: "from-amber-500 to-orange-400", text: "text-amber-400" },
  Weak: { badge: "default", bar: "from-gray-500 to-gray-400", text: "text-gray-400" },
};

export default function RecruiterPage() {
  const [jdText, setJdText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyze = async () => {
    if ((!jdText.trim() && !file) || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      if (jdText.trim()) fd.append("jdText", jdText);
      const res = await fetch("/api/recruiter", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data as MatchResult);
      trackEvent("jd_match", { score: data.matchScore, source: data.source });
    } catch (e) {
      setError((e as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const style = result ? OVERALL_STYLES[result.overall] : null;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Briefcase size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold">Recruiter Mode</h1>
            <Badge variant="accent">JD Matcher</Badge>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Paste a job description or upload a PDF and get an instant match score against
            Kranthi&apos;s resume — matched skills, gaps, relevant experience, and interview questions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Input panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <p className="text-xs text-gray-500 mt-1">Paste the JD text, or upload a PDF (.pdf)</p>
              </CardHeader>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-56 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 outline-none p-3 text-sm text-white placeholder-gray-600 resize-none"
              />
              <div className="mt-3 flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm">
                    <span className="text-gray-300 truncate flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      {file.name}
                    </span>
                    <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-gray-500 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={15} /> Upload PDF
                  </Button>
                )}
                <Button variant="primary" onClick={analyze} disabled={(!jdText.trim() && !file) || loading} className="mt-1">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  {loading ? "Scoring..." : "Analyze Match"}
                </Button>
              </div>
              {error && <p className="mt-3 text-sm text-amber-400">{error}</p>}
            </Card>
          </motion.div>

          {/* Results panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 space-y-4">
            {!result && !loading && (
              <Card>
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                    <Briefcase size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Match results will appear here</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Paste a job description or upload a PDF to see a scored match against
                    Kranthi&apos;s resume.
                  </p>
                </div>
              </Card>
            )}

            {loading && (
              <Card>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 size={28} className="text-violet-400 animate-spin mb-3" />
                  <p className="text-sm text-gray-400">Analyzing the job description...</p>
                </div>
              </Card>
            )}

            {result && style && (
              <>
                {/* Score */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Match Score</p>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-bold text-white">{result.matchScore}</span>
                        <span className="mb-1.5"><Badge variant={style.badge}>{result.overall}</Badge></span>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-600">
                      {result.source === "llm" ? "AI-scored" : "Keyword estimate"}
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.matchScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
                    />
                  </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Matched */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" /> Matched Skills
                      </CardTitle>
                    </CardHeader>
                    {result.matchedSkills.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {result.matchedSkills.map((s) => (
                          <Badge key={s} variant="success">{s}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No direct skill matches found.</p>
                    )}
                  </Card>

                  {/* Missing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-400" /> Skill Gaps
                      </CardTitle>
                    </CardHeader>
                    {result.missingSkills.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingSkills.map((s) => (
                          <Badge key={s} variant="warning">{s}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No obvious skill gaps.</p>
                    )}
                  </Card>
                </div>

                {/* Recommendation */}
                {result.recommendation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles size={16} className="text-violet-400" /> Recommendation
                      </CardTitle>
                    </CardHeader>
                    <p className="text-sm text-gray-300 leading-relaxed">{result.recommendation}</p>
                  </Card>
                )}

                {/* Experience + Projects */}
                {(result.relevantExperience.length > 0 || result.relevantProjects.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.relevantExperience.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Relevant Experience</CardTitle>
                        </CardHeader>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {result.relevantExperience.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-violet-400 mt-1">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                    {result.relevantProjects.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Relevant Projects</CardTitle>
                        </CardHeader>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {result.relevantProjects.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-violet-400 mt-1">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                )}

                {/* Interview questions */}
                {result.interviewQuestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-sky-400" /> Suggested Interview Questions
                      </CardTitle>
                    </CardHeader>
                    <ol className="space-y-2 text-sm text-gray-300 list-decimal ml-5">
                      {result.interviewQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ol>
                  </Card>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
