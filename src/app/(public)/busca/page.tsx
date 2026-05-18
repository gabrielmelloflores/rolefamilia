import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [posts, destinations, itineraries] = query
    ? await Promise.all([
        prisma.post.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 5,
          orderBy: { publishedAt: "desc" },
        }),
        prisma.destination.findMany({
          where: {
            isPublished: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { country: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 4,
        }),
        prisma.itinerary.findMany({
          where: {
            isPublished: true,
            title: { contains: query, mode: "insensitive" },
          },
          take: 4,
        }),
      ])
    : [[], [], []];

  const total = posts.length + destinations.length + itineraries.length;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Busca" }]} />
          <h1 className="font-heading text-3xl text-stone-900 mt-4 mb-6">Buscar</h1>

          <form method="get">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Buscar posts, destinos, roteiros..."
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-stone-900 placeholder:text-stone-400"
                autoFocus
              />
            </div>
          </form>
        </div>

        {query && (
          <p className="text-stone-400 text-sm mb-8">
            {total} resultado{total !== 1 ? "s" : ""} para &quot;<strong className="text-stone-700">{query}</strong>&quot;
          </p>
        )}

        {posts.length > 0 && (
          <section className="mb-10">
            <h2 className="font-semibold text-stone-700 mb-4 text-sm uppercase tracking-wider">Posts</h2>
            <div className="space-y-3">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-4 p-4 rounded-xl border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all">
                  <div className="relative h-16 w-20 rounded-lg overflow-hidden flex-none">
                    <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 line-clamp-1">{p.title}</p>
                    <p className="text-stone-500 text-sm line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {destinations.length > 0 && (
          <section className="mb-10">
            <h2 className="font-semibold text-stone-700 mb-4 text-sm uppercase tracking-wider">Destinos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {destinations.map((d) => (
                <Link key={d.id} href={`/destinos/${d.slug}`} className="group block">
                  <div className="relative h-28 rounded-xl overflow-hidden">
                    <Image src={d.coverImage} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-stone-900/40" />
                    <div className="absolute bottom-2 left-2">
                      <p className="text-white text-xs font-bold">{d.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {itineraries.length > 0 && (
          <section>
            <h2 className="font-semibold text-stone-700 mb-4 text-sm uppercase tracking-wider">Roteiros</h2>
            <div className="space-y-3">
              {itineraries.map((it) => (
                <Link key={it.id} href={`/roteiros/${it.slug}`} className="flex gap-4 p-4 rounded-xl border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all">
                  <div className="relative h-16 w-20 rounded-lg overflow-hidden flex-none">
                    <Image src={it.coverImage} alt={it.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 line-clamp-1">{it.title}</p>
                    <p className="text-stone-500 text-sm">{it.duration} dias · {it.difficulty}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {query && total === 0 && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">Nenhum resultado encontrado para &quot;{query}&quot;</p>
            <p className="text-stone-400 text-sm mt-2">Tente termos mais simples ou navegue pelos destinos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
