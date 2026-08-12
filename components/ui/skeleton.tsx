import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Card skeleton — placeholder for loading project/skill cards.
 */
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4", className)}>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
