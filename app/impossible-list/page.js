import ParticlesBackground from '@/components/ParticlesBackground';
import Link from 'next/link';

export default function ImpossibleList() {
    const sections = [
        {
            category: 'Professional Milestones',
            items: [
                { text: 'Master Distributed Event-Driven Architecture (Kafka & Temporal)', done: true },
                { text: 'Architect 100% automated CI/CD pipeline verification for high-volume fintech platforms', done: true },
                { text: 'Lead global SDET teams across multi-region banking applications', done: false },
            ]
        },
        {
            category: 'Technical Mastery',
            items: [
                { text: 'Contribute to open-source test automation frameworks', done: false },
                { text: 'Build advanced low-latency performance testing benchmarks', done: true },
                { text: 'Publish whitepapers on PCI-DSS compliance automated testing', done: false },
            ]
        }
    ];

    return (
        <main className="relative min-h-screen bg-transparent text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
            <ParticlesBackground />

            {/* Top Navigation Bar */}
            <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center text-xs tracking-widest uppercase font-medium text-neutral-400">
                <Link href="/" className="text-neutral-200 font-normal lowercase tracking-normal text-sm hover:text-white transition-colors">
                    kranthikumarkatta.dev
                </Link>
                <nav className="flex items-center gap-8">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/impossible-list" className="text-white font-bold transition-colors">Impossible List</Link>
                    <a href="/kranthi-kumar-katta-resume.pdf" download className="hover:text-white transition-colors">CV</a>
                </nav>
            </header>

            {/* Content Section */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 py-16 my-auto w-full">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3 text-center">
                    Impossible List
                </h1>
                <p className="text-neutral-400 text-center text-sm sm:text-base mb-12">
                    Inspired by Diogo Correia — a living checklist of professional goals, challenges, and milestones.
                </p>

                <div className="space-y-10">
                    {sections.map((sec, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm shadow-xl">
                            <h2 className="text-lg font-semibold text-sky-400 mb-4 tracking-tight">{sec.category}</h2>
                            <ul className="space-y-3">
                                {sec.items.map((item, iIdx) => (
                                    <li key={iIdx} className="flex items-start gap-3 text-sm text-neutral-300">
                                        <span className={`mt-1 w-3 h-3 rounded-full shrink-0 border ${item.done ? 'bg-sky-500 border-sky-400' : 'border-neutral-600 bg-neutral-800'}`} />
                                        <span className={item.done ? 'line-through text-neutral-500' : ''}>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 text-center text-xs text-neutral-600">
                Bangalore, India • Built with Next.js & Tailwind
            </footer>
        </main>
    );
}