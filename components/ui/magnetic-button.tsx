"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean;
}

/**
 * Magnetic button — the button subtly follows the cursor (Stripe/Linear feel).
 * Supports both <button> and <a> via href prop.
 * Includes press scale, shine sweep, and glow.
 */
export function MagneticButton({
  children,
  className,
  onClick,
  disabled,
  href,
  target,
  rel,
  download,
}: MagneticButtonProps) {
  const innerRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

  // shine sweep follows cursor
  const shineX = useTransform(springX, [-30, 30], [-120, 120]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) return;
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    x.set(0);
    y.set(0);
  };

  const isLink = Boolean(href);

  const baseClasses = cn(
    "group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 font-medium text-white transition-all duration-300",
    "hover:border-violet-500/40 hover:bg-white/[0.08] hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.4)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]",
    "disabled:opacity-40 disabled:pointer-events-none",
    className
  );

  const shine = (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
        transform: "translateX(-120%)",
      }}
      animate={{ x: shineX.get() }} // Use initial value
      transition={{ duration: 0.7, ease: "easeOut" }}
    />
  );

  if (isLink) {
    return (
      <motion.a
        ref={innerRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        download={download}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        className={baseClasses}
      >
        {shine}
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={innerRef as React.RefObject<HTMLButtonElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={baseClasses}
    >
      {shine}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}