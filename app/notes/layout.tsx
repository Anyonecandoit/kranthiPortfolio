import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Notes",
  description:
    "A free notepad with AI superpowers — summarize, improve, expand, translate, or continue any note in one click. Notes are saved locally; sign in to sync.",
  alternates: { canonical: "/notes" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AI Notes",
    description:
      "A free notepad with AI superpowers — summarize, improve, expand, translate, or continue any note.",
    url: "/notes",
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta – AI Notes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Notes",
    description: "A notepad with AI superpowers — summarize, translate, expand, and more.",
    images: ["/og-image.png"],
  },
};

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
