import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CONTINENTS } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 7200;
export const metadata: Metadata = { title: "Destinos no Mundo — Rolê Família" };

export default async function MundoPage() {
  const continentCounts = await prisma.destination.groupBy({
    by: ["continent"],
    where: { isPublished: true, NOT: { continent: "AMERICA_DO_SUL" } },
    _count: { _all: true },
  });

  const countMap = Object.fromEntries(continentCounts.map((c) => [c.continent, c._count._all]));

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <Breadcrumb items={[{ label: "Destinos", href: "/destinos" }, { label: "Mundo" }]} />
          <div className="flex items-center gap-4 mt-4 mb-2">
            <span className="text-4xl">🌍</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-stone-900">Mundo</h1>
          </div>
          <p className="text-stone-500 text-lg">Aventuras internacionais com a nossa família</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONTINENTS.filter((c) => c.enum !== "AMERICA_DO_SUL").map((continent) => {
            const count = countMap[continent.enum] ?? 0;
            return (
              <Link
                key={continent.enum}
                href={`/destinos/mundo/${continent.slug}`}
                className="group flex items-center gap-4 p-6 rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
              >
                <span className="text-4xl">{continent.icon}</span>
                <div>
                  <h2 className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">{continent.name}</h2>
                  <p className="text-sm text-stone-400">{count} destinos</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
