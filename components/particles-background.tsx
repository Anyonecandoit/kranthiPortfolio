"use client";

import { useEffect, useRef } from "react";

/**
 * Premium particle constellation — large, bright, clearly visible.
 * DNA-like connecting lines between nearby particles.
 * Covers the full page behind all content.
 */
export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    // Honor reduced-motion: draw a single static frame, no animation loop.
    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cap devicePixelRatio at 2 — full-DPR canvases are expensive on phones.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Full page coverage — not just viewport
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight) * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${Math.max(window.innerHeight, document.documentElement.scrollHeight)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles — large, bright, many
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
    }

    const count = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5, // 1.5–4.5px — much larger
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.4 + 0.6, // 0.6–1.0 — bright
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const maxDist = 150; // larger connection distance

    let animFrame: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16, 3); // cap delta
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      for (const p of particles) {
        p.x += p.speedX * dt;
        p.y += p.speedY * dt;
        p.pulse += 0.02 * dt;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      }

      // Draw constellation lines (DNA-like connections)
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.4; // bright lines
            ctx.strokeStyle = `rgba(230, 88, 0, ${alpha})`; // accent lines
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const glow = 0.3 + Math.sin(p.pulse) * 0.2;

        // Glow halo
        ctx.fillStyle = `rgba(230, 88, 0, ${glow * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) animFrame = requestAnimationFrame(animate);
    };

    if (prefersReduced) {
      // Draw a single static frame, then stop.
      animate(performance.now());
    } else {
      animFrame = requestAnimationFrame(animate);
    }

    // Pause when tab hidden
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else if (!prefersReduced) {
        lastTime = performance.now();
        animFrame = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
