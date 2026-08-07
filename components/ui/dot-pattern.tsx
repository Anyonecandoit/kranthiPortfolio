"use client";

interface DotPatternProps {
  className?: string;
  dotSize?: number;
  spacing?: number;
  opacity?: number;
}

export function DotPattern({
  className = "",
  dotSize = 1.5,
  spacing = 24,
  opacity = 0.3,
}: DotPatternProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize}
              fill="currentColor"
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
    </div>
  );
}

export function DotMatrixBottom({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 h-48 pointer-events-none ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient id="dot-fade" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <pattern id="matrix-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#matrix-dots)" />
        <rect width="100%" height="100%" fill="url(#dot-fade)" />
      </svg>
    </div>
  );
}
