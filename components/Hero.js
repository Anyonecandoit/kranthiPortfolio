'use client';

import { Terminal, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 shadow-inner">
                <Sparkles size={13} /> SDET 2 & QA Automation Expert
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-slate-100 tracking-tight leading-[1.15] max-w-3xl mb-6">
                Architecting robust testing pipelines for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-300">High-Volume Fintech Systems</span>.
            </h2>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-3xl font-normal">
                Results-driven SDET with 5+ years of experience specializing in Automation Testing, API Validation, and Distributed Microservices. Expert in Selenium, Rest Assured, Kafka event verification, and CI/CD infrastructure.
            </p>
        </section>
    );
}