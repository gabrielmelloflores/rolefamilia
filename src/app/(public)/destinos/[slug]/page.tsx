import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BookingWidget } from "@/components/affiliate/BookingWidget";
import { HolaflyBanner } from "@/components/affiliate/HolaflyBanner";
import { SegurosBanner } from "@/components/affiliate/SegurosBanner";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) return {};
  return {
    title: `${dest.name}, ${dest.country} — Rolê Família`,
    description: dest.description,
    openGraph: { images: [dest.coverImage] },
  };
}

export default async function DestinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug, isPublished: true },
  });

  if (!destination) notFound();

  const [posts, itineraries] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", destinationId: destination.id },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { categories: { include: { category: true } } },
    }),
    prisma.itinerary.findMany({
      where: { isPublished: true, destinationId: destination.id },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div>
      <div className="relative h-[60vh] min-h-[400px] flex items-end">
        <Image src={destination.coverImage} alt={destination.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Breadcrumb items={[
            { label: "Destinos", href: "/destinos" },
            { label: destination.name },
          ]} />
          <h1 className="font-heading text-4xl sm:text-6xl text-white mt-4 font-bold">{destination.name}</h1>
          <p className="flex items-center gap-2 text-stone-300 mt-2 text-lg">
            <MapPin className="h-4 w-4" /> {destination.country}
          </p>
        </div>
      </div>

      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            <div>
              {destination.description && (
                <p className="text-stone-600 text-lg leading-relaxed mb-12">{destination.description}</p>
              )}

              {itineraries.length > 0 && (
                <section className="mb-14">
                  <h2 className="font-heading text-2xl text-stone-900 mb-6">Roteiros disponíveis</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {itineraries.map((it) => (
                      <a key={it.id} href={`/roteiros/${it.slug}`} className="group flex gap-4 p-4 rounded-2xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all">
                        <div className="relative h-20 w-24 rounded-xl overflow-hidden flex-none">
                          <Image src={it.coverImage} alt={it.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2">{it.title}</p>
                          <p className="text-sm text-stone-400 mt-1">{it.duration} dias</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {posts.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl text-stone-900 mb-6">Posts sobre {destination.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {posts.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <BookingWidget destinationName={destination.name} />
              <HolaflyBanner />
              <SegurosBanner />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
