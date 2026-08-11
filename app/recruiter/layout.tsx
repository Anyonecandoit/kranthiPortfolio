import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Mode – JD Matcher",
  description:
    "Paste a job description or upload a PDF and instantly see how Kranthi Kumar Katta's SDET resume matches — matched skills, gaps, relevant experience, and interview questions.",
  alternates: { canonical: "/recruiter" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Recruiter Mode – JD Matcher",
    description:
      "Instant match score for Kranthi Kumar Katta's SDET resume against any job description.",
    url: "/recruiter",
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta – Recruiter Mode JD Matcher",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recruiter Mode – JD Matcher",
    description:
      "See how Kranthi Kumar Katta's SDET resume matches your job description.",
    images: ["/og-image.png"],
  },
};

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
