"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles, ArrowUp, Loader2 } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
}

const SUGGESTIONS = [
  { icon: "📁", text: "What projects has Kranthi built?", label: "Projects" },
  { icon: "💼", text: "Tell me about his work experience", label: "Experience" },
  { icon: "🧪", text: "What testing tools does he use?", label: "Testing Tools" },
  { icon: "🤖", text: "Explain his AI experience", label: "AI Experience" },
  { icon: "⚙️", text: "What are his strongest technical skills?", label: "Skills" },
  { icon: "🏆", text: "What certifications does he have?", label: "Certifications" },
  { icon: "📞", text: "How can I contact him?", label: "Contact" },
  { icon: "🎓", text: "Tell me about his education", label: "Education" },
  { icon: "🚀", text: "Why should I hire Kranthi?", label: "Why Hire" },
  { icon: "⭐", text: "Summarize his profile", label: "Summary" },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const c = messagesContainerRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date() }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "API Error" }));
        throw new Error(err.error || "API Error");
      }

      const modelUsed = response.headers.get("X-Model-Used") || "";
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: full, model: modelUsed } : m));
        }
      }
    } catch (error) {
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: `⚠️ ${(error as Error).message}` } : m));
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    /* PAGE: full viewport, no scroll, no footer */
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden" style={{ top: "64px" }}>
      <div className="flex-1 flex justify-center px-4 py-4 min-h-0">
        <div className="w-full max-w-[1100px] flex gap-4 min-h-0">

          {/* === LEFT: Chat Column (70%) === */}
          <div className="flex-1 min-w-0 flex flex-col bg-[rgba(18,18,18,0.75)] backdrop-blur-xl border border-white/[0.08] rounded-[20px] shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="shrink-0 px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Kranthi&apos;s AI Assistant</h2>
                  <p className="text-[11px] text-gray-500">Based on resume data · OpenRouter AI</p>
                </div>
              </div>
            </div>

            {/* Messages — scrollable */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 min-h-0 chat-scrollbar">
              {messages.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-3">
                    <Sparkles size={20} className="text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Ask me anything</h3>
                  <p className="text-xs text-gray-500">I can answer questions about Kranthi&apos;s resume, skills, projects, and experience.</p>
                  {/* Mobile: show chips here */}
                  <div className="sm:hidden flex gap-2 mt-4 overflow-x-auto pb-2 w-full px-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s.text)} disabled={isTyping} className="shrink-0 px-3 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs text-violet-300 hover:bg-violet-600/30 transition-colors disabled:opacity-40">
                        {s.icon} {s.label}
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
                              <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:text-white prose-p:text-gray-200 prose-li:text-gray-200 prose-strong:text-white prose-a:text-violet-400">
                                <Markdown>{msg.content}</Markdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}
                          </div>
                          {msg.role === "assistant" && msg.model && <span className="text-[10px] text-gray-600 ml-1">via {msg.model}</span>}
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
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 pb-3.5">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3.5 py-1 focus-within:border-violet-500/30 transition-colors">
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                  placeholder="Ask about Kranthi's experience..." className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm h-10" disabled={isTyping} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-30 flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20">
                  <ArrowUp size={17} className="text-white" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* === RIGHT: Suggestions Panel (desktop only) === */}
          <div className="hidden lg:flex w-[280px] shrink-0 flex-col gap-3">
            <div className="bg-[rgba(18,18,18,0.75)] backdrop-blur-xl border border-white/[0.08] rounded-[20px] p-4 sticky top-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Suggested Questions</h3>
              <div className="space-y-1.5">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button key={i} whileHover={{ x: 4, backgroundColor: "rgba(139,92,246,0.08)" }} whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(s.text)} disabled={isTyping}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-[13px] text-gray-300 hover:text-white hover:border-violet-500/30 border border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2.5">
                    <span className="text-base">{s.icon}</span>
                    <span>{s.label}</span>
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
