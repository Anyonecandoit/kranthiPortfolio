import ParticlesBackground from '@/components/ParticlesBackground';
import FlashingName from '@/components/FlashingName';
import TypewriterTitle from '@/components/TypewriterTitle';
import { portfolioData } from '@/data/projects';
import { FileText } from 'lucide-react';

export default function Home() {
    return (
        <main className="relative min-h-screen bg-transparent text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
            <ParticlesBackground />

            {/* Top Navigation Bar */}
            <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center text-xs tracking-widest uppercase font-medium text-neutral-400">
                <span className="text-neutral-200 font-normal lowercase tracking-normal text-sm">kranthikumarkatta.dev</span>
                <nav className="flex items-center gap-8">
                    <a href="/" className="hover:text-white transition-colors">Home</a>
                    <a href="/impossible-list" className="hover:text-white transition-colors">Impossible List</a>
                    <a href="/Kranthi_Kumar_Katta_Resume.pdf" download className="hover:text-white transition-colors">CV</a>
                </nav>
            </header>

            {/* Splash / Hero Section */}
            <div className="splash">
                <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-2xl font-bold text-white shadow-2xl shrink-0 overflow-hidden">
                    KK
                </div>

                <FlashingName />
                <TypewriterTitle />

                {/* Social Icons Bar */}
                <div className="socials flex items-center justify-center gap-4 mt-6 z-10 relative">
                    <a href="https://linkedin.com/in/kranthi-kumar-katta-a40093318" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-white hover:text-sky-400 transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>

                    <a href="mailto:kranthikumarkatta2006@gmail.com" className="w-8 h-8 flex items-center justify-center text-white hover:text-sky-400 transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.421l4.911 3.252zm.983.655l4.394 2.916 4.394-2.916 5.23 6.07-19.248-.002 5.23-6.068zm9.771-1.584l4.623-3.25v9.422l-4.623-6.172z"/>
                        </svg>
                    </a>
                </div>
            </div>

            {/* About Me Section */}
            <div className="section" id="about-me">
                <div className="container">
                    <p><strong>Hey!</strong></p>
                    <p>I’m Kranthi Kumar Katta from India, an SDET 2 specializing in test automation, API validation, fintech payment systems, and distributed microservices architecture.</p>
                </div>
            </div>

            {/* Portfolio / Projects Title */}
            <div className="section-title" id="portfolio">
                <h2>Portfolio</h2>
            </div>

            {/* Main Projects & Timeline Section */}
            <div className="section">
                <div className="container">
                    <h3>My top projects</h3>
                    <div className="top-projects">
                        {portfolioData.topProjects.map((project, idx) => (
                            <div key={idx} className="card flex flex-col justify-between" style={{ backgroundColor: project.background, color: project.color }}>
                                <div className="card-content">
                                    <span className="text-xs uppercase tracking-wider font-semibold opacity-80 block mb-1">
                                        {project.company}
                                    </span>
                                    <h4 className="text-lg font-bold mb-2">{project.name}</h4>
                                    <div><p className="text-sm opacity-90">{project.description}</p></div>
                                </div>
                                <div className="card-actions mt-4">
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-black/10 hover:bg-black/20 text-current text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded transition-colors">
                                        {project.calltoaction}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3>Timeline</h3>
                    <div className="timeline">
                        {portfolioData.timeline.map((entry, idx) => {
                            // Rich, immersive flag-themed multi-stop gradients and borders
                            let cardStyle = {};
                            if (entry.flag === "🇸🇦") {
                                cardStyle = {
                                    background: "linear-gradient(135deg, rgba(0, 108, 53, 0.22) 0%, rgba(255, 255, 255, 0.95) 60%)",
                                    borderColor: "rgba(0, 108, 53, 0.3)"
                                };
                            } else if (entry.flag === "🇺🇸") {
                                cardStyle = {
                                    background: "linear-gradient(135deg, rgba(60, 59, 110, 0.22) 0%, rgba(178, 34, 52, 0.12) 50%, rgba(255, 255, 255, 0.95) 80%)",
                                    borderColor: "rgba(60, 59, 110, 0.3)"
                                };
                            } else if (entry.flag === "🇮🇳") {
                                cardStyle = {
                                    background: "linear-gradient(135deg, rgba(255, 153, 51, 0.22) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(19, 136, 8, 0.2) 100%)",
                                    borderColor: "rgba(255, 153, 51, 0.4)"
                                };
                            }

                            return (
                                <div key={idx} className="timeline-element">
                                    <span className="timeline-element-icon" style={{ backgroundColor: entry.background, color: entry.foreground }}>
                                        <FileText size={18} />
                                    </span>
                                    <div
                                        className="timeline-element-content relative overflow-hidden shadow-xl rounded-2xl p-6 text-neutral-900 border transition-all hover:shadow-2xl hover:scale-[1.01]"
                                        style={cardStyle}
                                    >
                                        {/* Rich Flag Badge */}
                                        <div className="absolute top-4 right-4 text-4xl select-none z-0 drop-shadow-md">
                                            {entry.flag}
                                        </div>

                                        {/* Foreground Content */}
                                        <div className="relative z-10 pr-8">
                                            <h4 className="font-bold text-lg text-neutral-900">{entry.title}</h4>
                                            {entry.subtitle && (
                                                <h5 className="font-semibold text-neutral-800 mt-0.5">
                                                    {entry.subtitle}
                                                </h5>
                                            )}
                                            <div className="mt-2.5"><p className="text-sm text-neutral-800 leading-relaxed font-normal">{entry.content}</p></div>
                                            <span className="timeline-element-date block mt-4 text-xs font-bold text-neutral-600 tracking-wide uppercase">{entry.date}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 text-center text-xs text-neutral-600">
                Bangalore, India • Built with Next.js & Tailwind
            </footer>
        </main>
    );
}