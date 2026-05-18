import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PostContent } from "@/components/blog/PostContent";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { DisqusComments } from "@/components/blog/DisqusComments";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BookingWidget } from "@/components/affiliate/BookingWidget";
import { HolaflyBanner } from "@/components/affiliate/HolaflyBanner";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt,
    openGraph: { images: [post.ogImage ?? post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      destination: true,
    },
  });

  if (!post) notFound();

  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rolefamilia.com.br";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Rolê Família" },
    publisher: { "@type": "Organization", name: "Rolê Família", logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` } },
    mainEntityOfPage: postUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/blog" },
                ...(post.destination ? [{ label: post.destination.name, href: `/destinos/${post.destination.slug}` }] : []),
                { label: post.title },
              ]}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(({ category }) => (
              <span
                key={category.id}
                className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: category.color ?? "#14b8a6" }}
              >
                {category.name}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 leading-tight mb-6">{post.title}</h1>
          <p className="text-stone-500 text-xl leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex items-center gap-5 text-sm text-stone-400 mb-10">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime} min de leitura
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="relative aspect-[16/7] rounded-3xl overflow-hidden">
            <Image src={post.coverImage} alt={post.altText ?? post.title} fill priority className="object-cover" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <PostContent content={post.content as import("@tiptap/react").JSONContent} />

              <div className="mt-12 pt-8 border-t border-stone-200">
                <ShareButtons title={post.title} url={postUrl} />
              </div>

              {post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map(({ tag }) => (
                    <span key={tag.id} className="text-xs px-3 py-1 bg-stone-100 text-stone-600 rounded-full">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <DisqusComments slug={post.slug} title={post.title} url={postUrl} />
            </div>

            <aside className="space-y-6">
              <BookingWidget destinationName={post.destination?.name} />
              <HolaflyBanner />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
