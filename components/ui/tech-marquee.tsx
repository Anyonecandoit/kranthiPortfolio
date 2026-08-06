"use client";

/**
 * Infinite scrolling marquee of tech names — a classic "cutting edge" hero
 * element. Pauses on hover, edge-faded via mask.
 */
export function TechMarquee({
  items,
  className,
  speed = 28,
}: {
  items: string[];
  className?: string;
  speed?: number;
}) {
  const row = [...items, ...items]; // duplicate for seamless loop

  return (
    <div
      className={`marquee-group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] ${className ?? ""}`}
    >
      <div
        className="marquee-track gap-3"
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-sm transition-colors duration-300 hover:border-violet-400/40 hover:text-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
