"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { GridBackground } from "@/components/ui/grid-background";
import { isNative } from "@/lib/platform";
import { ArrowRight, Mail, Phone, CheckCircle2, Copy, Check, MessageSquare, ExternalLink, Zap } from "lucide-react";

/**
 * Authentic Oberon '12 CONTACTS' section with elevated futuristic contact cards:
 * - Oberon two-piece badge: [12 | CONTACTS]
 * - Prominent interactive cards for WhatsApp, LinkedIn, and Direct Email
 * - Minimalist architectural inquiry form with corner HUD reticles
 */
export function Contact() {
  const { contact } = resumeData;
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const whatsappUrl = `https://wa.me/918466952706?text=${encodeURIComponent(
    "Hi Kranthi, I reviewed your SDET portfolio and would like to discuss an opportunity!"
  )}`;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setSubmitted(true);
    // Open email client with pre-filled content
    const subject = encodeURIComponent(`Inquiry from ${formData.name || "Portfolio Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message || "I would like to discuss QA / Automation engineering."}`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-20 sm:py-24 px-6 relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
      <GridBackground columns={4} showAccentGuide={true} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header & Telemetry Status Bar */}
        <div className="border-b border-[var(--border-color)] pb-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <SectionLabel number="12" title="CONTACTS" className="mb-0" />

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              {/* WhatsApp Quick Pill */}
              <a
                href={whatsappUrl}
                target={isNative() ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!isNative()) return;
                  e.preventDefault();
                  void import("@/lib/native").then(({ openExternal }) => openExternal(whatsappUrl));
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold transition-all hover:scale-105"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>WHATSAPP AVAILABLE</span>
              </a>

              {/* Direct Coordinate Links */}
              <a
                href={`mailto:${contact.email}`}
                className="text-[var(--text-primary)] hover:text-[var(--accent)] font-bold transition-colors uppercase tracking-wider hidden sm:inline"
              >
                {contact.email}
              </a>
              <span className="text-[var(--border-color)] hidden sm:inline">|</span>
              <span className="text-[var(--text-secondary)] font-semibold hidden sm:inline">
                BANGALORE, IN (UTC+5:30)
              </span>
            </div>
          </div>
        </div>

        {/* Main Display Headline and Two-Column Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          {/* Left Column: Heading, Context & Elevated Contact Channel Cards */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-[var(--text-primary)] leading-[1.04]"
            >
              Let&apos;s build
              <br />
              reliable quality
              <br />
              <span className="text-[var(--accent)]">together</span>
            </motion.h2>

            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-[var(--text-secondary)] leading-relaxed max-w-lg font-semibold">
              HAVE AN OPEN SENIOR SDET ROLE, TEST ARCHITECTURE NEED, OR WANT TO DISCUSS QUALITY ENGINEERING? LET&apos;S CONNECT DIRECTLY ACROSS ANY CHANNEL.
            </p>

            {/* Elevated Interactive Contact Channels (WhatsApp, LinkedIn, Email) */}
            <div className="w-full space-y-3 pt-2">
              {/* WhatsApp Card */}
              <a
                href={whatsappUrl}
                target={isNative() ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!isNative()) return;
                  e.preventDefault();
                  void import("@/lib/native").then(({ openExternal }) => openExternal(whatsappUrl));
                }}
                className="group relative flex items-center justify-between p-4 rounded-sm border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.15)] transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-sm bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
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
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                        WhatsApp Chat
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-xs bg-[#25D366]/15 text-[#25D366] font-bold">
                        FASTEST RESPONSE
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-secondary)]">
                      {contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#25D366] group-hover:translate-x-1 transition-transform">
                  <span>CHAT NOW</span>
                  <ArrowRight size={14} />
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={contact.linkedin}
                target={isNative() ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!isNative()) return;
                  e.preventDefault();
                  void import("@/lib/native").then(({ openExternal }) => openExternal(contact.linkedin));
                }}
                className="group relative flex items-center justify-between p-4 rounded-sm border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.15)] transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-sm bg-[#0A66C2]/15 border border-[#0A66C2]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
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
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                        LinkedIn Profile
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-xs bg-[#0A66C2]/15 text-[#0A66C2] font-bold">
                        VERIFIED SDET 2
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-secondary)]">
                      linkedin.com/in/kranthi-kumar-katta-a40093318
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#0A66C2] group-hover:translate-x-1 transition-transform">
                  <span>CONNECT</span>
                  <ExternalLink size={14} />
                </div>
              </a>

              {/* Direct Email Card */}
              <div className="group relative flex items-center justify-between p-4 rounded-sm border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:shadow-[0_0_20px_rgba(230,88,0,0.15)] transition-all duration-200">
                <a
                  href={`mailto:${contact.email}?subject=SDET%20Opportunity%20Discussion`}
                  className="flex items-center gap-3.5 flex-1"
                >
                  <div className="w-10 h-10 rounded-sm bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={20} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                        Direct Email
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-xs bg-[var(--accent)]/15 text-[var(--accent)] font-bold">
                        HIRING / RFP
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-secondary)]">
                      {contact.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1 rounded-xs border border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-primary)] font-mono text-[10px] font-bold text-[var(--text-primary)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-500">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${contact.email}?subject=SDET%20Opportunity%20Discussion`}
                    className="p-1 text-[var(--accent)] hover:scale-110 transition-transform"
                    title="Send Email"
                  >
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xs border border-[var(--border-color)] bg-[var(--bg-card)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold">
                OPEN TO FULL-TIME SDET ROLES &amp; CONSULTING
              </span>
            </div>
          </div>

          {/* Right Column: Minimalist Inquiry Form with Corner HUD Reticles */}
          <div className="lg:col-span-6 border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 md:p-10 shadow-card relative overflow-hidden">
            {/* Corner HUD markers */}
            <span className="absolute top-2.5 left-2.5 text-[var(--accent)] font-mono text-[10px] select-none">
              ┌
            </span>
            <span className="absolute top-2.5 right-2.5 text-[var(--accent)] font-mono text-[10px] select-none">
              ┐
            </span>
            <span className="absolute bottom-2.5 left-2.5 text-[var(--accent)] font-mono text-[10px] select-none">
              └
            </span>
            <span className="absolute bottom-2.5 right-2.5 text-[var(--accent)] font-mono text-[10px] select-none">
              ┘
            </span>

            <div className="flex items-center justify-between border-b border-[var(--border-color)]/70 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[var(--accent)] animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  DIRECT INQUIRY FORM
                </span>
              </div>
              <span className="font-mono text-[9px] text-[var(--text-secondary)]">
                DISPATCH TO KRANTHI
              </span>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center flex flex-col items-center"
              >
                <CheckCircle2 size={40} className="text-[var(--accent)] mb-4" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  MESSAGE COMPOSED
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-6">
                  Your email client has been opened with your inquiry pre-filled.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 border border-[var(--border-color)] text-xs font-mono uppercase text-[var(--text-primary)] hover:border-[var(--accent)]"
                >
                  SEND ANOTHER
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-2">
                    NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="YOUR NAME"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-3 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-secondary)]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="EMAIL@ADDRESS.COM"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-3 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-secondary)]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)] mb-2">
                    PROJECT BRIEF / MESSAGE
                  </label>
                  <textarea
                    rows={3}
                    placeholder="TELL ME ABOUT YOUR TESTING BOTTLENECK OR PROJECT GOALS..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-3 text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-secondary)]/50 transition-colors resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors text-xs font-mono font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  LET&apos;S TALK
                  <ArrowRight size={14} />
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
