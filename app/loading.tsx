import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton shown while the page compiles.
 * Matches the section layout: hero, about, skills, projects, experience, contact.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero skeleton */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4">
        <Skeleton className="w-24 h-24 rounded-full mb-6" />
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-8 w-72 mb-6" />
        <Skeleton className="h-5 w-[500px] max-w-full mb-8" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </section>

      {/* About skeleton */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-3/4" />
      </section>

      {/* Skills skeleton */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 mx-auto mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Projects skeleton */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Experience skeleton */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-40 mx-auto mb-12" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-4 mb-8">
            <Skeleton className="w-3 h-3 rounded-full mt-1.5 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-64 mb-2" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </section>

      {/* Contact skeleton */}
      <section className="py-16 px-4 max-w-xl mx-auto text-center">
        <Skeleton className="h-8 w-28 mx-auto mb-8" />
        <Skeleton className="h-4 w-48 mx-auto mb-3" />
        <Skeleton className="h-4 w-40 mx-auto mb-3" />
        <Skeleton className="h-4 w-44 mx-auto" />
      </section>
    </div>
  );
}
