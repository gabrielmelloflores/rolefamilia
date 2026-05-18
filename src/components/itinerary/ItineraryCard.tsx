import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { DifficultyBadge } from "./DifficultyBadge";
import { formatCurrency } from "@/lib/utils";

interface ItineraryCardProps {
  itinerary: {
    slug: string;
    title: string;
    summary: string;
    coverImage: string;
    duration: number;
    difficulty: string;
    priceFrom: unknown;
    destination?: { name: string } | null;
  };
}

export function ItineraryCard({ itinerary: it }: ItineraryCardProps) {
  return (
    <Link href={`/roteiros/${it.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-stone-100 hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={it.coverImage}
            alt={it.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <DifficultyBadge difficulty={it.difficulty} />
          </div>
        </div>
        <div className="p-5">
          {it.destination && (
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">{it.destination.name}</p>
          )}
          <h3 className="font-semibold text-stone-900 text-lg leading-snug line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
            {it.title}
          </h3>
          <p className="text-stone-500 text-sm line-clamp-2 mb-4">{it.summary}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm text-stone-500">
              <Clock className="h-4 w-4" /> {it.duration} dias
            </span>
            <span className="text-sm font-bold text-amber-600">
              A partir de {formatCurrency(Number(it.priceFrom))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
