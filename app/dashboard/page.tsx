"use client";

import { motion } from "framer-motion";
import { MessageSquare, Bookmark, Clock, User, BarChart3, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RequireAuth } from "@/components/require-auth";

const stats = [
  { label: "Conversations", value: "0", icon: MessageSquare, color: "text-violet-400" },
  { label: "Saved Chats", value: "0", icon: Bookmark, color: "text-emerald-400" },
  { label: "Projects Viewed", value: "0", icon: BarChart3, color: "text-amber-400" },
];

const nav = [
  { label: "Overview", icon: BarChart3, active: true },
  { label: "Chat History", icon: MessageSquare },
  { label: "Bookmarks", icon: Bookmark },
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  return (
    <RequireAuth>
    <div className="min-h-screen bg-transparent text-white pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Track your conversations and saved content.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <nav className="space-y-1">
                {nav.map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      item.active
                        ? "bg-violet-600/20 text-violet-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
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

            {/* Recent activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <EmptyState
                  icon={<Clock size={32} />}
                  title="No activity yet"
                  description="Start a conversation with the AI assistant to see your history here."
                  action={
                    <Button as="a" href="/chat" variant="primary" size="sm">
                      Start Chatting
                    </Button>
                  }
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
}
