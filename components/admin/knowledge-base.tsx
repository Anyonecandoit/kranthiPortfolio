"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Trash2, Loader2, Search, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type KnowledgeRow = Database["public"]["Tables"]["knowledge_documents"]["Row"];

interface SearchHit {
  id: string;
  title: string;
  content: string;
  score: number;
}

/** Admin: upload, browse, delete, and test the RAG knowledge base. */
export function KnowledgeBase() {
  const [docs, setDocs] = useState<KnowledgeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("knowledge_documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocs((data as KnowledgeRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const authHeader = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const upload = async () => {
    if ((!content.trim() && !file) || uploading) return;
    setUploading(true);
    setErr(null);
    setMsg(null);
    try {
      const fd = new FormData();
      if (title.trim()) fd.append("title", title);
      if (content.trim()) fd.append("content", content);
      if (file) fd.append("file", file);
      const res = await fetch("/api/knowledge/upload", {
        method: "POST",
        headers: await authHeader(),
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMsg(`Stored ${data.stored} chunk${data.stored === 1 ? "" : "s"}`);
      setTitle("");
      setContent("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch("/api/knowledge/delete", {
      method: "POST",
      headers: { ...(await authHeader()), "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data.error || "Delete failed");
      return;
    }
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const testSearch = async () => {
    if (!query.trim() || searching) return;
    setSearching(true);
    setErr(null);
    try {
      const res = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK: 3 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setHits(data.hits ?? []);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={16} className="text-sky-400" /> Knowledge Base
          <Badge variant="outline">{docs.length} chunk{docs.length === 1 ? "" : "s"}</Badge>
        </CardTitle>
      </CardHeader>

      {/* Upload */}
      <div className="px-4 pb-4 space-y-2.5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title (optional)"
          className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste document content (or upload a PDF/text file below)…"
          rows={4}
          className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 resize-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.md,.json,.yaml,.yml,text/plain,application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
            {file ? file.name : "Choose file"}
          </Button>
          <Button variant="primary" size="sm" onClick={upload} disabled={(!content.trim() && !file) || uploading} loading={uploading}>
            <Upload size={14} /> Add to Knowledge Base
          </Button>
        </div>
        {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        {err && <p className="text-xs text-amber-400">{err}</p>}
      </div>

      {/* Test search */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 focus-within:border-violet-500/40">
            <Search size={14} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && testSearch()}
              placeholder="Test retrieval — try a question…"
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={testSearch} disabled={!query.trim() || searching} loading={searching}>
            Search
          </Button>
        </div>
        {hits.length > 0 && (
          <div className="mt-2 space-y-2">
            {hits.map((h) => (
              <div key={h.id} className="rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-2.5">
                <p className="text-xs font-semibold text-violet-300 mb-0.5">
                  {h.title} <span className="text-gray-600 font-normal">({Math.round(h.score * 100)}%)</span>
                </p>
                <p className="text-xs text-gray-400 line-clamp-2">{h.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <p className="px-4 pb-4 text-sm text-gray-500">Loading…</p>
      ) : docs.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-gray-500">No documents yet. Add your first one above.</p>
      ) : (
        <div className="px-4 pb-4 space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-white truncate">{d.title}</span>
                <button
                  onClick={() => remove(d.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
                  title="Delete chunk"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{d.content}</p>
              <p className="text-[10px] text-gray-600 mt-1">
                {d.file_type} · {d.content.length} chars · {new Date(d.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
