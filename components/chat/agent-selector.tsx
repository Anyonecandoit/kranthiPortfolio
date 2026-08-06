"use client";

import { useChat } from "@/lib/chat-context";
import { ALL_AGENTS } from "@/lib/agents";
import { AgentIcon } from "./agent-icons";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

/**
 * Horizontal chip selector for the 8 AI agents. Shared by the floating
 * widget and the /chat page. Selecting an agent switches its thread.
 */
export function AgentSelector({ compact = false }: { compact?: boolean }) {
  const { agentId, setAgent } = useChat();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      <span className="shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500">
        <Sparkles size={11} /> Agents
      </span>
      {ALL_AGENTS.map((agent) => {
        const active = agentId === agent.id;
        return (
          <button
            key={agent.id}
            onClick={() => setAgent(agent.id)}
            title={agent.description}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
              active
                ? "bg-violet-600/25 border-violet-500/40 text-violet-200"
                : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <AgentIcon name={agent.icon} className="h-3.5 w-3.5" />
            <span>{compact ? agent.name.split(" ")[0] : agent.name}</span>
          </button>
        );
      })}
    </div>
  );
}
