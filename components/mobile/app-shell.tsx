"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Home as HomeIcon,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  Share2,
  Sun,
  User,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { isNative } from "@/lib/platform";
import { resumeData } from "@/data/resume";
import { useTheme } from "@/components/theme-provider";
import { ChatInterface } from "@/components/chat/chat-interface";
import { copyText, getDeviceInfo, openExternal, shareContent } from "@/lib/native";

type TabId = "home" | "chat" | "projects" | "more";

interface TabDef {
  id: TabId;
  label: string;
  icon: typeof HomeIcon;
}

const TABS: TabDef[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "more", label: "More", icon: User },
];

/** Map a deep-link / web path to the closest tab for the initial view. */
function tabFromPath(path: string): TabId {
  if (path.startsWith("/chat") || path.startsWith("/tools")) return "chat";
  if (path.startsWith("/projects")) return "projects";
  return "home";
}

const MONOGRAM = resumeData.name
  .split(" ")
  .map((p) => p[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

/**
 * The native app experience — a Material-style shell (app bar + bottom tab
 * navigation) that ONLY renders inside the Capacitor app. The web version
 * keeps its original site UI untouched; inside the app this shell covers it
 * with a distinct, app-native look.
 */
export function MobileAppShell() {
  const [mounted, setMounted] = useState(false);
  const [isApp, setIsApp] = useState(false);
  const [tab, setTab] = useState<TabId>("home");
  const { theme, toggleTheme } = useTheme();

  // Determine platform + initial tab only on the client (no SSR mismatch).
  // Dev-only: `?app=1` previews the native shell in a browser (never in a
  // production web build) so the app UI can be tested without a device.
  useEffect(() => {
    const previewOverride =
      process.env.NODE_ENV !== "production" &&
      new URLSearchParams(window.location.search).has("app");
    setIsApp(isNative() || previewOverride);
    setTab(tabFromPath(window.location.pathname));
    setMounted(true);
  }, []);

  // Flag for NativeShell + global CSS: this app is running in "app mode".
  useEffect(() => {
    if (!isApp) return;
    document.body.dataset.nativeApp = "true";
    document.body.style.overflow = "hidden";
    (window as unknown as { __mobileShellActive?: boolean }).__mobileShellActive =
      true;
    return () => {
      delete document.body.dataset.nativeApp;
      document.body.style.overflow = "";
      (window as unknown as { __mobileShellActive?: boolean }).__mobileShellActive =
        false;
    };
  }, [isApp]);

  // Android hardware back: from a sub-tab return home; on home let the shell
  // handle exit (NativeShell defers to us via the module flag below).
  useEffect(() => {
    if (!isApp) return;
    let handle: { remove: () => Promise<void> } | null = null;
    let exit: (() => Promise<void>) | null = null;
    void import("@capacitor/app").then(async ({ App }) => {
      exit = () => App.exitApp();
      handle = await App.addListener("backButton", ({ canGoBack }) => {
        if (tab !== "home") {
          setTab("home");
        } else if (!canGoBack) {
          void exit?.();
        } else {
          window.history.back();
        }
      });
    });
    return () => {
      void handle?.remove();
    };
  }, [isApp, tab]);

  const goChat = useCallback(() => setTab("chat"), []);

  if (!mounted || !isApp) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
        paddingTop: "var(--sat)",
      }}
    >
      {/* App bar */}
      <header
        className="shrink-0 flex items-center justify-between px-4"
        style={{ height: 56, background: "var(--bg-primary)", borderBottom: "1px solid var(--bg-secondary)" }}
      >
        {tab === "chat" ? (
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setTab("home")}
              aria-label="Back to home"
              className="p-2 -ml-2 rounded-full hover:bg-[var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="min-w-0">
              <p className="font-semibold leading-tight truncate" style={{ fontSize: 17 }}>
                AI Assistant
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Ask me anything
              </p>
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="font-semibold leading-tight truncate" style={{ fontSize: 17 }}>
              {resumeData.name}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
              {resumeData.title}
            </p>
          </div>
        )}
        <span
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--success)", boxShadow: "0 0 6px var(--success)" }}
          />
          Online
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {tab === "home" && <HomeTab onChat={goChat} onProjects={() => setTab("projects")} />}
        {tab === "chat" && (
          <div className="absolute inset-0" style={{ top: 56 }}>
            <ChatInterface />
          </div>
        )}
        {tab === "projects" && <ProjectsTab />}
        {tab === "more" && <MoreTab />}
      </div>

      {/* Bottom tab bar (hidden while chatting so the chat input is usable).
          A <div role="navigation"> on purpose — the global app-mode CSS hides
          <nav> elements (the website navbar), which would hide this too. */}
      {tab !== "chat" && (
        <div
          role="navigation"
          className="shrink-0 flex items-stretch"
          aria-label="App navigation"
          style={{
            background: "var(--bg-card)",
            borderTop: "1px solid var(--bg-secondary)",
            paddingBottom: "var(--sab)",
            minHeight: 60,
          }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={active ? "page" : undefined}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
                style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: active ? "var(--accent)" : "transparent" }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home tab                                                            */
/* ------------------------------------------------------------------ */
function HomeTab({ onChat, onProjects }: { onChat: () => void; onProjects: () => void }) {
  const stats = useMemo(
    () => [
      { value: "5+", label: "Years" },
      { value: String(resumeData.projects.length), label: "Projects" },
      { value: String(resumeData.skills.length), label: "Skills" },
      { value: String(resumeData.experience.length), label: "Roles" },
    ],
    []
  );
  const currentRole = resumeData.experience[0];
  const topSkills = resumeData.skills.slice(0, 6);

  return (
    <div className="h-full overflow-y-auto" style={{ paddingBottom: 24 }}>
      <div className="px-4 pt-4 space-y-4">
        {/* Profile card */}
        <section
          className="rounded-3xl p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
              aria-hidden
            >
              {MONOGRAM}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight truncate">{resumeData.name}</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {resumeData.title}
              </p>
              <p className="flex items-center gap-1 text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                <MapPin size={12} />
                {resumeData.location}
              </p>
            </div>
          </div>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {resumeData.summary.length > 200
              ? `${resumeData.summary.slice(0, 200).trimEnd()}…`
              : resumeData.summary}
          </p>
          <div className="flex gap-2.5 mt-4">
            <button
              onClick={onChat}
              className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ background: "var(--accent)" }}
            >
              <span className="flex items-center justify-center gap-2">
                <MessageCircle size={16} /> Chat with AI
              </span>
            </button>
            <button
              onClick={onProjects}
              className="flex-1 py-3 rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              My Work
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl py-3 text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
            >
              <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                {s.value}
              </p>
              <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Current role */}
        {currentRole && (
          <section
            className="rounded-3xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
          >
            <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--accent)" }}>
              Currently
            </p>
            <h2 className="font-semibold mt-1.5 leading-snug">{currentRole.role}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {currentRole.company} · {currentRole.period}
            </p>
          </section>
        )}

        {/* Top skills */}
        <section>
          <h3 className="text-xs uppercase tracking-wider font-semibold px-1" style={{ color: "var(--text-secondary)" }}>
            Core skills
          </h3>
          <div className="flex flex-wrap gap-2 mt-2.5">
            {topSkills.map((s) => (
              <span
                key={s.name}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Projects tab                                                        */
/* ------------------------------------------------------------------ */
function ProjectsTab() {
  return (
    <div className="h-full overflow-y-auto" style={{ paddingBottom: 24 }}>
      <div className="px-4 pt-4 space-y-3">
        {resumeData.projects.map((p, i) => (
          <article
            key={p.title}
            className="rounded-3xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
          >
            <p className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
              {String(i + 1).padStart(2, "0")} · {p.period ?? ""}
            </p>
            <h2 className="font-semibold text-lg leading-snug mt-1">{p.title}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {p.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(p.technologies ?? []).slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ background: "var(--bg-secondary)", color: "var(--accent)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* More tab                                                            */
/* ------------------------------------------------------------------ */
function MoreTab() {
  const { theme, toggleTheme } = useTheme();
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    void getDeviceInfo().then((d) => {
      if (d.appVersion) setVersion(`v${d.appVersion}`);
    });
  }, []);

  const contact = resumeData.contact ?? {
    email: resumeData.email,
    phone: resumeData.phone,
    linkedin: resumeData.linkedin,
  };

  const actions = [
    {
      label: "Call me",
      icon: Phone,
      run: () => openExternal(`tel:${contact.phone.replace(/\s+/g, "")}`),
    },
    {
      label: "Email me",
      icon: Mail,
      run: () => openExternal(`mailto:${contact.email}`),
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      run: () => openExternal(contact.linkedin),
    },
    {
      label: "Share profile",
      icon: Share2,
      run: () =>
        shareContent({
          title: resumeData.name,
          text: `${resumeData.name} — ${resumeData.title}. Check out my portfolio!`,
          url: "https://www.kranthikumarkatta.in",
        }),
    },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ paddingBottom: 24 }}>
      <div className="px-4 pt-4 space-y-4">
        <section
          className="rounded-3xl p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
        >
          <h2 className="font-semibold text-base">About</h2>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {resumeData.summary}
          </p>
        </section>

        <section
          className="rounded-3xl p-2"
          style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
        >
          <p className="px-3 pt-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
            Connect
          </p>
          {actions.map(({ label, icon: Icon, run }) => (
            <button
              key={label}
              onClick={() => void run()}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium hover:bg-[var(--bg-secondary)] active:scale-[0.99] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--bg-secondary)", color: "var(--accent)" }}
              >
                <Icon size={18} />
              </span>
              {label}
              <ChevronRight size={16} className="ml-auto" style={{ color: "var(--text-secondary)" }} />
            </button>
          ))}
        </section>

        <section
          className="rounded-3xl p-2"
          style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
        >
          <p className="px-3 pt-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
            Preferences
          </p>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium hover:bg-[var(--bg-secondary)] active:scale-[0.99] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-secondary)", color: "var(--accent)" }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={() => void openExternal("https://www.kranthikumarkatta.in")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium hover:bg-[var(--bg-secondary)] active:scale-[0.99] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--bg-secondary)", color: "var(--accent)" }}
            >
              <ExternalLink size={18} />
            </span>
            Open full website
            <ChevronRight size={16} className="ml-auto" style={{ color: "var(--text-secondary)" }} />
          </button>
        </section>

        <section
          className="rounded-3xl p-4 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--bg-secondary)" }}
        >
          <p className="text-sm font-medium">{resumeData.name}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {resumeData.title}
          </p>
          <p className="text-[11px] mt-2" style={{ color: "var(--text-secondary)" }}>
            {version ? `${version} · ` : ""}
            {new Date().getFullYear()} · Made with ♥
          </p>
        </section>
      </div>
    </div>
  );
}

/* Re-exported for potential reuse elsewhere. */
export function copyEmail(email: string) {
  void copyText(email);
}
