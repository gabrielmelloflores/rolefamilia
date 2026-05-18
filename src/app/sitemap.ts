import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, destinations, itineraries, products] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.destination.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.itinerary.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages = [
    "/",
    "/blog",
    "/destinos",
    "/destinos/brasil",
    "/destinos/mundo",
    "/roteiros",
    "/loja",
    "/sobre",
    "/contato",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const postPages = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const destinationPages = destinations.map((d) => ({
    url: absoluteUrl(`/destinos/${d.slug}`),
    lastModified: d.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const itineraryPages = itineraries.map((r) => ({
    url: absoluteUrl(`/roteiros/${r.slug}`),
    lastModified: r.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const productPages = products.map((p) => ({
    url: absoluteUrl(`/loja/${p.slug}`),
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...postPages,
    ...destinationPages,
    ...itineraryPages,
    ...productPages,
  ];
}
