import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  coverImage: z.string().url(),
  altText: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  destinationId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  ogImage: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const destination = searchParams.get("destination") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const status = searchParams.get("status") ?? "PUBLISHED";

  const session = await auth();
  const isAdmin = !!session?.user;

  const where = {
    status: isAdmin ? (status as "DRAFT" | "PUBLISHED" | "ARCHIVED") : "PUBLISHED" as const,
    ...(category && { categories: { some: { category: { slug: category } } } }),
    ...(tag && { tags: { some: { tag: { slug: tag } } } }),
    ...(destination && { destination: { slug: destination } }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { categoryIds, tagIds, slug, destinationId, ...rest } = parsed.data;
  const finalSlug = slug || slugify(rest.title);

  const post = await prisma.post.create({
    data: {
      title: rest.title,
      slug: finalSlug,
      excerpt: rest.excerpt,
      content: rest.content as Prisma.InputJsonValue,
      coverImage: rest.coverImage,
      altText: rest.altText,
      status: rest.status,
      seoTitle: rest.seoTitle,
      seoDesc: rest.seoDesc,
      ogImage: rest.ogImage,
      ...(destinationId ? { destination: { connect: { id: destinationId } } } : {}),
      publishedAt: rest.status === "PUBLISHED" ? new Date() : null,
      categories: categoryIds?.length
        ? { create: categoryIds.map((id) => ({ categoryId: id })) }
        : undefined,
      tags: tagIds?.length
        ? { create: tagIds.map((id) => ({ tagId: id })) }
        : undefined,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
