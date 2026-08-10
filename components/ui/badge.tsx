import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "outline";
  className?: string;
}

const variants = {
  default: "bg-gray-700/60 text-gray-300 border-white/10",
  accent: "bg-[rgba(230,88,0,0.15)] text-[var(--accent)] border-[rgba(230,88,0,0.25)]",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  outline: "bg-transparent text-gray-400 border-white/15",
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
