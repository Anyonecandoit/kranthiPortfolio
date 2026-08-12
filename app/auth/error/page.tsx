import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-medium text-[var(--text-primary)] mb-3">Authentication failed</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          Something went wrong during sign-in. This can happen if the
          authorization was cancelled, expired, or the provider is not configured
          correctly in Supabase.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent/40 text-sm font-medium transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
