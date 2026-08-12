"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NotebookPen, Plus, Trash2, Loader2, Eye, EyeOff, Undo2,
  CloudUpload, CloudDownload, Sparkles, Check, ListTree, Wand2, SpellCheck,
  AlignJustify, Languages, PenLine, ListChecks,
} from "lucide-react";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { apiUrl } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = "ai-notes:v1";
const RULES_KEY = "ai-notes:rules";
const TRANSLATE_LANGS = ["Telugu", "Hindi", "English", "German", "French", "Japanese"];

const AI_ACTIONS = [
  { id: "summarize", label: "Summarize", icon: ListTree },
  { id: "improve", label: "Improve", icon: Wand2 },
  { id: "grammar", label: "Fix grammar", icon: SpellCheck },
  { id: "expand", label: "Expand", icon: AlignJustify },
  { id: "tldr", label: "TL;DR", icon: Check },
  { id: "translate", label: "Translate", icon: Languages },
  { id: "continue", label: "Continue", icon: PenLine },
] as const;

function loadLocal(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Note[];
  } catch {
    return [];
  }
}

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [lang, setLang] = useState(TRANSLATE_LANGS[0]);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [rules, setRules] = useState("");
  const [showRules, setShowRules] = useState(false);

  // Load local notes + rules on mount.
  useEffect(() => {
    const local = loadLocal();
    setNotes(local);
    const first = local[0];
    if (first) {
      setActiveId(first.id);
      setTitle(first.title);
      setContent(first.content);
    }
    setRules(localStorage.getItem(RULES_KEY) ?? "");
  }, []);

  // Persist rules (the AI reads these BEFORE processing any note).
  useEffect(() => {
    localStorage.setItem(RULES_KEY, rules);
  }, [rules]);

  // Autosave the active note into the in-memory list (debounced).
  useEffect(() => {
    const t = window.setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeId ? { ...n, title, content, updatedAt: Date.now() } : n
        )
      );
    }, 400);
    return () => window.clearTimeout(t);
  }, [title, content, activeId]);

  // Persist the list to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const active = notes.find((n) => n.id === activeId) ?? null;

  const addNote = () => {
    const n: Note = {
      id: crypto.randomUUID(),
      title: "Untitled note",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [n, ...prev]);
    setActiveId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setPreview(false);
  };

  const selectNote = (id: string) => {
    const n = notes.find((x) => x.id === id);
    if (!n) return;
    setActiveId(id);
    setTitle(n.title);
    setContent(n.content);
    setPreview(false);
  };

  const deleteNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (activeId === id) {
      const first = next[0];
      setActiveId(first?.id ?? null);
      setTitle(first?.title ?? "");
      setContent(first?.content ?? "");
    }
  };

  const runAI = async (action: string) => {
    if (aiBusy || !content.trim()) return;
    setAiBusy(action);
    setUndoStack((s) => [content, ...s].slice(0, 5));
    try {
      const res = await fetch(apiUrl("/api/notes/ai"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, title, content, lang, rules }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      setContent(data.output);
      trackEvent("tool_use", { tool: `note-${action}` });
    } catch (e) {
      setSyncMsg((e as Error).message);
    } finally {
      setAiBusy(null);
    }
  };

  const undo = () => {
    setUndoStack((s) => {
      if (!s.length) return s;
      const [prev, ...rest] = s;
      setContent(prev);
      return rest;
    });
  };

  const syncUp = async () => {
    if (!user || !active) return;
    try {
      const { data: existing } = await supabase
        .from("notes")
        .select("id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (existing?.length) {
        await supabase
          .from("notes")
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq("id", existing[0].id);
      } else {
        await supabase.from("notes").insert({ user_id: user.id, title, content });
      }
      setSyncMsg("Saved to your account ✓");
      window.setTimeout(() => setSyncMsg(null), 2500);
    } catch {
      setSyncMsg("Could not save to account.");
    }
  };

  const syncDown = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("notes")
        .select("title,content")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (data?.length) {
        setTitle(data[0].title);
        setContent(data[0].content);
        setSyncMsg("Loaded from your account ✓");
      } else {
        setSyncMsg("No saved notes in your account.");
      }
      window.setTimeout(() => setSyncMsg(null), 2500);
    } catch {
      setSyncMsg("Could not load from account.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center">
              <NotebookPen size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight">AI Notes</h1>
            <Badge variant="accent">Autosaved</Badge>
          </div>
          <p className="text-gray-400 max-w-2xl">
            A notepad with AI superpowers — summarize, improve, expand, translate, or
            continue any note in one click. Notes are saved locally; sign in to sync.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5">
          {/* Note list */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="space-y-2">
            <button
              onClick={addNote}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600/20 border border-violet-500/30 px-3 py-2.5 text-sm font-medium text-violet-200 hover:bg-violet-600/30 transition-colors"
            >
              <Plus size={15} /> New note
            </button>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {notes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => selectNote(n.id)}
                  className={cn(
                    "group rounded-xl border px-3 py-2.5 cursor-pointer transition-colors",
                    n.id === activeId
                      ? "border-sky-500/40 bg-sky-500/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">{n.title || "Untitled note"}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-0.5">{n.content.length} chars</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Editor */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
            {active ? (
              <>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full bg-transparent text-xl font-semibold text-white placeholder-gray-600 outline-none"
                />
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                  {preview ? (
                    <div className="min-h-[50vh] p-5">
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-sky-400 prose-li:text-gray-200 prose-code:text-sky-300">
                        <Markdown>{content || "*Empty note*"}</Markdown>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start typing, or pick an AI action below…"
                      className="w-full min-h-[50vh] resize-none bg-transparent p-5 text-sm text-gray-200 placeholder-gray-600 outline-none leading-relaxed"
                    />
                  )}
                </div>

                {/* AI toolbar */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {AI_ACTIONS.map((a) => {
                    const Icon = a.icon;
                    const busy = aiBusy === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => runAI(a.id)}
                        disabled={!!aiBusy || !content.trim()}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40",
                          busy
                            ? "bg-sky-600/25 border-sky-500/40 text-sky-200"
                            : "bg-white/[0.04] border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {busy ? <Loader2 size={13} className="animate-spin" /> : <Icon size={13} />}
                        {a.label}
                      </button>
                    );
                  })}
                  {aiBusy === "translate" && (
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="rounded-lg bg-[rgba(20,20,24,1)] border border-white/10 px-2 py-1.5 text-xs text-white outline-none"
                    >
                      {TRANSLATE_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  )}
                  <span className="flex-1" />
                  <button
                    onClick={() => setShowRules((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                      showRules
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                        : "border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    )}
                    title="Set rules the AI must read before touching your note"
                  >
                    <ListChecks size={13} /> Rules
                  </button>
                  <button
                    onClick={() => setPreview((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                    {preview ? "Edit" : "Preview"}
                  </button>
                  {undoStack.length > 0 && (
                    <button
                      onClick={undo}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Undo last AI change"
                    >
                      <Undo2 size={13} /> Undo
                    </button>
                  )}
                </div>

                {/* Rules editor — the AI reads these first, before the note */}
                {showRules && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3">
                    <p className="text-[11px] text-amber-300/90 mb-1.5">
                      Rules the AI reads before working on this note:
                    </p>
                    <textarea
                      value={rules}
                      onChange={(e) => setRules(e.target.value)}
                      placeholder={"e.g.\n- Always reply in first person, as Kranthi's assistant.\n- Keep output under 200 words.\n- Use headings for any list longer than 5 items."}
                      rows={4}
                      className="w-full rounded-lg bg-black/20 border border-white/[0.06] px-3 py-2 text-xs text-amber-100/90 placeholder-amber-100/30 outline-none focus:border-amber-500/40 resize-none"
                    />
                    <p className="text-[10px] text-amber-100/40 mt-1">Saved locally. Applied to Summarize, Improve, Expand, TL;DR, Translate, and Continue.</p>
                  </div>
                )}

                {/* Sync row */}
                {user && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <button onClick={syncUp} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-sky-300 transition-colors">
                      <CloudUpload size={13} /> Save to account
                    </button>
                    <button onClick={syncDown} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-sky-300 transition-colors">
                      <CloudDownload size={13} /> Load from account
                    </button>
                    {syncMsg && <span className="text-emerald-400">{syncMsg}</span>}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <NotebookPen size={24} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 max-w-sm">
                  No note selected. Create one to start writing — and let AI help you finish.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
