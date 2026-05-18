import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedAt?: Date;
  noIndex?: boolean;
}

export function generateSeo({
  title,
  description,
  image,
  url,
  type = "website",
  publishedAt,
  noIndex,
}: SeoProps): Metadata {
  const ogImage = image ?? absoluteUrl("/og-default.jpg");

  return {
    title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      type,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedAt && { publishedTime: publishedAt.toISOString() }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
