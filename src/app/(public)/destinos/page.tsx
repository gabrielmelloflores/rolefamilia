import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAZIL_REGIONS, CONTINENTS } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 7200;

export const metadata: Metadata = {
  title: "Destinos de Viagem — Rolê Família",
  description: "Explore nossos destinos no Brasil e no mundo. Dicas, roteiros e guias para viagens em família.",
};

export default async function DestinosPage() {
  const [brazilCount, worldCount] = await Promise.all([
    prisma.destination.count({ where: { isPublished: true, continent: "AMERICA_DO_SUL" } }),
    prisma.destination.count({ where: { isPublished: true, NOT: { continent: "AMERICA_DO_SUL" } } }),
  ]);

  const featured = await prisma.destination.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 6,
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <Breadcrumb items={[{ label: "Destinos" }]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 mt-4 mb-2">Nossos Destinos</h1>
          <p className="text-stone-500 text-lg">Exploramos o Brasil e o mundo com os olhos da nossa família.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <Link href="/destinos/brasil" className="group relative h-72 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-700" />
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <span className="text-5xl">🇧🇷</span>
              <div>
                <h2 className="font-heading text-3xl text-white font-bold">Brasil</h2>
                <p className="text-green-200 mt-1">
                  {brazilCount} destinos · {BRAZIL_REGIONS.length} regiões
                </p>
                <p className="text-green-300 text-sm mt-2 group-hover:underline">Explorar o Brasil →</p>
              </div>
            </div>
          </Link>

          <Link href="/destinos/mundo" className="group relative h-72 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <span className="text-5xl">🌍</span>
              <div>
                <h2 className="font-heading text-3xl text-white font-bold">Mundo</h2>
                <p className="text-blue-200 mt-1">
                  {worldCount} destinos · {CONTINENTS.filter((c) => c.enum !== "AMERICA_DO_SUL").length} continentes
                </p>
                <p className="text-blue-300 text-sm mt-2 group-hover:underline">Explorar o mundo →</p>
              </div>
            </div>
          </Link>
        </div>

        {featured.length > 0 && (
          <div>
            <h2 className="font-heading text-3xl text-stone-900 mb-8">Destinos em destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
