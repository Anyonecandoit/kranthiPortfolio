import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import ToolsClientPage from "@/components/tools/tools-client-page";

const siteUrl = "https://www.kranthikumarkatta.in";

/**
 * SEO landing page for every tool in the registry — one crawlable URL per
 * tool (/tools/test-generator, /tools/regex-builder, …). Each page ships a
 * unique title, description, canonical, OG/Twitter card, and SoftwareApplication
 * structured data, and reuses the interactive tool UI (pre-selected).
 *
 * The long-tail keywords these pages target ("free test case generator",
 * "regex builder", "AI resume writer") are the most realistic path to first-page
 * rankings for a small site, and give the /tools library real indexable content.
 */

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const tool = TOOLS.find((t) => t.id === params.id);
  if (!tool) return {};

  const title = `${tool.name} — Free AI Tool`;
  const description = `${tool.description} A free AI tool by Kranthi Kumar Katta — no sign-up needed.`;
  const url = `/tools/${tool.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Kranthi Kumar Katta",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${tool.name} — free AI tool by Kranthi Kumar Katta`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default function ToolPage({ params }: { params: { id: string } }) {
  const tool = TOOLS.find((t) => t.id === params.id);
  if (!tool) notFound();

  const toolStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    genre: tool.category,
    url: `${siteUrl}/tools/${tool.id}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Person",
      name: "Kranthi Kumar Katta",
      url: `${siteUrl}/`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolStructuredData) }}
      />
      <ToolsClientPage initialToolId={tool.id} />
    </>
  );
}
