import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools Library",
  description:
    "Free AI-powered online tools by Kranthi Kumar Katta — writing, coding, testing, content, and productivity utilities. Pick a tool, fill in the fields, and run it.",
  alternates: { canonical: "/tools" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AI Tools Library",
    description:
      "Free AI-powered online tools — writing, coding, testing, content, and productivity utilities.",
    url: "/tools",
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta – AI Tools Library",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Library",
    description: "Free AI-powered online tools by Kranthi Kumar Katta.",
    images: ["/og-image.png"],
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
