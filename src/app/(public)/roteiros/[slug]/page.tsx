import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ItineraryTabs } from "@/components/itinerary/ItineraryTabs";
import { DayCard } from "@/components/itinerary/DayCard";
import { DifficultyBadge } from "@/components/itinerary/DifficultyBadge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BookingWidget } from "@/components/affiliate/BookingWidget";
import { HolaflyBanner } from "@/components/affiliate/HolaflyBanner";
import { SegurosBanner } from "@/components/affiliate/SegurosBanner";
import { formatCurrency } from "@/lib/utils";
import { Clock, DollarSign, Check, X } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const it = await prisma.itinerary.findUnique({ where: { slug } });
  if (!it) return {};
  return {
    title: `${it.title} — Rolê Família`,
    description: it.seoDesc ?? it.summary,
    openGraph: { images: [it.coverImage] },
  };
}

export default async function RoteiroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { slug, isPublished: true },
    include: {
      days: { orderBy: { dayNumber: "asc" } },
      destination: true,
    },
  });

  if (!itinerary) notFound();

  const tabs = [
    { id: "visao-geral", label: "Visão Geral" },
    { id: "dia-a-dia", label: "Dia a Dia" },
    { id: "incluso", label: "O que inclui" },
    { id: "como-chegar", label: "Como Chegar" },
  ];

  return (
    <div>
      <div className="relative h-[60vh] min-h-[400px] flex items-end">
        <Image src={itinerary.coverImage} alt={itinerary.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full">
          <Breadcrumb items={[
            { label: "Roteiros", href: "/roteiros" },
            ...(itinerary.destination ? [{ label: itinerary.destination.name, href: `/destinos/${itinerary.destination.slug}` }] : []),
            { label: itinerary.title },
          ]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-white mt-4 font-bold leading-tight">{itinerary.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <DifficultyBadge difficulty={itinerary.difficulty} />
            <span className="flex items-center gap-1.5 text-stone-300 text-sm">
              <Clock className="h-4 w-4" /> {itinerary.duration} dias
            </span>
            <span className="flex items-center gap-1.5 text-stone-300 text-sm">
              <DollarSign className="h-4 w-4" /> A partir de {formatCurrency(Number(itinerary.priceFrom))}
            </span>
          </div>
        </div>
      </div>

      <ItineraryTabs tabs={tabs}>
        {(activeTab) => (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
              <div>
                {activeTab === "visao-geral" && (
                  <div className="space-y-8">
                    <p className="text-stone-600 text-lg leading-relaxed">{itinerary.summary}</p>
                    {itinerary.highlights.length > 0 && (
                      <div>
                        <h2 className="font-heading text-2xl text-stone-900 mb-4">Destaques</h2>
                        <ul className="space-y-2">
                          {itinerary.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-stone-700">
                              <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-none mt-0.5">★</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "dia-a-dia" && (
                  <div>
                    <h2 className="font-heading text-2xl text-stone-900 mb-8">Roteiro dia a dia</h2>
                    {itinerary.days.length === 0 ? (
                      <p className="text-stone-400">Os dias ainda estão sendo configurados.</p>
                    ) : (
                      <div>
                        {itinerary.days.map((day) => (
                          <DayCard key={day.id} day={{
                            ...day,
                            description: typeof day.description === "string" ? day.description : null,
                            activities: Array.isArray(day.activities) ? day.activities as Array<{ name: string; description?: string; duration?: string; isOptional?: boolean }> : null,
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "incluso" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <h2 className="font-heading text-2xl text-stone-900 mb-4 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" /> O que inclui
                      </h2>
                      {itinerary.included.length === 0 ? (
                        <p className="text-stone-400 text-sm">Informações em breve.</p>
                      ) : (
                        <ul className="space-y-2">
                          {itinerary.included.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-stone-700 text-sm">
                              <Check className="h-4 w-4 text-green-500 flex-none mt-0.5" /> {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl text-stone-900 mb-4 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-400" /> Não inclui
                      </h2>
                      {itinerary.notIncluded.length === 0 ? (
                        <p className="text-stone-400 text-sm">Informações em breve.</p>
                      ) : (
                        <ul className="space-y-2">
                          {itinerary.notIncluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-stone-700 text-sm">
                              <X className="h-4 w-4 text-red-400 flex-none mt-0.5" /> {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "como-chegar" && (
                  <div>
                    <h2 className="font-heading text-2xl text-stone-900 mb-4">Como chegar</h2>
                    {itinerary.meetingPoint ? (
                      <p className="text-stone-600 text-lg">{itinerary.meetingPoint}</p>
                    ) : (
                      <p className="text-stone-400">Informações de chegada em breve.</p>
                    )}
                  </div>
                )}
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-stone-200 p-5 space-y-3">
                  <h3 className="font-semibold text-stone-800">Resumo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Duração</span>
                      <span className="font-medium">{itinerary.duration} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Dificuldade</span>
                      <DifficultyBadge difficulty={itinerary.difficulty} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">A partir de</span>
                      <span className="font-bold text-amber-600">{formatCurrency(Number(itinerary.priceFrom))}</span>
                    </div>
                  </div>
                </div>
                <BookingWidget destinationName={itinerary.destination?.name} />
                <HolaflyBanner />
                <SegurosBanner />
              </aside>
            </div>
          </div>
        )}
      </ItineraryTabs>
    </div>
  );
}
