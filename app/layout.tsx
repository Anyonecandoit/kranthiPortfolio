import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
import { AmbientBackground } from "@/components/ambient-background";
import { PageTransition } from "@/components/page-transition";
import { NativeShell } from "@/components/native-shell";
import { PushService } from "@/components/push-service";
import { PushToast } from "@/components/push-toast";
import dynamic from "next/dynamic";

// Lazy-load the command palette so the tools catalog + resume index only
// load on first open (keeps every page's initial JS bundle lean).
const GlobalSearch = dynamic(
  () => import("@/components/search-modal").then((m) => m.GlobalSearch),
  { ssr: false, loading: () => null }
);
// The visitor widget is client-only (localStorage/sessionStorage + polling),
// so it is lazy-loaded too — keeps the server-rendered HTML and initial JS lean.
const VisitorWidget = dynamic(
  () => import("@/components/visitor-widget").then((m) => m.VisitorWidget),
  { ssr: false, loading: () => null }
);
import { ChatProvider } from "@/lib/chat-context";
import { AuthProvider } from "@/lib/auth-context";
import { SiteSettingsProvider } from "@/lib/settings";
import { resumeData } from "@/data/resume";

// Inter (variable) — the Oberon template's typeface: neutral, professional,
// with medium-weight tight-tracked headings. Replaces Space Grotesk.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      description: resumeData.summary,
      email: `mailto:${resumeData.contact.email}`,
      telephone: resumeData.contact.phone.replace(/\s+/g, ""),
      address: {
        "@type": "PostalAddress",
        addressLocality: resumeData.location.split(",")[0]?.trim() ?? "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      sameAs: [
        resumeData.contact.linkedin,
        "https://github.com/kranthiai2006",
      ],
      worksFor: {
        "@type": "Organization",
        name: resumeData.experience[0]?.company ?? "Barraq Technology Lab India Private Limited",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: resumeData.education[0]?.institution ?? "Jawaharlal Nehru Technological University, Kakinada",
      },
      knowsAbout: resumeData.skills.map((skill) => skill.name),
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Kranthi Kumar Katta",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
      },
      sameAs: [
        resumeData.contact.linkedin,
        "https://github.com/kranthiai2006",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Kranthi Kumar Katta | Senior SDET & Test Automation Expert",
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: "Kranthi Kumar Katta – Senior SDET & Test Automation Expert",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`,
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Kranthi Kumar Katta's Projects",
      itemListElement: resumeData.projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          ...(project.technologies?.length
            ? { keywords: project.technologies.join(", ") }
            : {}),
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: resumeData.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kranthi Kumar Katta | Senior SDET & Test Automation Expert",
    template: "%s | Kranthi Kumar Katta",
  },
  description:
    "Senior SDET with 5+ years in test automation — Selenium, Playwright, REST Assured, JMeter, API & performance testing, CI/CD. Explore projects, experience, and chat with my AI assistant.",
  applicationName: "Kranthi Kumar Katta Portfolio",
  authors: [{ name: "Kranthi Kumar Katta", url: siteUrl }],
  creator: "Kranthi Kumar Katta",
  publisher: "Kranthi Kumar Katta",
  category: "Portfolio",
  keywords: [
    "Kranthi Kumar Katta",
    "Senior SDET",
    "SDET portfolio",
    "test automation engineer",
    "QA engineer Bangalore",
    "Selenium",
    "Playwright",
    "REST Assured",
    "JMeter",
    "API testing",
    "performance testing",
    "software testing",
    "test automation expert",
    "Bangalore",
    "India",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/og-image.png",
  },
  openGraph: {
    title: "Kranthi Kumar Katta | Senior SDET & Test Automation Expert",
    description:
      "Senior SDET with 5+ years of experience in Selenium, Playwright, API testing, performance testing, and CI/CD. Explore my projects, experience, and chat with my AI assistant.",
    url: siteUrl,
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta – Senior SDET & Test Automation Expert portfolio preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kranthi Kumar Katta | Senior SDET & Test Automation Expert",
    description:
      "Senior SDET with 5+ years in automation, performance testing, API testing, and AI-powered tools. Chat with my AI assistant.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0ee" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  colorScheme: "light",
  // Required by the Capacitor status-bar overlay + iOS notches: lets the page
  // draw under the status bar and exposes env(safe-area-inset-*) to CSS.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased transition-colors duration-300 bg-[var(--bg-primary)]`}
      >
        {/* Skip‑to‑content link for screen‑reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--accent)] text-white py-2 px-4 rounded-md z-50"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* Native-only shell: splash, status bar, back button, deep links, haptics */}
          <NativeShell />
          {/* Firebase push: token registration + tap navigation (native only) */}
          <PushService />
          <AuthProvider>
          <SiteSettingsProvider>
          <ChatProvider>
            <ChatPageGuard />
            {/* Subtle noise texture overlay */}
            <NoiseTexture opacity={0.025} />
            {/* Floating gradient blobs + grid (all pages) */}
            <AmbientBackground />
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
              <PageTransition>{children}</PageTransition>
            </main>
            <ConditionalFooter />
            <FloatingChat />
            <FloatingVoice />
            {/* Foreground push notification banner */}
            <PushToast />
            {/* Real-time visitor analytics widget (bottom-left) */}
            <VisitorWidget />
          </ChatProvider>
          </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
