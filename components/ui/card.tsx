"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Glass-morphism card with optional hover effect.
 * Sizes: sm | md | lg
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, hover = false, size = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg transition-all duration-300",
        sizes[size],
        hover && "hover:border-[var(--text-secondary)] hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Card header — for titles inside a card.
 */
export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

/**
 * Card title — used inside CardHeader.
 */
export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold text-[var(--text-primary)]", className)}>
      {children}
    </h3>
  );
}
