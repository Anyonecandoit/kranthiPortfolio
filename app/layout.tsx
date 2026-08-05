import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ParticlesBackground from "@/components/particles-background";
import { FloatingChat } from "@/components/chat/floating-chat";
import { ChatPageGuard } from "@/components/chat/chat-layout";
import { ConditionalFooter } from "@/components/chat/chat-footer-wrapper";
import { ChatProvider } from "@/lib/chat-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-[#0a0a0f] text-white transition-colors duration-300`}
      >
        {/* Skip‑to‑content link for screen‑reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white py-2 px-4 rounded-md z-50"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ChatProvider>
            <ChatPageGuard />
            {/* Global particle constellation — visible on every page */}
            <ParticlesBackground />
            {/* Sticky glass‑morphism navbar */}
            <Navbar />
            {/* Main content – wrapped with an id for the skip link */}
            <main id="main-content" className="relative z-10">
              {children}
            </main>
            <ConditionalFooter />
            <FloatingChat />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
