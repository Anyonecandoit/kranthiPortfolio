'use client';

import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Header() {
  return (
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-500/20">
              KK
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-100 tracking-tight">Kranthi Kumar Katta</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin size={11} className="text-blue-400" /> Bangalore, India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <a
                href="mailto:kranthikumarkatta2006@gmail.com"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <Mail size={13} className="text-blue-400" /> Email
            </a>
            <a
                href="https://linkedin.com/in/kranthi-kumar-katta-a40093318"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-sm transition-all"
            >
              LinkedIn <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>
  );
}