import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-7xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
          Page not found
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-accent/40 text-sm font-medium transition-colors"
          >
            Chat with my AI assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
