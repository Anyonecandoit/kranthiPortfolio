export default function Footer() {
  return (
    <footer className="py-8 bg-slate-950 text-center text-sm text-slate-500">
      <div className="max-w-6xl mx-auto px-6">
        <p>© {new Date().getFullYear()} Kranthi Kumar Katta. Built with Next.js & Tailwind CSS.</p>
        <p className="mt-1 text-xs text-slate-600">Education: Master's in Mechanical Engineering (Halmstad University, Sweden)</p>
      </div>
    </footer>
  );
}
