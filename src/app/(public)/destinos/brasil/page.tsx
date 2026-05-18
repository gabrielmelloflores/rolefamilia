import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BRAZIL_REGIONS } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 7200;
export const metadata: Metadata = { title: "Destinos no Brasil — Rolê Família" };

export default async function BrasilPage() {
  const destinations = await prisma.destination.findMany({
    where: { isPublished: true, continent: "AMERICA_DO_SUL", country: { contains: "Brasil", mode: "insensitive" } },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <Breadcrumb items={[{ label: "Destinos", href: "/destinos" }, { label: "Brasil" }]} />
          <div className="flex items-center gap-4 mt-4 mb-2">
            <span className="text-4xl">🇧🇷</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-stone-900">Brasil</h1>
          </div>
          <p className="text-stone-500 text-lg">{destinations.length} destinos pelo país mais lindo do mundo</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-14">
          {BRAZIL_REGIONS.map((region) => (
            <Link
              key={region.slug}
              href={`/destinos/brasil/${region.slug}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100 hover:border-green-200 transition-colors text-center"
            >
              <span className="text-2xl mb-2">{region.icon}</span>
              <span className="text-sm font-semibold text-stone-700">{region.name}</span>
            </Link>
          ))}
        </div>

        {destinations.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl text-stone-900 mb-6">Todos os destinos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
