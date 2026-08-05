"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Floating chat widget — appears on all pages.
 * Click opens a mini-chat preview; "Open Full Chat" goes to /chat.
 */
export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Chat bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 flex items-center justify-center transition-shadow"
            aria-label="Open chat"
          >
            <MessageCircle size={24} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mini chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Assistant</p>
                  <p className="text-xs text-emerald-400">● Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Preview message */}
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300">
                  Hi! I&apos;m Kranthi&apos;s AI assistant. Ask me anything about his experience, projects, or skills.
                </div>
              </div>
            </div>

            {/* Input + CTA */}
            <div className="px-4 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && window.location.assign("/chat")}
                  placeholder="Quick question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500/50"
                />
                <button
                  onClick={() => window.location.assign("/chat")}
                  className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 transition-colors"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <Link
                href="/chat"
                className="block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors py-1"
              >
                Open Full Chat →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
