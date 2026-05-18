import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CONTINENTS } from "@/lib/constants";
import type { Metadata } from "next";
import type { Continent } from "@prisma/client";

export const revalidate = 7200;

export async function generateMetadata({ params }: { params: Promise<{ continent: string }> }): Promise<Metadata> {
  const { continent } = await params;
  const c = CONTINENTS.find((c) => c.slug === continent);
  return { title: c ? `${c.name} — Rolê Família` : "Continente" };
}

export default async function ContinentPage({ params }: { params: Promise<{ continent: string }> }) {
  const { continent: slug } = await params;
  const continent = CONTINENTS.find((c) => c.slug === slug);
  if (!continent) notFound();

  const [destinations, posts] = await Promise.all([
    prisma.destination.findMany({
      where: { isPublished: true, continent: continent.enum as Continent },
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        destination: { continent: continent.enum as Continent },
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
            { label: "Mundo", href: "/destinos/mundo" },
            { label: continent.name },
          ]} />
          <div className="flex items-center gap-4 mt-4 mb-2">
            <span className="text-4xl">{continent.icon}</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-stone-900">{continent.name}</h1>
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
            <h2 className="font-heading text-2xl text-stone-900 mb-6">Posts</h2>
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
