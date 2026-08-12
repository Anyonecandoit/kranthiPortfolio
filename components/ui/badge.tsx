import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "outline";
  className?: string;
}

const variants = {
  default: "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)]",
  accent: "bg-[rgba(230,88,0,0.15)] text-[var(--accent)] border-[rgba(230,88,0,0.25)]",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  outline: "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
