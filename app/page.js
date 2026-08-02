import ParticlesBackground from '@/components/ParticlesBackground';
import FlashingName from '@/components/FlashingName';
import TypewriterTitle from '@/components/TypewriterTitle';
import { FileText } from 'lucide-react';

export default function Home() {
    const portfolioData = {
        topProjects: [
            {
                name: "Fintech Test Automation",
                description: "Comprehensive automated regression framework built for high-throughput banking endpoints ensuring sub-millisecond reliability.",
                background: "#0a74db",
                color: "#fff",
                calltoaction: "View Repository",
                link: "https://github.com"
            },
            {
                name: "API Security Scanner",
                description: "A lightweight static analysis tool tailored for catching authorization flaws and injection vectors in microservices.",
                background: "#e91425",
                color: "#fff",
                calltoaction: "Explore Tool",
                link: "https://github.com"
            },
            {
                name: "Resilient CI/CD Pipeline",
                description: "Custom orchestration pipeline optimized for running parallel test suites across distributed staging environments.",
                background: "#273377",
                color: "#fff",
                calltoaction: "Documentation",
                link: "https://github.com"
            }
        ],
        timeline: [
            {
                title: "SDET 2",
                subtitle: "Fintech Enterprise",
                content: "Leading automation testing initiatives, designing robust test infrastructure, and scaling test coverage for core financial transaction engines.",
                date: "2024 - Present",
                background: "#004791",
                foreground: "#fff"
            },
            {
                title: "Automation Engineer",
                subtitle: "Systems & Infrastructure",
                content: "Developed end-to-end integration testing solutions and reduced manual regression cycles by over 70% using custom Python & Playwright frameworks.",
                date: "2022 - 2024",
                background: "#0086cd",
                foreground: "#fff"
            }
        ]
    };

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

                {/* Flashing Name & Typewriter Title */}
                <FlashingName />
                <TypewriterTitle />

                {/* Social Icons Bar */}
                <div className="socials flex items-center justify-center gap-4 mt-6 z-10 relative">
                    {/* GitHub */}
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-white hover:text-sky-400 transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a href="https://linkedin.com/in/kranthi-kumar-katta-a40093318" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-white hover:text-sky-400 transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>

                    {/* Email */}
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
                    <p>I’m Kranthi Kumar Katta from India. I love test automation, building resilient backend pipelines, securing fintech architecture, and exploring new programming paradigms.</p>
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
                            <div key={idx} className="card" style={{ backgroundColor: project.background, color: project.color }}>
                                <div className="card-content">
                                    <h4>{project.name}</h4>
                                    <div><p>{project.description}</p></div>
                                </div>
                                <div className="card-actions">
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="button">
                                        {project.calltoaction}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3>Timeline</h3>
                    <div className="timeline">
                        {portfolioData.timeline.map((entry, idx) => (
                            <div key={idx} className="timeline-element">
                                <span className="timeline-element-icon" style={{ backgroundColor: entry.background, color: entry.foreground }}>
                                    <FileText size={18} />
                                </span>
                                <div className="timeline-element-content">
                                    <h4>{entry.title}</h4>
                                    {entry.subtitle && <h5>{entry.subtitle}</h5>}
                                    <div><p>{entry.content}</p></div>
                                    <span className="timeline-element-date">{entry.date}</span>
                                </div>
                            </div>
                        ))}
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