"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Users, MessageSquare, Brain, Database,
  Settings, Shield, Mail, FolderLock,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequireAuth } from "@/components/require-auth";
import { AnalyticsOverview } from "@/components/admin/analytics-overview";
import { ContactInbox } from "@/components/admin/contact-inbox";
import { KnowledgeBase } from "@/components/admin/knowledge-base";
import { VisitorActivity } from "@/components/admin/visitor-activity";
import { ConversationsView } from "@/components/admin/conversations-view";
import { AIUsage } from "@/components/admin/ai-usage";
import { FeatureFlags } from "@/components/admin/feature-flags";
import { SecurityView } from "@/components/admin/security-view";
import { DocumentVault } from "@/components/admin/document-vault";
import { cn } from "@/lib/utils";

type SectionId = "analytics" | "visitors" | "conversations" | "ai" | "inbox" | "knowledge" | "documents" | "flags" | "security";

const nav: Array<{ id: SectionId; label: string; icon: LucideIcon }> = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "visitors", label: "Visitors", icon: Users },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "ai", label: "AI Usage", icon: Brain },
  { id: "inbox", label: "Inbox", icon: Mail },
  { id: "knowledge", label: "Knowledge Base", icon: Database },
  { id: "documents", label: "Document Vault", icon: FolderLock },
  { id: "flags", label: "Feature Flags", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
];

const SECTION_META: Record<SectionId, { title: string; desc: string }> = {
  analytics: { title: "Analytics", desc: "Live counters and visitor analytics." },
  visitors: { title: "Visitors", desc: "Recent site activity." },
  conversations: { title: "Conversations", desc: "AI chat conversations and message counts." },
  ai: { title: "AI Usage", desc: "How visitors are using agents and tools." },
  inbox: { title: "Inbox", desc: "Contact & human-handoff requests." },
  knowledge: { title: "Knowledge Base", desc: "Manage RAG documents that power the chat." },
  documents: { title: "Document Vault", desc: "Private storage for your testing docs — certifications, resumes, cheat sheets." },
  flags: { title: "Feature Flags", desc: "Toggle platform features site-wide." },
  security: { title: "Security & Config", desc: "Environment configuration and RLS status." },
};

export default function AdminPage() {
  const [section, setSection] = useState<SectionId>("analytics");

  return (
    <RequireAuth requiredRole="admin">
      <div className="min-h-screen bg-transparent text-white pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-medium tracking-tight">Admin Dashboard</h1>
              <Badge variant="accent">Admin</Badge>
            </div>
            <p className="text-gray-400">Monitor analytics, manage AI, and control your platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <nav className="space-y-1">
                  {nav.map((item) => {
                    const Icon = item.icon;
                    const active = section === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSection(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                          active
                            ? "bg-violet-600/20 text-white border border-violet-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                        )}
                      >
                        <Icon size={16} className={active ? "text-violet-300" : ""} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </motion.div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white">{SECTION_META[section].title}</h2>
                    <p className="text-sm text-gray-500">{SECTION_META[section].desc}</p>
                  </div>
                  {section === "analytics" && <AnalyticsOverview />}
                  {section === "visitors" && <VisitorActivity />}
                  {section === "conversations" && <ConversationsView />}
                  {section === "ai" && <AIUsage />}
                  {section === "inbox" && <ContactInbox />}
                  {section === "knowledge" && <KnowledgeBase />}
                  {section === "documents" && <DocumentVault />}
                  {section === "flags" && <FeatureFlags />}
                  {section === "security" && <SecurityView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
