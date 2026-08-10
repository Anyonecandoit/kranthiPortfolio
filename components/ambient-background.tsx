/**
 * Ambient animated background — Oberon-style floating gradient blobs
 * + subtle grid lines, rendered once behind every page.
 *
 * Sits at z-0 under <main> (z-10), so sections with transparent
 * backgrounds let the glow show through while opaque sections
 * (projects, skills) cover it — creating alternating depth.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* Floating gradient blobs */}
      <div className="bg-blob blob-float-1 absolute -top-32 -left-24 h-[36rem] w-[36rem]" />
      <div className="bg-blob blob-float-2 absolute top-1/3 -right-40 h-[32rem] w-[32rem]" />
      <div className="bg-blob blob-float-3 absolute -bottom-40 left-1/4 h-[40rem] w-[40rem]" />

      {/* Subtle grid lines */}
      <div className="grid-lines absolute inset-0 opacity-30" />
    </div>
  );
}
