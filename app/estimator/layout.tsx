import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Estimator",
  description:
    "Get a free, instant project estimate from Kranthi Kumar Katta — scope, timeline, cost range, milestones, and next steps. No commitment required.",
  alternates: { canonical: "/estimator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Project Estimator",
    description:
      "Describe your project and get a structured estimate — scope, timeline, cost, and milestones. Free, no commitment.",
    url: "/estimator",
    siteName: "Kranthi Kumar Katta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kranthi Kumar Katta – Project Estimator",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Estimator",
    description: "Free project estimates — scope, timeline, cost, and milestones.",
    images: ["/og-image.png"],
  },
};

export default function EstimatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
