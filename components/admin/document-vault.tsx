"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FolderLock,
  UploadCloud,
  Trash2,
  Search,
  FileText,
  Download,
  Eye,
  X,
  Tag,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";
import { apiUrl } from "@/lib/api";
import { apiFetch } from "@/lib/offline";
import { cn } from "@/lib/utils";

type DocRow = Database["public"]["Tables"]["admin_documents"]["Row"];

interface Doc extends DocRow {
  signedUrl: string | null;
}

export const DOC_CATEGORIES = [
  "Certifications",
  "Resume",
  "Test Plans",
  "Interview Prep",
  "Cheat Sheets",
  "API & References",
  "Reports",
  "Other",
] as const;

const CATEGORY_COLORS: Record<string, "accent" | "success" | "warning" | "outline" | "default"> = {
  Certifications: "accent",
  Resume: "success",
  "Test Plans": "warning",
  "Interview Prep": "default",
  "Cheat Sheets": "outline",
};

const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/markdown",
  "image/png",
  "image/jpeg",
];
const MAX_SIZE = 25 * 1024 * 1024; // 25 MB — matches the storage bucket limit

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function isPdf(doc: Doc): boolean {
  return doc.file_type.includes("pdf") || doc.file_name.toLowerCase().endsWith(".pdf");
}

/** Admin: private document vault — upload, organize, preview, and download
 *  testing-related PDFs (certifications, test plans, cheat sheets, resumes…).
 *  Files go to the private `documents` storage bucket; metadata lives in
 *  `admin_documents`. Everything is owner-only (RLS). */
export function DocumentVault() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Certifications");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [preview, setPreview] = useState<Doc | null>(null);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const authHeader = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(apiUrl("/api/admin/documents"), {
        headers: await authHeader(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load documents");
      setDocs(data.docs ?? []);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pickFile = (f: File | undefined | null) => {
    setErr(null);
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      setErr("Unsupported file type. Upload a PDF, Word, Excel, text, or image file.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setErr("File is larger than the 25 MB limit.");
      return;
    }
    setFile(f);
    if (!title.trim()) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const upload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setErr(null);
    setMsg(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in.");
      // 1) Upload the file directly to the private bucket (no server round-trip).
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        if (upErr.message.includes("bucket") || upErr.message.includes("Bucket")) {
          throw new Error(
            "Storage not ready — run supabase/document-vault.sql in the Supabase SQL editor, then try again."
          );
        }
        throw new Error(`Upload failed: ${upErr.message}`);
      }
      // 2) Register the metadata row.
      const tagsList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await apiFetch(apiUrl("/api/admin/documents"), {
        method: "POST",
        headers: { ...(await authHeader()), "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || file.name,
          category,
          tags: tagsList,
          file_path: path,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save document");
      setMsg(`Saved “${data.doc.title}” to your vault.`);
      setFile(null);
      setTitle("");
      setTags("");
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (doc: Doc) => {
    if (!window.confirm(`Delete “${doc.title}”? This removes the file permanently.`)) return;
    setErr(null);
    const res = await apiFetch(apiUrl("/api/admin/documents"), {
      method: "DELETE",
      headers: { ...(await authHeader()), "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data.error || "Delete failed");
      return;
    }
    if (preview?.id === doc.id) setPreview(null);
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    setMsg(`Deleted “${doc.title}”.`);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setErr(null);
    const res = await apiFetch(apiUrl("/api/admin/documents"), {
      method: "PATCH",
      headers: { ...(await authHeader()), "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        title: editTitle,
        category: editCategory,
        tags: editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data.error || "Save failed");
      return;
    }
    setEditing(null);
    await load();
  };

  const filtered = docs.filter((d) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q));
    const matchesFilter = filter === "All" || d.category === filter;
    return matchesQuery && matchesFilter;
  });

  const categories = ["All", ...DOC_CATEGORIES];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderLock size={16} className="text-sky-400" /> Document Vault
          <Badge variant="outline">{docs.length} doc{docs.length === 1 ? "" : "s"}</Badge>
        </CardTitle>
      </CardHeader>

      {/* Upload */}
      <div className="px-4 pb-4 space-y-2.5">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors",
            dragOver
              ? "border-sky-400/60 bg-sky-500/10"
              : "border-white/[0.12] bg-white/[0.02] hover:border-sky-400/40 hover:bg-white/[0.04]"
          )}
        >
          <UploadCloud size={22} className="mx-auto mb-2 text-gray-500" />
          <p className="text-sm text-gray-400">
            {file ? (
              <>
                <span className="text-white font-medium">{file.name}</span> ·{" "}
                {formatSize(file.size)}
              </>
            ) : (
              "Drop a PDF here, or click to choose"
            )}
          </p>
          <p className="text-[11px] text-gray-600 mt-1">
            PDF · Word · Excel · text · images — up to 25 MB. Stored privately, admin-only.
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        {file && (
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[180px] space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40"
              />
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-2.5 py-2 text-xs text-white outline-none focus:border-violet-500/40"
                >
                  {DOC_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#14141a]">
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (comma separated) — e.g. selenium, api"
                  className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-violet-500/40"
                />
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={upload}
              disabled={uploading}
              loading={uploading}
            >
              <UploadCloud size={14} /> Save to Vault
            </Button>
          </div>
        )}
        {msg && <p className="text-xs text-emerald-400">{msg}</p>}
        {err && <p className="text-xs text-amber-400">{err}</p>}
      </div>

      {/* Search + filter */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 focus-within:border-violet-500/40">
            <Search size={14} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, category, or tags…"
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "px-2.5 py-1 text-[11px] rounded-full border transition-colors",
                filter === c
                  ? "bg-sky-500/20 border-sky-400/40 text-sky-300"
                  : "border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Preview panel */}
      {preview && (
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-white/[0.08] bg-black/40 overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/[0.06]">
              <span className="text-xs font-medium text-white truncate">{preview.title}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {preview.signedUrl && (
                  <a
                    href={preview.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Open in new tab"
                  >
                    <Eye size={14} />
                  </a>
                )}
                <button
                  onClick={() => setPreview(null)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close preview"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            {isPdf(preview) && preview.signedUrl ? (
              <iframe
                src={`${preview.signedUrl}#toolbar=1`}
                title={preview.title}
                className="w-full h-[70vh] bg-white"
              />
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No inline preview for this file type — download or open it in a new tab.
              </div>
            )}
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="px-4 pb-4 text-sm text-gray-500 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </p>
      ) : docs.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-gray-500">
          Your vault is empty. Drop your first testing document above — it stays private to you.
        </p>
      ) : filtered.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-gray-500">No documents match your search.</p>
      ) : (
        <div className="px-4 pb-4 space-y-2">
          {filtered.map((d) => (
            <div key={d.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              {editing?.id === d.id ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 text-sm text-white outline-none focus:border-violet-500/40"
                  />
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-2 py-1.5 text-xs text-white outline-none"
                    >
                      {DOC_CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#14141a]">
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="Tags (comma separated)"
                      className="flex-1 min-w-[160px] rounded-lg bg-white/[0.05] border border-white/[0.08] px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                    <Button variant="primary" size="sm" onClick={saveEdit}>
                      <Check size={13} /> Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <button
                      onClick={() => setPreview(d)}
                      className="flex items-center gap-2 min-w-0 text-left group"
                      title={isPdf(d) ? "Preview" : "Open"}
                    >
                      <FileText size={15} className="text-sky-400 shrink-0" />
                      <span className="text-sm font-medium text-white truncate group-hover:text-sky-300 transition-colors">
                        {d.title}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      {d.signedUrl && (
                        <a
                          href={d.signedUrl}
                          download={d.file_name}
                          className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                          title="Download"
                        >
                          <Download size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditing(d);
                          setEditTitle(d.title);
                          setEditCategory(d.category);
                          setEditTags(d.tags.join(", "));
                        }}
                        className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit details"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => remove(d)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={CATEGORY_COLORS[d.category] ?? "outline"} className="text-[10px]">
                      {d.category}
                    </Badge>
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 text-[10px] text-gray-500"
                      >
                        <Tag size={9} /> {t}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-600 ml-auto">
                      {formatSize(d.file_size)} · {new Date(d.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
