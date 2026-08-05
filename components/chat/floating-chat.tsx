"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles, X, MessageCircle, Maximize2, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { useChat, Message } from "@/lib/chat-context";

const INITIAL_SUGGESTIONS = [
  "📁 What projects has Kranthi built?",
  "💼 Tell me about his experience",
  "🧪 What testing tools does he use?",
  "🤖 Explain his AI experience",
  "⚙️ What are his strongest skills?",
  "🏆 What certifications does he have?",
  "📞 How can I contact him?",
  "🎓 Tell me about his education",
  "🚀 Why should I hire Kranthi?",
  "⭐ Summarize his profile",
];

function getFollowUpSuggestions(lastResponse: string): string[] {
  const lower = lastResponse.toLowerCase();
  if (lower.includes("project") || lower.includes("built"))
    return ["Architecture", "Tech Stack", "GitHub", "Challenges", "Automation", "Outcomes"];
  if (lower.includes("experience") || lower.includes("worked"))
    return ["Current Role", "Previous Companies", "Achievements", "Technologies", "Timeline"];
  if (lower.includes("skill") || lower.includes("tool") || lower.includes("testing"))
    return ["Selenium", "Playwright", "API Testing", "Performance", "CI/CD", "Languages"];
  if (lower.includes("contact") || lower.includes("email") || lower.includes("hire"))
    return ["Resume", "Email", "LinkedIn", "Availability", "Consulting", "Collaboration"];
  if (lower.includes("certif"))
    return ["AWS", "ISTQB", "Oracle", "Azure", "Education", "Experience"];
  if (lower.includes("ai") || lower.includes("machine"))
    return ["Test Generation", "Self-Healing", "Reporting", "Prioritization", "Vision"];
  return ["Projects", "Skills", "Experience", "Contact", "Certifications", "Education"];
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isTyping, sendChat } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [followUp, setFollowUp] = useState<string[]>(INITIAL_SUGGESTIONS);

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
        setFollowUp(getFollowUpSuggestions(last.content));
      }
    }
    if (messages.length === 0) setFollowUp(INITIAL_SUGGESTIONS);
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    await sendChat(text);
    setInput("");
  };

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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none">AI Assistant</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">● Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href="/chat" className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Open full chat">
                  <Maximize2 size={14} />
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-3 min-h-0 chat-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-3">
                    <Sparkles size={18} className="text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">Hi there!</p>
                  <p className="text-xs text-gray-500 mb-4">I&apos;m Kranthi&apos;s AI assistant. Ask me anything about his skills, projects, or experience.</p>
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-[340px]">
                    {INITIAL_SUGGESTIONS.slice(0, 6).map((s, i) => (
                      <button key={i} onClick={() => handleSend(s.replace(/^.\s/, ""))} disabled={isTyping}
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
