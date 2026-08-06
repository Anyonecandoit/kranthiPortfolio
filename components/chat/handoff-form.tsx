"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send, X } from "lucide-react";
import { submitContactRequest } from "@/lib/contact";

/**
 * "Talk to a human" inline form. Posts a contact request (chat-handoff source)
 * and shows a success state. Used inside both chat surfaces.
 */
export function HandoffForm({ onCancel }: { onCancel?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      await submitContactRequest({ name, email, message, source: "chat-handoff" });
      setDone(true);
    } catch (e) {
      setError((e as Error).message || "Could not send the request.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
        <div className="flex items-center gap-2 text-emerald-300 font-medium mb-1">
          <CheckCircle2 size={16} /> Request sent
        </div>
        <p className="text-gray-300">
          Thanks — your details have been passed to Kranthi. He&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3.5 text-sm">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-semibold text-white">Talk to a human</p>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-white" aria-label="Close">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email (optional)"
          className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would you like to discuss?"
          rows={3}
          className="w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/40 resize-none"
        />
        {error && <p className="text-xs text-amber-400">{error}</p>}
        <button
          onClick={submit}
          disabled={!message.trim() || sending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-40 transition-colors"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Send request
        </button>
      </div>
    </div>
  );
}
