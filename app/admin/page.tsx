"use client";

import { motion } from "framer-motion";
import {
  BarChart3, Users, MessageSquare, Brain, Database,
  Settings, Shield, FileText, Eye, TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const nav = [
  { label: "Analytics", icon: BarChart3, active: true },
  { label: "Visitors", icon: Users },
  { label: "Conversations", icon: MessageSquare },
  { label: "AI Usage", icon: Brain },
  { label: "Knowledge Base", icon: Database },
  { label: "Feature Flags", icon: Settings },
  { label: "Security", icon: Shield },
];

const stats = [
  { label: "Total Visitors", value: "—", change: "", icon: Users, color: "text-violet-400" },
  { label: "AI Queries", value: "—", change: "", icon: Brain, color: "text-emerald-400" },
  { label: "Avg. Session", value: "—", change: "", icon: Clock, color: "text-amber-400" },
  { label: "Bounce Rate", value: "—", change: "", icon: TrendingUp, color: "text-rose-400" },
];

function Clock(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-transparent text-white pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Badge variant="accent">Admin</Badge>
          </div>
          <p className="text-gray-400">Monitor analytics, manage AI, and control your platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <nav className="space-y-1">
                {nav.map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      item.active ? "bg-violet-600/20 text-violet-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </Card>
          </motion.div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Analytics placeholder */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <EmptyState
                  icon={<Eye size={32} />}
                  title="Analytics will appear here"
                  description="Once connected to Supabase, visitor analytics and AI usage metrics will populate automatically."
                  action={<Button variant="secondary" size="sm">Connect Database</Button>}
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
