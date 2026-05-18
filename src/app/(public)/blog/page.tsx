import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Blog de Viagem — Rolê Família",
  description: "Dicas, roteiros e histórias de viagem em família pelo Brasil e pelo mundo.",
};

const POSTS_PER_PAGE = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; categoria?: string }>;
}) {
  const { page: pageParam, categoria } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const skip = (page - 1) * POSTS_PER_PAGE;

  const where = {
    status: "PUBLISHED" as const,
    ...(categoria
      ? { categories: { some: { category: { slug: categoria } } } }
      : {}),
  };

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: POSTS_PER_PAGE,
      skip,
      include: { categories: { include: { category: true } } },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: { where: { post: { status: "PUBLISHED" } } } } } },
    }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Blog" }]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 mt-4 mb-2">Blog de Viagem</h1>
          <p className="text-stone-500 text-lg">{total} histórias de aventuras em família</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoria ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?categoria=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoria === cat.slug ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {cat.name} ({cat._count.posts})
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-stone-400 text-center py-20">Nenhum post encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${categoria ? `&categoria=${categoria}` : ""}`}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${p === page ? "bg-amber-500 text-stone-900" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
