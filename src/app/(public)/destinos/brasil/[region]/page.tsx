import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAZIL_REGIONS } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 7200;

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  const r = BRAZIL_REGIONS.find((r) => r.slug === region);
  return { title: r ? `${r.name} — Rolê Família` : "Região do Brasil" };
}

export default async function BrasilRegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = BRAZIL_REGIONS.find((r) => r.slug === regionSlug);
  if (!region) notFound();

  const [destinations, posts] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, region: regionSlug },
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        destination: { region: regionSlug },
      },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { categories: { include: { category: true } } },
    }),
  ]);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <Breadcrumb items={[
            { label: "Destinos", href: "/destinos" },
            { label: "Brasil", href: "/destinos/brasil" },
            { label: region.name },
          ]} />
          <div className="flex items-center gap-4 mt-4 mb-2">
            <span className="text-4xl">{region.icon}</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-stone-900">{region.name}</h1>
          </div>
          <p className="text-stone-500">{destinations.length} destinos · {posts.length} posts</p>
        </div>

        {destinations.length > 0 && (
          <section className="mb-14">
            <h2 className="font-heading text-2xl text-stone-900 mb-6">Destinos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl text-stone-900 mb-6">Posts da região</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
