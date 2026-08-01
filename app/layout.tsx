import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MainContent } from "./components/MainContent";
import "./globals.css";

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

// SEO Metadata
const siteName = "Kranthi Kumar Katta - Portfolio";
const description = "Kranthi Kumar Katta - SDET and QA Automation Engineer with 5+ years of experience in test automation, CI/CD, and fintech systems.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: description,
  metadataBase: new URL('https://kranthikumarkatta.com'),
  keywords: [
    "Kranthi Kumar Katta",
    "SDET",
    "QA Automation Engineer",
    "Test Automation",
    "CI/CD",
    "FinTech",
    "Quality Assurance",
    "Software Development",
    "Portfolio"
  ],
  openGraph: {
    title: siteName,
    description: description,
    url: "https://kranthikumarkatta.com", // Update with actual URL
    siteName: siteName,
    images: [
      {
        url: "/images/og-image.png", // Will create this later
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: description,
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kranthikumarkatta.com", // Update with actual URL
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kranthi Kumar Katta",
    "url": "https://kranthikumarkatta.com",
    "jobTitle": "Senior Software Engineer & SDET",
    "description": "Kranthi Kumar Katta - SDET and QA Automation Engineer with 5+ years of experience in test automation, CI/CD, and fintech systems.",
    "sameAs": [
      "https://github.com/kranthikatta",
      "https://www.linkedin.com/in/kranthikatta",
      "https://twitter.com/kranthikatta"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "FinTech Industry"
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
        {/* Header */}
        <Header />
        {/* Main Content with Transition */}
        <MainContent>
          {children}
        </MainContent>
        {/* Footer */}
        <Footer />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </body>
    </html>
  );
}
