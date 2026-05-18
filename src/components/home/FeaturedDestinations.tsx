"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: string;
  coverImage: string;
  _count?: { posts: number };
}

interface FeaturedDestinationsProps {
  destinations: Destination[];
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });

  if (!destinations.length) return null;

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">Nossos destinos</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-stone-900">Onde já viajamos</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="p-2.5 rounded-full border border-stone-300 hover:bg-stone-100 hover:border-stone-400 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="p-2.5 rounded-full border border-stone-300 hover:bg-stone-100 hover:border-stone-400 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {destinations.map((dest) => (
              <div key={dest.id} className="flex-none w-64 sm:w-72">
                <Link href={`/destinos/${dest.slug}`} className="group block">
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <Image
                      src={dest.coverImage}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-lg leading-tight">{dest.name}</p>
                      <p className="text-stone-300 text-sm">{dest.country}</p>
                      {dest._count && (
                        <p className="text-stone-400 text-xs mt-1">{dest._count.posts} posts</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/destinos" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            Ver todos os destinos →
          </Link>
        </div>
      </div>
    </section>
  );
}
