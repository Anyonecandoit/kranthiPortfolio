"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ExternalLink, Check, MessageSquare } from "lucide-react";
import { resumeData } from "@/data/resume";
import { isNative } from "@/lib/platform";

/**
 * StickyContactDock
 * Futuristic right-side persistent contact dock:
 * - Glides along the right edge of the screen (always accessible across any section)
 * - Quick-actions for:
 *   1. WhatsApp (+91 8466952706 with instant chat link)
 *   2. LinkedIn (official verified profile)
 *   3. Email (direct mailto + copy feature)
 *   4. Phone (direct tap-to-call)
 * - Expandable cybernetic HUD tooltips on hover
 */
export function StickyContactDock() {
  const { contact } = resumeData;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const whatsappUrl = `https://wa.me/918466952706?text=${encodeURIComponent(
    "Hi Kranthi, I reviewed your SDET portfolio and would like to discuss an opportunity!"
  )}`;

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const contactItems = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      subtitle: "+91 8466952706",
      status: "INSTANT CHAT",
      href: whatsappUrl,
      isExternal: true,
      color: "#25D366",
      bgColor: "hover:bg-[#25D366]/15 hover:border-[#25D366]/50",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#25D366]"
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      subtitle: "kranthi-kumar-katta",
      status: "CONNECT ↗",
      href: contact.linkedin,
      isExternal: true,
      color: "#0A66C2",
      bgColor: "hover:bg-[#0A66C2]/15 hover:border-[#0A66C2]/50",
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#0A66C2]"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      id: "email",
      name: "Email",
      subtitle: contact.email,
      status: copiedEmail ? "COPIED TO CLIPBOARD!" : "SEND MAIL",
      href: `mailto:${contact.email}?subject=SDET%20Opportunity%20Discussion`,
      isExternal: false,
      color: "var(--accent)",
      bgColor: "hover:bg-[var(--accent)]/15 hover:border-[var(--accent)]/50",
      icon: <Mail size={18} className="text-[var(--accent)]" />,
    },
    {
      id: "phone",
      name: "Phone / Call",
      subtitle: contact.phone,
      status: "DIRECT CALL",
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
      isExternal: false,
      color: "var(--text-primary)",
      bgColor: "hover:bg-[var(--border-subtle)] hover:border-[var(--accent)]/40",
      icon: <Phone size={17} className="text-[var(--text-primary)]" />,
    },
  ];

  return (
    <aside
      aria-label="Quick Contact Dock"
      className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative flex flex-col items-center gap-2 p-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur-xl shadow-2xl group"
      >
        {/* Subtle glowing ambient pulse */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[var(--accent)]/10 via-transparent to-[var(--accent)]/5 pointer-events-none" />

        {/* Top HUD mini tag */}
        <span className="font-mono text-[7px] font-extrabold uppercase tracking-widest text-[var(--text-secondary)] writing-mode-vertical rotate-180 py-1.5 select-none opacity-60">
          CONTACT
        </span>

        {contactItems.map((item) => (
          <div
            key={item.id}
            className="relative flex items-center"
            onMouseEnter={() => setActiveTooltip(item.id)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <a
              href={item.href}
              target={item.isExternal && !isNative() ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (item.id === "email" && e.altKey) {
                  copyEmail(e);
                } else if (item.isExternal && isNative()) {
                  e.preventDefault();
                  void import("@/lib/native").then(({ openExternal }) => openExternal(item.href));
                }
              }}
              className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)]/80 transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 ${item.bgColor}`}
              aria-label={item.name}
            >
              {item.icon}

              {/* Status Indicator Dot */}
              {item.id === "whatsapp" && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </a>

            {/* Expandable Left HUD Tooltip */}
            <AnimatePresence>
              {activeTooltip === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-full mr-3 pointer-events-none select-none z-50 whitespace-nowrap"
                >
                  <div className="relative px-3 py-2 rounded-sm border border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur-md shadow-xl flex items-center gap-3">
                    {/* Reticle arrow */}
                    <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rotate-45 border-t border-r border-[var(--border-color)] bg-[var(--bg-card)]" />

                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[var(--text-primary)]">
                          {item.name}
                        </span>
                        <span
                          className="font-mono text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase"
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}15`,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[var(--text-secondary)]">
                        {item.subtitle}
                      </span>
                    </div>

                    {item.id === "email" && (
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="pointer-events-auto px-1.5 py-0.5 rounded-xs border border-[var(--border-color)] hover:border-[var(--accent)] font-mono text-[8px] text-[var(--accent)] font-bold transition-colors"
                        title="Click to copy email address"
                      >
                        {copiedEmail ? <Check size={10} /> : "COPY"}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </aside>
  );
}
