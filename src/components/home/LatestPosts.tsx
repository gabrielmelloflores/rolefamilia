"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PostCard } from "@/components/blog/PostCard";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: Date | null;
  readingTime: number;
  categories: { category: { name: string; color: string | null } }[];
}

export function LatestPosts({ posts }: { posts: Post[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  if (!posts.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-2">Do blog</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-stone-900">Últimas aventuras</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Ver todos →
          </Link>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
