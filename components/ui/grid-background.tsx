"use client";

interface GridBackgroundProps {
  className?: string;
  columns?: number;
  light?: boolean;
}

export function GridBackground({
  className = "",
  columns = 4,
  light = true,
}: GridBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        className={`h-full mx-auto max-w-7xl grid ${light ? "text-[var(--border-subtle)]" : "text-[var(--border-dark)]"}`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-full ${i > 0 ? "border-l" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
