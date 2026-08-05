"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Premium global animated background — canvas-based, 60fps, multi-layer.
 * Layers: gradient mesh · particles · constellation · neural nodes · stars · dust
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const t = performance.now() * 0.001;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // ── Layer 1: Gradient mesh — slow drifting radial gradients ──
    const g1 = ctx.createRadialGradient(
      W * 0.3 + Math.sin(t * 0.08) * W * 0.15,
      H * 0.4 + Math.cos(t * 0.06) * H * 0.1,
      0, W * 0.3, H * 0.4, W * 0.5
    );
    g1.addColorStop(0, "rgba(88, 28, 135, 0.08)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(
      W * 0.7 + Math.cos(t * 0.05) * W * 0.1,
      H * 0.6 + Math.sin(t * 0.07) * H * 0.12,
      0, W * 0.7, H * 0.6, W * 0.4
    );
    g2.addColorStop(0, "rgba(67, 20, 120, 0.06)");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // ── Layer 6: Blurred light blobs — large, slow ──
    for (let i = 0; i < 3; i++) {
      const bx = W * (0.2 + i * 0.3) + Math.sin(t * (0.04 + i * 0.01)) * W * 0.2;
      const by = H * (0.3 + i * 0.2) + Math.cos(t * (0.03 + i * 0.008)) * H * 0.15;
      const r = W * (0.08 + i * 0.02);
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
      g.addColorStop(0, `rgba(139, 92, 246, ${0.04 + i * 0.01})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 2: Particles + Layer 3: Constellation lines ──
    const particleCount = Math.min(80, Math.floor(W / 20));
    const maxDist = 120;

    // Deterministic particle positions using seeded random
    const particles: Array<{ x: number; y: number; vx: number; vy: number; o: number }> = [];
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 137.508;
      const px = ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1 * W;
      const py = ((Math.cos(seed * 1.3) * 23421.6312) % 1 + 1) % 1 * H;
      const vx = Math.sin(seed * 0.7 + t * 0.1) * 0.3;
      const vy = Math.cos(seed * 0.5 + t * 0.08) * 0.25;
      // Subtle magnetic pull toward mouse
      const dx = mx - px;
      const dy = my - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pull = dist < 200 ? (200 - dist) / 200 * 0.15 : 0;

      const finalX = px + vx * t * 2 + dx * pull;
      const finalY = py + vy * t * 2 + dy * pull;
      const opacity = 0.4 + Math.sin(seed + t * 0.5) * 0.25;

      particles.push({ x: finalX % W, y: finalY % H, vx, vy, o: opacity });
    }

    // Draw constellation lines
    ctx.lineWidth = 0.5;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.2;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 4: Neural network nodes — fewer, larger, pulsing ──
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
      const seed = i * 97.3;
      const nx = ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1 * W;
      const ny = ((Math.cos(seed * 1.1) * 12345.6789) % 1 + 1) % 1 * H;
      const pulse = 0.3 + Math.sin(t * 0.8 + seed) * 0.15;

      ctx.fillStyle = `rgba(139, 92, 246, ${pulse})`;
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 15);
      ng.addColorStop(0, `rgba(139, 92, 246, ${pulse * 0.3})`);
      ng.addColorStop(1, "transparent");
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.arc(nx, ny, 15, 0, Math.PI * 2);
      ctx.fill();

      // Connect to nearby nodes
      for (let j = i + 1; j < nodeCount; j++) {
        const seed2 = j * 97.3;
        const nx2 = ((Math.sin(seed2) * 43758.5453) % 1 + 1) % 1 * W;
        const ny2 = ((Math.cos(seed2 * 1.1) * 12345.6789) % 1 + 1) % 1 * H;
        const d = Math.sqrt((nx - nx2) ** 2 + (ny - ny2) ** 2);
        if (d < 250) {
          const alpha = (1 - d / 250) * 0.06;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(nx2, ny2);
          ctx.stroke();
        }
      }
    }

    // ── Layer 5: Stars — tiny bright dots with twinkle ──
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
      const seed = i * 73.7;
      const sx = ((Math.sin(seed) * 12345.6789) % 1 + 1) % 1 * W;
      const sy = ((Math.cos(seed * 2.3) * 54321.9876) % 1 + 1) % 1 * H;
      const twinkle = 0.5 + Math.sin(t * 2 + seed) * 0.35;
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 7: Dust — very faint, slow, tiny ──
    const dustCount = 30;
    for (let i = 0; i < dustCount; i++) {
      const seed = i * 211.3;
      const dx = ((Math.sin(seed) * 31415.9265) % 1 + 1) % 1 * W;
      const dy = ((Math.cos(seed * 0.8) * 27182.8182) % 1 + 1) % 1 * H;
      const dustX = dx + Math.sin(t * 0.15 + seed) * 30;
      const dustY = dy + Math.cos(t * 0.12 + seed) * 20;
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.beginPath();
      ctx.arc(dustX % W, dustY % H, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // Pause when tab inactive
    let running = true;
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
      } else {
        running = true;
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      if (!running) return;
      if (!prefersReduced) draw();
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
