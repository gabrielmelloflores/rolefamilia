import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    publishedAt: Date | null;
    readingTime: number;
    categories?: { category: { name: string; color: string | null } }[];
  };
}

export function PostCard({ post }: PostCardProps) {
  const category = post.categories?.[0]?.category;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white border border-stone-100 hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden">
          {category && (
            <span
              className="absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: category.color ?? "#14b8a6" }}
            >
              {category.name}
            </span>
          )}
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-stone-900 text-lg leading-snug line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-stone-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
