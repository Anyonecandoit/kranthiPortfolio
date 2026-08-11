import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Kranthi's AI Assistant",
  description:
    "Ask Kranthi Kumar Katta's AI assistant anything about his SDET experience, test automation projects, skills, and services — powered by multiple specialized AI agents.",
  alternates: { canonical: "/chat" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Chat with Kranthi's AI Assistant",
    description:
      "Ask Kranthi Kumar Katta's AI assistant about his SDET experience, test automation projects, and skills.",
    url: "/chat",
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta – AI assistant chat",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with Kranthi's AI Assistant",
    description:
      "Ask Kranthi Kumar Katta's AI assistant about his SDET experience and test automation projects.",
    images: ["/og-image.png"],
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
