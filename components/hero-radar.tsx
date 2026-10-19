"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Activity,
  CheckCircle2,
  Zap,
  Radio,
  Layers,
  Shield,
  Clock,
  Terminal,
} from "lucide-react";

export interface RadarNode {
  id: string;
  name: string;
  shortName?: string;
  category: string;
  angle: number; // 0-360 degrees
  radius: number; // percentage from center
  x: number; // percentage
  y: number; // percentage
  status: "LOCKED" | "VERIFIED" | "ACTIVE";
  latency: string;
  passRate: string;
  capability: string;
}

export const RADAR_NODES: RadarNode[] = [
  // Outer Ring (r=42-44%) - Infrastructure & Scale
  {
    id: "k8s",
    name: "Kubernetes",
    category: "Cloud Orchestration",
    angle: 270,
    radius: 42,
    x: 50,
    y: 11,
    status: "LOCKED",
    latency: "8ms",
    passRate: "100%",
    capability: "Cluster deployments & pod container validation",
  },
  {
    id: "jmeter",
    name: "JMeter",
    category: "Performance Testing",
    angle: 342,
    radius: 43,
    x: 88,
    y: 38,
    status: "ACTIVE",
    latency: "24ms",
    passRate: "99.9%",
    capability: "10,000+ virtual user load & stress testing",
  },
  {
    id: "appium",
    name: "Appium",
    category: "Mobile Testing",
    angle: 48,
    radius: 42,
    x: 80,
    y: 84,
    status: "VERIFIED",
    latency: "35ms",
    passRate: "99.8%",
    capability: "Cross-device native & hybrid Android/iOS suites",
  },
  {
    id: "jenkins",
    name: "Jenkins",
    category: "CI/CD Gateways",
    angle: 132,
    radius: 42,
    x: 20,
    y: 84,
    status: "LOCKED",
    latency: "12ms",
    passRate: "100%",
    capability: "Automated PR gating & zero-defect quality gates",
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    shortName: "Kafka",
    category: "Event Streaming",
    angle: 198,
    radius: 43,
    x: 12,
    y: 38,
    status: "ACTIVE",
    latency: "4ms",
    passRate: "100%",
    capability: "Asynchronous event stream validation & retries",
  },

  // Middle Ring (r=30-33%) - Core Automation & Microservices
  {
    id: "restassured",
    name: "Rest Assured",
    category: "API Automation",
    angle: 313,
    radius: 31,
    x: 74,
    y: 24,
    status: "VERIFIED",
    latency: "14ms",
    passRate: "100%",
    capability: "200+ endpoint contract & JSON schema validation",
  },
  {
    id: "datadog",
    name: "Datadog",
    category: "APM Telemetry",
    angle: 29,
    radius: 31,
    x: 77,
    y: 65,
    status: "LOCKED",
    latency: "6ms",
    passRate: "99.9%",
    capability: "Distributed tracing, synthetic monitoring & alerts",
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Databases",
    angle: 151,
    radius: 31,
    x: 23,
    y: 65,
    status: "VERIFIED",
    latency: "3ms",
    passRate: "100%",
    capability: "Master-slave replication & ACID integrity validation",
  },
  {
    id: "selenium",
    name: "Selenium",
    category: "Web Automation",
    angle: 227,
    radius: 31,
    x: 26,
    y: 24,
    status: "LOCKED",
    latency: "18ms",
    passRate: "99.9%",
    capability: "Cross-browser grid automation & POM architecture",
  },

  // Inner Ring (r=18-20%) - Harness Foundation
  {
    id: "java",
    name: "Java",
    category: "Core Language",
    angle: 90,
    radius: 19,
    x: 50,
    y: 73,
    status: "LOCKED",
    latency: "1ms",
    passRate: "100%",
    capability: "OOP test harness, multithreading & JVM memory",
  },
  {
    id: "docker",
    name: "Docker",
    category: "Containers",
    angle: 191,
    radius: 19,
    x: 34,
    y: 47,
    status: "VERIFIED",
    latency: "5ms",
    passRate: "100%",
    capability: "Isolated containerized testing environments",
  },
  {
    id: "postman",
    name: "Postman",
    category: "API Tooling",
    angle: 349,
    radius: 19,
    x: 66,
    y: 47,
    status: "VERIFIED",
    latency: "9ms",
    passRate: "100%",
    capability: "Newman automated collections & mock environments",
  },
];

const TELEMETRY_FEED = [
  "REST ASSURED ❯ 214 endpoints contract verified • 200 OK",
  "APACHE KAFKA ❯ transaction stream validated • 0 lag",
  "SELENIUM GRID ❯ parallel execution active across 4 nodes",
  "JMETER RUN ❯ 10,000 VUs benchmark • p99 latency: 42ms",
  "JENKINS GATE ❯ PR #142 test suite passed • 0 defects",
  "DATADOG APM ❯ synthetic telemetry health: 100% GREEN",
];

interface HeroRadarProps {
  activeNodeId: string | null;
  onSelectNode: (node: RadarNode | null) => void;
}

export function HeroRadar({ activeNodeId, onSelectNode }: HeroRadarProps) {
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [activeSweepAngle, setActiveSweepAngle] = useState(0);
  const [blipNodeId, setBlipNodeId] = useState<string | null>("restassured");

  // Cycle telemetry ticker feed
  useEffect(() => {
    const ticker = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % TELEMETRY_FEED.length);
    }, 2800);
    return () => clearInterval(ticker);
  }, []);

  // Radar beam sweep rotation & node blip detection
  useEffect(() => {
    const sweepInterval = setInterval(() => {
      setActiveSweepAngle((prev) => {
        const next = (prev + 3) % 360;
        // Check if any node is within detection cone (+/- 14 degrees)
        const hit = RADAR_NODES.find((node) => {
          const diff = Math.abs(node.angle - next);
          return diff <= 14 || diff >= 346;
        });
        if (hit && hit.id !== blipNodeId) {
          setBlipNodeId(hit.id);
        }
        return next;
      });
    }, 45);

    return () => clearInterval(sweepInterval);
  }, [blipNodeId]);

  return (
    <div className="relative w-full h-[210px] sm:h-[230px] rounded-xs border border-[var(--border-color)]/70 bg-[var(--bg-primary)]/70 overflow-hidden select-none flex flex-col justify-between p-2 sm:p-2.5">
      {/* Background Holographic Coordinate Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--accent) 1px, transparent 1px), linear-gradient(var(--border-color) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--border-color) 0.5px, transparent 0.5px)",
          backgroundSize: "28px 28px, 14px 14px, 14px 14px",
        }}
      />

      {/* Main Radar Screen (Center Absolute) */}
      <div className="relative w-full h-[165px] sm:h-[185px] flex items-center justify-center">
        {/* SVG Tactical Radar Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Luminous filter for laser beams */}
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="radar-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Radial Atmosphere */}
          <circle cx="50" cy="50" r="48" fill="url(#radar-core-glow)" />

          {/* Range Rings: R1 (19%), R2 (31%), R3 (43%) */}
          <circle
            cx="50"
            cy="50"
            r="19"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.4"
            strokeDasharray="1.5 2"
            opacity="0.45"
          />
          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.4"
          />
          <circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.6"
            opacity="0.55"
          />

          {/* Tactical Crosshair Axes */}
          <line
            x1="50"
            y1="7"
            x2="50"
            y2="93"
            stroke="var(--border-color)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
          <line
            x1="7"
            y1="50"
            x2="93"
            y2="50"
            stroke="var(--border-color)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />

          {/* 45-degree corner ticks */}
          <line x1="22" y1="22" x2="26" y2="26" stroke="var(--accent)" strokeWidth="0.6" opacity="0.4" />
          <line x1="78" y1="22" x2="74" y2="26" stroke="var(--accent)" strokeWidth="0.6" opacity="0.4" />
          <line x1="22" y1="78" x2="26" y2="74" stroke="var(--accent)" strokeWidth="0.6" opacity="0.4" />
          <line x1="78" y1="78" x2="74" y2="74" stroke="var(--accent)" strokeWidth="0.6" opacity="0.4" />

          {/* Curved Data Conduits & Electron Streams to Central SDET Core */}
          {RADAR_NODES.map((node) => {
            const isHovered = activeNodeId === node.id;
            const isBlip = blipNodeId === node.id;
            return (
              <g key={`conduit-${node.id}`}>
                {/* Static structural line */}
                <line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke="var(--accent)"
                  strokeWidth={isHovered ? "1.2" : "0.4"}
                  strokeDasharray="1.5 3"
                  opacity={isHovered ? 0.9 : isBlip ? 0.6 : 0.22}
                  className="transition-all duration-300"
                />

                {/* Animated traveling electron packet */}
                <motion.line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke="var(--accent)"
                  strokeWidth={isHovered ? "1.6" : "0.9"}
                  strokeDasharray="3 9"
                  animate={{ strokeDashoffset: [0, -24] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  opacity={isHovered ? 1 : isBlip ? 0.8 : 0.45}
                  filter="url(#radar-glow)"
                />

                {/* Target detection node dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 2.5 : isBlip ? 2.0 : 1.2}
                  fill={isHovered || isBlip ? "var(--accent)" : "var(--text-secondary)"}
                  opacity={isHovered || isBlip ? 1 : 0.6}
                  filter={isHovered || isBlip ? "url(#radar-glow)" : undefined}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Sweeping Radar Scanner Line */}
          <line
            x1="50"
            y1="50"
            x2={50 + 44 * Math.cos((activeSweepAngle * Math.PI) / 180)}
            y2={50 + 44 * Math.sin((activeSweepAngle * Math.PI) / 180)}
            stroke="var(--accent)"
            strokeWidth="1.2"
            opacity="0.9"
            filter="url(#radar-glow)"
          />
        </svg>

        {/* Dynamic Conic Radar Beam Sweep Trail */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[88%] h-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none origin-center"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(230,88,0,0.03) 290deg, rgba(230,88,0,0.14) 345deg, rgba(230,88,0,0.45) 360deg)",
          }}
        />

        {/* Central SDET Core Reactor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto">
          <div className="relative flex items-center justify-center">
            {/* Concentric sonar pulses expanding outward */}
            <motion.div
              animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-[var(--accent)] pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
              className="absolute inset-0 rounded-full border border-[var(--accent)] pointer-events-none"
            />

            {/* Rotating Cybernetic Outer Tachometer Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-dashed border-[var(--accent)]/40 pointer-events-none"
            />

            {/* Central SDET Core Badge */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xs border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex flex-col items-center justify-center p-0.5 relative shadow-[0_0_16px_rgba(230,88,0,0.3)] cursor-pointer group"
              onClick={() => onSelectNode(null)}
            >
              <span className="absolute -top-1 -left-1 text-[var(--accent)] font-mono text-[7px] leading-none">+</span>
              <span className="absolute -bottom-1 -right-1 text-[var(--accent)] font-mono text-[7px] leading-none">+</span>
              <Cpu size={13} className="text-[var(--accent)] animate-pulse" />
              <span className="font-mono text-[6px] sm:text-[7px] font-bold text-[var(--accent)] tracking-tighter uppercase leading-none mt-0.5">
                SDET
              </span>
            </motion.div>
          </div>
        </div>

        {/* Interactive Tactical Node Badges Positioned by Coordinates */}
        {RADAR_NODES.map((node) => {
          const isHovered = activeNodeId === node.id;
          const isBlip = blipNodeId === node.id;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => onSelectNode(node)}
              onMouseLeave={() => onSelectNode(null)}
              className="absolute z-20 cursor-pointer pointer-events-auto"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-xs flex items-center gap-1 transition-all duration-200 border ${
                  isHovered || isBlip
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_14px_var(--accent)] scale-110 z-30 font-extrabold"
                    : "bg-[var(--bg-primary)]/90 text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent)] hover:text-white"
                }`}
              >
                {/* Blip sonar ping pulse when radar sweeps across node */}
                {(isHovered || isBlip) && (
                  <span className="animate-ping absolute inset-0 rounded-xs bg-[var(--accent)] opacity-60 pointer-events-none" />
                )}

                {/* Status Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHovered || isBlip ? "bg-white animate-ping" : "bg-[var(--accent)]"
                  }`}
                />

                {/* Node Label */}
                <span
                  className={`font-mono text-[8px] sm:text-[8.5px] tracking-tight whitespace-nowrap transition-colors ${
                    isHovered || isBlip ? "text-white font-extrabold" : "text-[var(--text-primary)]"
                  }`}
                >
                  {node.shortName || node.name}
                </span>

                {/* Corner reticle on hover */}
                {isHovered && (
                  <span className="absolute -top-1 -right-1 text-white font-mono text-[6px] leading-none">
                    ┐
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Cybernetic Live Telemetry Status Stream Ticker (Base of Radar) */}
      <div className="relative z-20 border-t border-[var(--border-color)]/70 pt-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-mono">
        <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold truncate flex-1">
          <Terminal size={10} className="shrink-0 animate-pulse text-[var(--accent)]" />
          <span className="text-[var(--text-secondary)] uppercase shrink-0 font-bold">TELEMETRY:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={telemetryIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.25 }}
              className="text-[var(--text-primary)] font-medium truncate"
            >
              {TELEMETRY_FEED[telemetryIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[var(--text-secondary)] shrink-0 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 font-bold text-[8px]">99.98% PASS</span>
        </div>
      </div>
    </div>
  );
}
