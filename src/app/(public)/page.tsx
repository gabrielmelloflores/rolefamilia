import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { LatestPosts } from "@/components/home/LatestPosts";
import { YouTubeSection } from "@/components/home/YouTubeSection";
import { ShopTeaser } from "@/components/home/ShopTeaser";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rolê Família — Viagens em família pelo Brasil e pelo mundo",
  description: "Roteiros detalhados, dicas honestas e produtos digitais para tornar a sua viagem em família inesquecível.",
};

export default async function HomePage() {
  const [destinations, posts, videos, products] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 8,
      include: { _count: { select: { posts: true } } },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { categories: { include: { category: true } } },
    }),
    prisma.youTubeVideo.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
  ]);

  const heroImage = destinations[0]?.coverImage;

  return (
    <>
      <HeroSection coverImage={heroImage} />
      <FeaturedDestinations destinations={destinations} />
      <LatestPosts posts={posts} />
      <YouTubeSection videos={videos} />
      <ShopTeaser products={products} />
      <NewsletterBanner />
    </>
  );
}
