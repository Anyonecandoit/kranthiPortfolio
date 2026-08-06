"use client";

import {
  Briefcase,
  ClipboardList,
  Rocket,
  Wrench,
  BrainCircuit,
  FileText,
  Compass,
  TrendingUp,
  Bot,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon *names* stored in lib/agents.ts to lucide components.
 * Keeping names in the registry (not components) keeps that module
 * server-safe and this mapping UI-only.
 */
const AGENT_ICONS: Record<string, LucideIcon> = {
  Briefcase,
  ClipboardList,
  Rocket,
  Wrench,
  BrainCircuit,
  FileText,
  Compass,
  TrendingUp,
};

export function AgentIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && AGENT_ICONS[name]) || Bot;
  return <Icon className={className} />;
}
