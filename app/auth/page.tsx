"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth, type OAuthProvider } from "@/lib/auth-context";
import { LogIn, UserPlus, Mail, Lock, Fingerprint, Chrome, Github } from "lucide-react";
import { isNative } from "@/lib/platform";

export default function AuthPage() {
  const { signInWithEmail, signUp, signInWithOAuth, user, loading, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<OAuthProvider | null>(null);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricUnlock, setBiometricUnlock] = useState(false);

  // Native only: expose the biometric-lock toggle when Face ID / fingerprint
  // is available and the user has an active session.
  useEffect(() => {
    if (!isNative() || !user) return;
    let mounted = true;
    void import("@/lib/security").then(async ({ isBiometricsAvailable, secureGet }) => {
      const [available, enabled] = await Promise.all([
        isBiometricsAvailable(),
        secureGet("kranthi-biometric-unlock"),
      ]);
      if (!mounted) return;
      setBiometricsAvailable(available);
      setBiometricUnlock(enabled === "1");
    });
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto text-xl font-bold text-white">
            {(user.email ?? "U")[0]?.toUpperCase()}
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            Signed in as <span className="text-[var(--text-primary)] font-medium">{user.email}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <button onClick={signOut} className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent/40 text-sm transition-colors">
              Sign Out
            </button>
          </div>

          {/* Biometric unlock (native only) */}
          {isNative() && biometricsAvailable && (
            <button
              onClick={async () => {
                const { secureSet, secureRemove } = await import("@/lib/security");
                if (biometricUnlock) {
                  await secureRemove("kranthi-biometric-unlock");
                  setBiometricUnlock(false);
                } else {
                  // Verify the biometric once before enabling.
                  const ok = await import("@/lib/security").then(({ authenticateWithBiometrics }) =>
                    authenticateWithBiometrics("Enable biometric unlock")
                  );
                  if (ok) {
                    await secureSet("kranthi-biometric-unlock", "1");
                    setBiometricUnlock(true);
                  }
                }
              }}
              className={`mx-auto mt-5 flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
                biometricUnlock
                  ? "border-violet-500/50 bg-violet-600/15 text-violet-300"
                  : "border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-accent/40"
              }`}
            >
              <Fingerprint size={14} />
              {biometricUnlock ? "Biometric unlock on" : "Unlock with Face ID / fingerprint"}
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = mode === "signin"
      ? await signInWithEmail(email, password)
      : await signUp(email, password, name);
    if (result.error) setError(result.error);
    setBusy(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-2">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {mode === "signin"
              ? "Sign in to save conversations and track activity."
              : "Join to get started with the AI-powered portfolio."}
          </p>
        </div>

        {/* Social login — web only (OAuth needs the server callback route,
            which is not shipped in the native static build) */}
        {!isNative() && (
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--border-color)]" />
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">or continue with</span>
              <div className="flex-1 h-px bg-[var(--border-color)]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  setError("");
                  setOauthBusy("google");
                  const { error: oErr } = await signInWithOAuth("google");
                  if (oErr) {
                    setError(oErr);
                    setOauthBusy(null);
                  }
                }}
                disabled={oauthBusy !== null}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] hover:border-accent/40 transition-colors disabled:opacity-50"
              >
                {oauthBusy === "google" ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Chrome size={16} />
                )}
                Google
              </button>
              <button
                type="button"
                onClick={async () => {
                  setError("");
                  setOauthBusy("github");
                  const { error: oErr } = await signInWithOAuth("github");
                  if (oErr) {
                    setError(oErr);
                    setOauthBusy(null);
                  }
                }}
                disabled={oauthBusy !== null}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] hover:border-accent/40 transition-colors disabled:opacity-50"
              >
                {oauthBusy === "github" ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Github size={16} />
                )}
                GitHub
              </button>
            </div>
          </div>
        )}

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-violet-500/40 transition-colors"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-violet-500/40 transition-colors"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-violet-500/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy || !email || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-sm font-medium text-white transition-colors"
          >
            {busy ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === "signin" ? (
              <><LogIn size={16} /> Sign In</>
            ) : (
              <><UserPlus size={16} /> Sign Up</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-5">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
