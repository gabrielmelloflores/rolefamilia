import Link from "next/link";
import Image from "next/image";

interface DestinationCardProps {
  destination: {
    slug: string;
    name: string;
    country: string;
    continent: string;
    coverImage: string;
    _count?: { posts: number };
  };
}

export function DestinationCard({ destination: d }: DestinationCardProps) {
  return (
    <Link href={`/destinos/${d.slug}`} className="group block">
      <div className="relative h-64 rounded-2xl overflow-hidden">
        <Image
          src={d.coverImage}
          alt={d.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold text-lg leading-tight">{d.name}</p>
          <p className="text-stone-300 text-sm">{d.country}</p>
          {d._count !== undefined && (
            <p className="text-stone-400 text-xs mt-1">{d._count.posts} posts</p>
          )}
        </div>
      </div>
    </Link>
  );
}
