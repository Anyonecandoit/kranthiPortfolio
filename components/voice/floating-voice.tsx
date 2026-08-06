"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Volume2, VolumeX, Repeat, RefreshCw, X, Loader2, Sparkles,
} from "lucide-react";
import {
  useSpeechRecognition, speakViaCloud, stopAllSpeech,
} from "@/lib/voice";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "idle" | "listening" | "thinking" | "speaking" | "error";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const VOICE_OPTIONS = [
  { id: "Amy", label: "Amy · US female" },
  { id: "Joanna", label: "Joanna · US warm" },
  { id: "Brian", label: "Brian · US male" },
  { id: "Matthew", label: "Matthew · US deep" },
  { id: "Google UK English Female", label: "UK · female" },
  { id: "Google US English", label: "Google · US" },
];

const STATUS_LABEL: Record<Status, string> = {
  idle: "Tap the mic and ask anything",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  error: "Something went wrong",
};

/**
 * Hands-free voice assistant — floating on every page (above the chat bubble).
 * Tap to talk → browser STT transcribes → AI answers (with RAG) → natural
 * cloud voice reads the reply back. Auto-listen keeps the loop going.
 */
export function FloatingVoice() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [readReplies, setReadReplies] = useState(true);
  const [autoListen, setAutoListen] = useState(false);
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].id);
  const [error, setError] = useState<string | null>(null);

  // Keep latest values readable inside the async flow.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const readRepliesRef = useRef(readReplies);
  readRepliesRef.current = readReplies;
  const autoListenRef = useRef(autoListen);
  autoListenRef.current = autoListen;
  const voiceRef = useRef(voice);
  voiceRef.current = voice;
  const busyRef = useRef(false);

  const startListeningRef = useRef<() => void>(() => {});

  const ask = useCallback(
    async (text: string) => {
      setError(null);
      setMessages((m) => [...m, { role: "user", content: text }]);
      setStatus("thinking");
      busyRef.current = true;
      const finishTurn = () => {
        if (autoListenRef.current && !busyRef.current) {
          window.setTimeout(() => startListeningRef.current(), 700);
        }
      };
      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, agentId: "guide", history: messagesRef.current }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No reply");
        const reply = String(data.reply ?? "");
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        busyRef.current = false;

        if (readRepliesRef.current) {
          setStatus("speaking");
          speakViaCloud(reply, {
            voice: voiceRef.current,
            onend: () => {
              setStatus("idle");
              finishTurn();
            },
            onerror: () => {
              setStatus("idle");
              finishTurn();
            },
          });
        } else {
          setStatus("idle");
          finishTurn();
        }
      } catch (e) {
        setError((e as Error).message || "Something went wrong.");
        setStatus("idle");
        busyRef.current = false;
      }
    },
    []
  );

  const onFinal = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setStatus("thinking");
      ask(trimmed);
    },
    [ask]
  );

  const { listening, supported, transcript, startListening, stopListening } =
    useSpeechRecognition(onFinal);

  startListeningRef.current = startListening;

  const toggleMic = () => {
    if (listening) {
      stopListening();
      setStatus("idle");
      return;
    }
    stopAllSpeech();
    setError(null);
    setStatus("listening");
    startListening();
    trackEvent("voice_start", {});
  };

  const reset = () => {
    stopListening();
    stopAllSpeech();
    setMessages([]);
    setStatus("idle");
    setError(null);
  };

  const active = listening || status === "thinking" || status === "speaking";

  return (
    <>
      {/* Floating button — sits above the chat bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Voice assistant"
        className={cn(
          "fixed bottom-[6.5rem] right-6 z-[60] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95",
          open
            ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30"
            : "bg-gradient-to-br from-violet-600 to-purple-600 shadow-violet-600/30 hover:shadow-violet-500/40"
        )}
      >
        {active ? (
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
          >
            {status === "thinking" ? (
              <Loader2 size={20} className="text-white animate-spin" />
            ) : status === "speaking" ? (
              <Volume2 size={20} className="text-white" />
            ) : (
              <Mic size={20} className="text-white" />
            )}
          </motion.span>
        ) : (
          <Mic size={20} className="text-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-[10.5rem] right-6 z-[60] w-[21rem] max-w-[calc(100vw-3rem)] max-h-[min(26rem,70vh)] flex flex-col rounded-2xl border border-white/[0.08] bg-[rgba(16,16,20,0.98)] shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </span>
                <span className="text-sm font-semibold text-white">Voice Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full",
                    status === "listening"
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : status === "thinking"
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                      : status === "speaking"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/[0.06] text-gray-400 border border-white/10"
                  )}
                >
                  {listening && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {STATUS_LABEL[status]}
                </span>
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white p-1" aria-label="Close">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[8rem]">
              {messages.length === 0 && !listening && (
                <p className="text-center text-xs text-gray-600 pt-6 leading-relaxed">
                  Ask anything — about Kranthi&apos;s experience, projects,
                  skills, or this platform. Replies are spoken back to you.
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                      m.role === "user"
                        ? "bg-violet-600/25 border border-violet-500/30 text-violet-100"
                        : "bg-white/[0.06] border border-white/[0.08] text-gray-200"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {listening && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-3 py-2 text-[13px] text-cyan-200 bg-cyan-500/10 border border-cyan-500/25">
                    {transcript ? transcript : "Listening… speak now"}
                    <span className="ml-1 inline-block w-1.5 h-3 bg-cyan-400 animate-pulse align-middle" />
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && <p className="px-4 pb-1 text-[11px] text-amber-400">{error}</p>}

            {/* Controls */}
            <div className="px-4 py-3 border-t border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleMic}
                  disabled={!supported}
                  aria-label={listening ? "Stop listening" : "Start listening"}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    listening
                      ? "bg-red-500/90 text-white shadow-lg shadow-red-500/40 animate-pulse"
                      : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105",
                    !supported && "opacity-40 cursor-not-allowed"
                  )}
                >
                  {listening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px]">
                <button
                  onClick={() => setReadReplies((v) => !v)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition-colors",
                    readReplies
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 text-gray-400 hover:text-white"
                  )}
                >
                  {readReplies ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  Voice replies
                </button>
                <button
                  onClick={() => setAutoListen((v) => !v)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border transition-colors",
                    autoListen
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-white/10 text-gray-400 hover:text-white"
                  )}
                >
                  <Repeat size={13} />
                  Auto-listen
                </button>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw size={13} /> Clear
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-500">Voice</span>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="flex-1 rounded-lg bg-[rgba(16,16,20,1)] border border-white/10 px-2 py-1.5 text-[11px] text-gray-200 outline-none focus:border-cyan-500/40"
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
