"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { SectionLabel } from "@/components/ui/section-label";
import { MessageCircle, Sparkles, Brain, Zap } from "lucide-react";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero header */}
      <section className="relative py-16 lg:py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel number="AI" title="ASSISTANT" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance">
              Chat with my AI
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed mb-10">
              Ask me anything about my experience, projects, skills, or test automation.
              Powered by multiple AI agents with specialized knowledge.
            </p>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)] mb-10"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-color)]">
              <MessageCircle className="w-4 h-4 text-accent" /> Conversational
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-color)]">
              <Sparkles className="w-4 h-4 text-accent" /> Multi-Agent
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-color)]">
              <Zap className="w-4 h-4 text-accent" /> Real-time
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-color)]">
              <Brain className="w-4 h-4 text-accent" /> Context Aware
            </span>
          </motion.div>
        </div>
      </section>

      {/* Chat interface */}
      <section className="pb-12 px-4">
        <ChatInterface />
      </section>
    </main>
  );
}
