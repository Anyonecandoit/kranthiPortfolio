"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";

/* ─── tech items for each ring ─────────────────────────────────────── */
const ring1 = ["Next.js", "React", "TypeScript", "Selenium", "Playwright", "Cypress"];
const ring2 = ["Java", "Python", "PostgreSQL", "AWS", "Docker", "Redis"];
const ring3 = ["GraphQL", "Tailwind", "Jenkins", "Supabase", "Prisma"];

/* ─── revolving orbital diagram ────────────────────────────────────── */
export function OrbitalDiagram() {
  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const r1 = 100;
  const r2 = 170;
  const r3 = 240;

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* Dotted ring circles */}
        {[r1, r2, r3].map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />
        ))}

        {/* ── Ring 1: inner ring — rotates clockwise, 40s ── */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "orbit-spin 40s linear infinite" }}>
          {ring1.map((label, i) => {
            const angle = (i / ring1.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = cx + r1 * Math.cos(rad);
            const y = cy + r1 * Math.sin(rad);
            return (
              <g key={label}>
                <circle cx={x} cy={y} r="5" fill="var(--accent)" />
                {/* Counter-rotate label so it stays upright */}
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  className="fill-[var(--text-secondary)]"
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-jetbrains-mono)",
                    letterSpacing: "0.04em",
                    transformOrigin: `${x}px ${y}px`,
                    animation: "orbit-counter-spin 40s linear infinite",
                  }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Ring 2: middle ring — rotates counter-clockwise, 60s ── */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "orbit-spin-ccw 60s linear infinite" }}>
          {ring2.map((label, i) => {
            const angle = (i / ring2.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = cx + r2 * Math.cos(rad);
            const y = cy + r2 * Math.sin(rad);
            return (
              <g key={label}>
                <circle cx={x} cy={y} r="4" fill="var(--text-primary)" opacity="0.7" />
                <text
                  x={x}
                  y={y + 18}
                  textAnchor="middle"
                  className="fill-[var(--text-secondary)]"
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-jetbrains-mono)",
                    letterSpacing: "0.04em",
                    transformOrigin: `${x}px ${y}px`,
                    animation: "orbit-counter-spin-ccw 60s linear infinite",
                  }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Ring 3: outer ring — rotates clockwise, 80s ── */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "orbit-spin 80s linear infinite" }}>
          {ring3.map((label, i) => {
            const angle = (i / ring3.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = cx + r3 * Math.cos(rad);
            const y = cy + r3 * Math.sin(rad);
            return (
              <g key={label}>
                <circle cx={x} cy={y} r="3.5" fill="var(--text-primary)" opacity="0.5" />
                <text
                  x={x}
                  y={y + 16}
                  textAnchor="middle"
                  className="fill-[var(--text-secondary)]"
                  style={{
                    fontSize: "9px",
                    fontFamily: "var(--font-jetbrains-mono)",
                    letterSpacing: "0.04em",
                    transformOrigin: `${x}px ${y}px`,
                    animation: "orbit-counter-spin 80s linear infinite",
                  }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Connection lines from center to ring-1 items (rotate with ring 1) ── */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "orbit-spin 40s linear infinite" }} opacity="0.25">
          {ring1.map((_, i) => {
            const angle = (i / ring1.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = cx + r1 * Math.cos(rad);
            const y = cy + r1 * Math.sin(rad);
            return (
              <line
                key={`cl1-${i}`}
                x1={cx} y1={cy} x2={x} y2={y}
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}
        </g>

        {/* ── Connection lines ring1 → ring2 (rotate with ring 2) ── */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "orbit-spin-ccw 60s linear infinite" }} opacity="0.15">
          {ring2.map((_, i) => {
            const angle = (i / ring2.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = cx + r2 * Math.cos(rad);
            const y = cy + r2 * Math.sin(rad);
            // Connect to nearest ring1 position (also in ring2's frame)
            const ring1Angle = ((i * 2) / ring1.length) * 360;
            const rad1 = (ring1Angle * Math.PI) / 180;
            // Ring1 items are in ring1's own rotation, approximate with static positions
            const r1x = cx + r1 * Math.cos((i / ring1.length) * 2 * Math.PI);
            const r1y = cy + r1 * Math.sin((i / ring1.length) * 2 * Math.PI);
            return (
              <line
                key={`cl2-${i}`}
                x1={r1x} y1={r1y} x2={x} y2={y}
                stroke="var(--text-primary)"
                strokeWidth="0.8"
                strokeDasharray="2 3"
              />
            );
          })}
        </g>

        {/* ── Center icon (static, with subtle pulse) ── */}
        <rect
          x={cx - 26}
          y={cy - 26}
          width={52}
          height={52}
          rx={10}
          fill="var(--text-primary)"
          style={{ animation: "orbit-pulse 4s ease-in-out infinite" }}
        />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--bg-primary)"
          style={{
            fontSize: "7.5px",
            fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          KRANTHI KUMAR
        </text>
        <text
          x={cx}
          y={cy + 7}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--bg-primary)"
          style={{
            fontSize: "7.5px",
            fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          KATTA
        </text>
      </svg>
    </div>
  );
}

/* ─── shared copy for the Integrations block ───────────────────────── */
const STACK_DESCRIPTION =
  "I CONNECT TOOLS INTO ONE SYSTEM, ELIMINATING MANUAL WORK AND SAVING TIME.";

const stackStats = [
  { num: "17+", label: "TECHNOLOGIES" },
  { num: "5+", label: "CLOUD PLATFORMS" },
  { num: "10+", label: "FRAMEWORKS" },
  { num: "3+", label: "CI/CD TOOLS" },
];

function StackStats() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {stackStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
        >
          <div className="text-2xl font-medium tracking-tight">{stat.num}</div>
          <div className="label-mono text-[var(--text-secondary)] text-[0.55rem] mt-1">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StackDescription() {
  return (
    <p
      className="text-[var(--text-secondary)] text-base leading-relaxed max-w-md"
      style={{ fontFamily: "var(--font-jetbrains-mono)", letterSpacing: "0.02em" }}
    >
      {STACK_DESCRIPTION}
    </p>
  );
}

/* ─── reusable Integrations block (heading + orbital + copy + stats) ──
 *
 * variant="row"    — side-by-side layout used by the standalone section
 * variant="column" — stacked layout used in the hero (right of SIGN IN)
 */
export function IntegrationsBlock({
  variant = "row",
  className = "",
}: {
  variant?: "row" | "column";
  className?: string;
}) {
  if (variant === "column") {
    return (
      <div className={`flex flex-col items-center lg:items-start gap-6 ${className}`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-3xl font-medium tracking-[-0.04em]"
        >
          Integrations
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          <OrbitalDiagram />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <StackDescription />
        </motion.div>
        <StackStats />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${className}`}>
      {/* Revolving orbital diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <OrbitalDiagram />
      </motion.div>

      {/* Description + stats */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <StackDescription />
        <div className="mt-8">
          <StackStats />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── standalone 07 STACK section ──────────────────────────────────── */
export function TechStack() {
  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative overflow-hidden">
      <GridBackground columns={4} />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel number="07" title="STACK" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.05em] mb-16"
        >
          Integrations
        </motion.h2>

        <IntegrationsBlock />
      </div>
    </section>
  );
}
