"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ArrowUp, Loader2, Phone, Volume2, VolumeX } from "lucide-react";
import Markdown from "react-markdown";
import { useChat, Message } from "@/lib/chat-context";
import { SUGGESTION_CHIPS, getFollowUpChips, DEFAULT_FOLLOW_UP } from "@/lib/chat-suggestions";
import { AgentSelector } from "./agent-selector";
import { AgentIcon } from "./agent-icons";
import { getAgent, ALL_AGENTS } from "@/lib/agents";
import { VoiceInputButton } from "./voice-input-button";
import { ReadAloudButton } from "./read-aloud-button";
import { HandoffForm } from "./handoff-form";
import { speakViaCloud, stopAllSpeech } from "@/lib/voice";

export function ChatInterface() {
  const { messages, isTyping, sendChat, agentId } = useChat();
  const activeAgent = getAgent(agentId) ?? ALL_AGENTS[0];
  const [input, setInput] = useState("");
  const [followUp, setFollowUp] = useState<string[]>(DEFAULT_FOLLOW_UP);
  const [showHandoff, setShowHandoff] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
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
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && !isTyping) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant" && last.content) setFollowUp(getFollowUpChips(last.content));
    }
    if (messages.length === 0) setFollowUp(DEFAULT_FOLLOW_UP);
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    await sendChat(text);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[rgba(9,9,11,0.85)] backdrop-blur-sm overflow-hidden" style={{ top: "64px" }}>
      <div className="flex-1 flex justify-center px-4 py-4 min-h-0">
        <div className="w-full max-w-[1100px] flex gap-4 min-h-0">

          {/* Chat Column */}
          <div className="flex-1 min-w-0 flex flex-col bg-[rgba(18,18,18,0.75)] backdrop-blur-xl border border-white/[0.08] rounded-[20px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="shrink-0 px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeAgent.gradient} flex items-center justify-center`}>
                    <AgentIcon name={activeAgent.icon} className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-white truncate">{activeAgent.name}</h2>
                    <p className="text-[11px] text-gray-500 truncate">{activeAgent.tagline} · OpenRouter AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setVoiceReplies((v) => !v)}
                  title={voiceReplies ? "Stop reading replies aloud" : "Read replies aloud (voice)"}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    voiceReplies
                      ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                      : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {voiceReplies ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  <span className="hidden sm:inline">{voiceReplies ? "Voice on" : "Voice"}</span>
                </button>
                <button
                  onClick={() => setShowHandoff((v) => !v)}
                  title={showHandoff ? "Close contact form" : "Talk to a human"}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    showHandoff
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Phone size={13} />
                  <span className="hidden sm:inline">{showHandoff ? "Close" : "Human"}</span>
                </button>
              </div>
            </div>

            {/* Agent selector */}
            <div className="shrink-0 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <AgentSelector />
            </div>

            {/* Human handoff */}
            {showHandoff && (
              <div className="shrink-0 px-4 py-2.5 border-b border-white/[0.06]">
                <HandoffForm onCancel={() => setShowHandoff(false)} />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 min-h-0 chat-scrollbar">
              {messages.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-3">
                    <AgentIcon name={activeAgent.icon} className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{activeAgent.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-sm">{activeAgent.description}</p>
                  <div className="sm:hidden flex gap-2 overflow-x-auto pb-2 w-full px-2">
                    {activeAgent.suggestions.slice(0, 4).map((s) => (
                      <button key={s} onClick={() => handleSend(s)} disabled={isTyping} className="shrink-0 px-3 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs text-violet-300 hover:bg-violet-600/30 transition-colors disabled:opacity-40">
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                        className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot size={14} className="text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                          <div className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                            msg.role === "user" ? "bg-violet-600 text-white rounded-br-md" : "bg-white/[0.05] border border-white/[0.06] text-gray-200 rounded-bl-md"
                          }`}>
                            {msg.role === "assistant" && !msg.content && isTyping ? (
                              <div className="flex items-center gap-1.5 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            ) : msg.role === "assistant" ? (
                              <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-violet-400">
                                <Markdown>{msg.content}</Markdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 pl-[2.375rem]">
                            {msg.role === "assistant" && msg.content && <ReadAloudButton text={msg.content} />}
                            {msg.role === "assistant" && msg.model && <span className="text-[10px] text-gray-600">via {msg.model}</span>}
                          </div>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                            <User size={14} className="text-gray-400" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && messages[messages.length - 1]?.content && (
                    <div className="flex items-center gap-2 ml-9.5">
                      <Loader2 size={11} className="text-violet-500 animate-spin" />
                      <span className="text-[10px] text-gray-600">Thinking...</span>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 pb-3.5">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3.5 py-1 focus-within:border-violet-500/30 transition-colors">
                <input ref={inputRef} type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                  placeholder="Ask about Kranthi's experience..."
                  className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm h-10" disabled={isTyping} />
                <VoiceInputButton
                  onTranscript={(t) => setInput((prev) => (prev.trim() ? `${prev} ${t}` : t))}
                  disabled={isTyping}
                  className="pr-1"
                />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-30 flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20">
                  <ArrowUp size={17} className="text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="hidden lg:flex w-[280px] shrink-0 flex-col gap-3">
            <div className="bg-[rgba(18,18,18,0.75)] backdrop-blur-xl border border-white/[0.08] rounded-[20px] p-4 sticky top-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {messages.length > 0 ? "Related Questions" : "Suggested Questions"}
              </h3>
              <div className="space-y-1.5">
                {(messages.length > 0 ? followUp : activeAgent.suggestions).map((s, i) => (
                  <motion.button key={`${s}-${i}`} whileHover={{ x: 4, backgroundColor: "rgba(139,92,246,0.08)" }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleSend(s)} disabled={isTyping}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-gray-300 hover:text-white border border-transparent hover:border-violet-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {SUGGESTION_CHIPS.find((chip) => chip.label === s)?.icon && <span className="text-base mr-2">{SUGGESTION_CHIPS.find((chip) => chip.label === s)?.icon}</span>}
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
