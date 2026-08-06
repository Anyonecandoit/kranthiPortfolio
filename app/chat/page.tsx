"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { HolographicCard } from "@/components/ui/holographic-card";
import { Reveal } from "@/components/ui/reveal";
import { TechMarquee } from "@/components/ui/tech-marquee";
import { MessageCircle, Sparkles, Brain, Zap } from "lucide-react";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* Hero header */}
      <section className="relative py-16 lg:py-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal delay={0.1} y={24} blur>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium">
                <Brain className="w-4 h-4" /> AI Assistant
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
                Chat with my <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">AI Assistant</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Ask me anything about my experience, projects, skills, or test automation. Powered by multiple AI agents with specialized knowledge.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3} y={24}>
            <HolographicCard className="p-4" glow="rgba(139,92,246,0.15)">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <MessageCircle className="w-4 h-4 text-violet-400" /> Conversational
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" /> Multi-Agent
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <Zap className="w-4 h-4 text-cyan-400" /> Real-time
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                  <Brain className="w-4 h-4 text-emerald-400" /> Context Aware
                </span>
              </div>
            </HolographicCard>
          </Reveal>

          <Reveal delay={0.5} y={24}>
            <TechMarquee
              speed={30}
              items={["GPT-4o", "Claude 3.5", "Gemini 1.5", "RAG Pipeline", "Vector Search", "Tool Use", "Voice I/O", "Code Gen"]}
            />
          </Reveal>
        </div>
      </section>

      {/* Chat interface */}
      <section className="pb-12 px-4">
        <ChatInterface />
      </section>
    </main>
  );
}
