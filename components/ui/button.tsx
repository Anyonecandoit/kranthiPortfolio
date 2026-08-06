"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Polymorphic Button — renders as <button> or <a>.
 *
 * Variants: primary | secondary | ghost | outline
 * Sizes: sm | md | lg
 */
interface ButtonBase {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBase & { as?: never; onClick?: () => void; type?: string };
type ButtonAsAnchor = ButtonBase & { as: "a"; href: string; target?: string; rel?: string; download?: boolean };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

const variants = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 active:scale-[0.98]",
  secondary:
    "bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]",
  ghost:
    "bg-transparent text-gray-300 hover:bg-white/5 hover:text-white",
  outline:
    "bg-transparent text-violet-400 border border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-400/50 active:scale-[0.98]",
};

export function Button({
  variant = "primary",
  size = "md",
  as,
  startIcon,
  endIcon,
  loading,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:pointer-events-none",
    sizes[size],
    variants[variant],
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && startIcon && <span className="shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="shrink-0">{endIcon}</span>}
    </>
  );

  if (as === "a") {
    const { href, target, rel, download } = rest as ButtonAsAnchor;
    return (
      <a href={href} target={target} rel={rel} download={download} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
