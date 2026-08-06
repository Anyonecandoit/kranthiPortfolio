"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, MessageCircle, Maximize2, Send, Phone, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { useChat, Message } from "@/lib/chat-context";
import { getFollowUpChips, DEFAULT_FOLLOW_UP } from "@/lib/chat-suggestions";
import { AgentSelector } from "./agent-selector";
import { AgentIcon } from "./agent-icons";
import { getAgent, ALL_AGENTS } from "@/lib/agents";
import { VoiceInputButton } from "./voice-input-button";
import { ReadAloudButton } from "./read-aloud-button";
import { HandoffForm } from "./handoff-form";
import { useSiteSettings } from "@/lib/settings";
import { speakViaCloud, stopAllSpeech } from "@/lib/voice";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showHandoff, setShowHandoff] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const { messages, isTyping, sendChat, agentId } = useChat();
  const activeAgent = getAgent(agentId) ?? ALL_AGENTS[0];
  const { settings } = useSiteSettings();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [followUp, setFollowUp] = useState<string[]>(DEFAULT_FOLLOW_UP);
  // Speaks the newest assistant reply once streaming finishes.
  const lastSpokenRef = useRef(-1);

  useEffect(() => {
    const lastIdx = messages.length - 1;
    const last = messages[lastIdx];
    if (!voiceReplies) {
      stopAllSpeech();
      lastSpokenRef.current = lastIdx;
      return;
    }
    if (isTyping) return;
    if (last && last.role === "assistant" && last.content && lastIdx > lastSpokenRef.current) {
      lastSpokenRef.current = lastIdx;
      speakViaCloud(last.content);
    }
  }, [messages, isTyping, voiceReplies]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0 && !isTyping) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant" && last.content) {
        setFollowUp(getFollowUpChips(last.content));
      }
    }
    if (messages.length === 0) setFollowUp(DEFAULT_FOLLOW_UP);
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    await sendChat(text);
    setInput("");
  };

  if (settings.show_ai_chat === "false") return null;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 flex items-center justify-center transition-shadow"
            aria-label="Open AI chat"
          >
            <MessageCircle size={24} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[400px] h-[560px] sm:h-[600px] rounded-2xl bg-[rgba(18,18,18,0.92)] backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeAgent.gradient} flex items-center justify-center`}>
                  <AgentIcon name={activeAgent.icon} className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none">{activeAgent.name}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">● Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVoiceReplies((v) => !v)}
                  className={`p-1.5 rounded-lg transition-colors ${voiceReplies ? "text-cyan-400 bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
                  title={voiceReplies ? "Voice replies on" : "Read replies aloud"}
                >
                  {voiceReplies ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                <button
                  onClick={() => setShowHandoff((v) => !v)}
                  className={`p-1.5 rounded-lg transition-colors ${showHandoff ? "text-emerald-400 bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
                  title={showHandoff ? "Close contact form" : "Talk to a human"}
                >
                  <Phone size={14} />
                </button>
                <Link href="/chat" className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Open full chat">
                  <Maximize2 size={14} />
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Agent selector */}
            <div className="shrink-0 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
              <AgentSelector compact />
            </div>

            {/* Human handoff */}
            {showHandoff && (
              <div className="shrink-0 px-3 py-2 border-b border-white/[0.06]">
                <HandoffForm onCancel={() => setShowHandoff(false)} />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3 min-h-0 chat-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeAgent.gradient} opacity-90 flex items-center justify-center mb-3`}>
                    <AgentIcon name={activeAgent.icon} className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{activeAgent.name}</p>
                  <p className="text-xs text-gray-500 mb-4">{activeAgent.description}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[340px]">
                    {activeAgent.suggestions.slice(0, 4).map((s) => (
                      <button key={s} onClick={() => handleSend(s)} disabled={isTyping}
                        className="px-2.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-400 hover:text-violet-400 hover:border-violet-500/30 transition-all disabled:opacity-40">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={12} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                        <div className={`rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                          msg.role === "user" ? "bg-violet-600 text-white rounded-br-sm" : "bg-white/[0.05] border border-white/[0.06] text-gray-200 rounded-bl-sm"
                        }`}>
                          {msg.role === "assistant" && !msg.content && isTyping ? (
                            <div className="flex items-center gap-1 py-0.5">
                              <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          ) : msg.role === "assistant" ? (
                            <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-violet-400">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          )}
                        </div>
                        {msg.role === "assistant" && msg.content && (
                          <div className="mt-1">
                            <ReadAloudButton text={msg.content} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Follow-up suggestions */}
                  {!isTyping && messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].content && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {followUp.map((s, i) => (
                        <button key={i} onClick={() => handleSend(s)} disabled={isTyping}
                          className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-400 hover:text-violet-400 hover:border-violet-500/30 transition-all disabled:opacity-40">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <div ref={endRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 px-3 pb-3">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1 focus-within:border-violet-500/30 transition-colors">
                <input ref={inputRef} type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                  placeholder="Ask about Kranthi..."
                  className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm h-9"
                  disabled={isTyping} />
                <VoiceInputButton
                  onTranscript={(t) => setInput((prev) => (prev.trim() ? `${prev} ${t}` : t))}
                  disabled={isTyping}
                  className="pr-0.5"
                />
                <button onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-30 flex items-center justify-center shrink-0 transition-all shadow-lg shadow-violet-600/20">
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
