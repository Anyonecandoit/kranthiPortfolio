import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingChat } from "@/components/chat/floating-chat";
import { FloatingVoice } from "@/components/voice/floating-voice";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { ChatPageGuard } from "@/components/chat/chat-layout";
import { ConditionalFooter } from "@/components/chat/chat-footer-wrapper";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CursorGlow } from "@/components/ui/cursor-glow";
import dynamic from "next/dynamic";

// Lazy-load the command palette so the tools catalog + resume index only
// load on first open (keeps every page's initial JS bundle lean).
const GlobalSearch = dynamic(
  () => import("@/components/search-modal").then((m) => m.GlobalSearch),
  { ssr: false, loading: () => null }
);
import { ChatProvider } from "@/lib/chat-context";
import { AuthProvider } from "@/lib/auth-context";
import { SiteSettingsProvider } from "@/lib/settings";
import { resumeData } from "@/data/resume";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = "https://www.kranthikumarkatta.in";

/** JSON-LD structured data — single source of truth is resumeData */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: resumeData.name,
      url: `${siteUrl}/`,
      image: `${siteUrl}/og-image.png`,
      jobTitle: resumeData.title,
      email: `mailto:${resumeData.contact.email}`,
      telephone: resumeData.contact.phone.replace(/\s+/g, ""),
      address: {
        "@type": "PostalAddress",
        addressLocality: resumeData.location.split(",")[0]?.trim() ?? "Bangalore",
        addressCountry: "IN",
      },
      sameAs: [resumeData.contact.linkedin],
      worksFor: {
        "@type": "Organization",
        name: resumeData.experience[0]?.company ?? "Barraq Technology Lab India Private Limited",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Kranthi Kumar Katta | AI-Powered Portfolio",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export const metadata: Metadata = {
  title: "Kranthi Kumar Katta | AI-Powered Portfolio",
  description:
    "Senior SDET specializing in automation, performance testing, API testing, and AI-powered tools. Explore my projects, experience, and chat with my AI assistant.",
  metadataBase: new URL("https://www.kranthikumarkatta.in"),
  openGraph: {
    title: "Kranthi Kumar Katta – AI-Powered Portfolio",
    description:
      "Senior SDET with 5+ years of experience. AI assistant, real-time chat, and knowledge base.",
    url: "https://www.kranthikumarkatta.in",
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta portfolio preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kranthi Kumar Katta – AI-Powered Portfolio",
    description:
      "Senior SDET with 5+ years of experience. AI assistant, real-time chat, and knowledge base.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased transition-colors duration-300`}
      >
        {/* Skip‑to‑content link for screen‑reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white py-2 px-4 rounded-md z-50"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
          <SiteSettingsProvider>
          <ChatProvider>
            <ChatPageGuard />
            {/* Subtle noise texture overlay */}
            <NoiseTexture opacity={0.025} />
            {/* Scroll progress bar */}
            <ScrollProgress />
            {/* Cursor glow effect */}
            <CursorGlow />
            {/* Fires page_view analytics on every route change */}
            <AnalyticsTracker />
            {/* Sticky nav */}
            <Navbar />
            {/* Command palette — opens with ⌘K / Ctrl+K or the navbar search icon */}
            <GlobalSearch />
            {/* Main content – wrapped with an id for the skip link */}
            <main id="main-content" className="relative z-10">
              {children}
            </main>
            <ConditionalFooter />
            <FloatingChat />
            <FloatingVoice />
          </ChatProvider>
          </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
