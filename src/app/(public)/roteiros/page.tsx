import { prisma } from "@/lib/prisma";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { DuracaoSelect } from "@/components/itinerary/DuracaoSelect";
import type { Metadata } from "next";
import type { Difficulty } from "@prisma/client";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Roteiros de Viagem — Rolê Família",
  description: "Roteiros detalhados para viagens em família, com dia a dia, inclusos e dicas de como chegar.",
};

export default async function RoteirosPage({
  searchParams,
}: {
  searchParams: Promise<{ dificuldade?: string; duracao?: string }>;
}) {
  const { dificuldade, duracao } = await searchParams;

  const where = {
    isPublished: true,
    ...(dificuldade ? { difficulty: dificuldade as Difficulty } : {}),
    ...(duracao ? { duration: { lte: parseInt(duracao, 10) } } : {}),
  };

  const [itineraries, total] = await Promise.all([
    prisma.itinerary.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: { destination: { select: { name: true } } },
    }),
    prisma.itinerary.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Roteiros" }]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 mt-4 mb-2">Roteiros de Viagem</h1>
          <p className="text-stone-500 text-lg">{total} roteiros detalhados para a sua família</p>
        </div>

        <div className="flex gap-3 flex-wrap mb-10">
          <a href="/roteiros" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!dificuldade ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
            Todos
          </a>
          {["FACIL", "MODERADO", "DIFICIL"].map((d) => (
            <a
              key={d}
              href={`/roteiros?dificuldade=${d}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${dificuldade === d ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {d === "FACIL" ? "Fácil" : d === "MODERADO" ? "Moderado" : "Difícil"}
            </a>
          ))}
          <div className="ml-auto">
            <DuracaoSelect value={duracao} />
          </div>
        </div>

        {itineraries.length === 0 ? (
          <p className="text-stone-400 text-center py-20">Nenhum roteiro encontrado com esses filtros.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((it) => (
              <ItineraryCard key={it.id} itinerary={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
