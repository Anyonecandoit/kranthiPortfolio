"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";

/** Default idle timeout in minutes before an authenticated session ends. */
const DEFAULT_IDLE_TIMEOUT_MIN = 60;
const TIMEOUT_KEY = "kranthi-session-timeout-min";

/** Read the configured idle timeout (minutes) from storage. */
export function getSessionTimeoutMinutes(): number {
  if (typeof window === "undefined") return DEFAULT_IDLE_TIMEOUT_MIN;
  try {
    const raw = window.localStorage.getItem(TIMEOUT_KEY);
    const n = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_IDLE_TIMEOUT_MIN;
  } catch {
    return DEFAULT_IDLE_TIMEOUT_MIN;
  }
}

/** Configure the idle timeout (minutes) — persisted on the device. */
export function setSessionTimeoutMinutes(minutes: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TIMEOUT_KEY, String(Math.max(1, Math.round(minutes))));
  } catch {
    /* ignore */
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ------------------------------------------------------------
   * Idle session timeout — signs the user out after a configurable
   * period of inactivity (default 60 min). Activity is tracked from
   * pointer/keyboard/touch events; the timer also runs while the app
   * is backgrounded (checked again on foreground).
   * ------------------------------------------------------------ */
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!user) return;
    lastActivityRef.current = Date.now();

    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    const activityEvents = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    activityEvents.forEach((e) =>
      window.addEventListener(e, bump, { passive: true })
    );

    const check = () => {
      const idleMin = (Date.now() - lastActivityRef.current) / 60_000;
      if (idleMin >= getSessionTimeoutMinutes()) {
        window.dispatchEvent(new CustomEvent("auth:timeout"));
        void supabase.auth.signOut();
      }
    };

    const timer = window.setInterval(check, 30_000);

    const onAppState = (e: Event) => {
      const active = (e as CustomEvent<{ isActive: boolean }>).detail?.isActive;
      if (!active) return;
      // While backgrounded the interval pauses; re-check immediately.
      check();
    };
    window.addEventListener("app:state", onAppState);

    return () => {
      activityEvents.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(timer);
      window.removeEventListener("app:state", onAppState);
    };
  }, [user]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
