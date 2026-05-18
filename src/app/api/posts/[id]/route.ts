import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, name: true, slug: true, country: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Increment views asynchronously (fire and forget)
  prisma.post.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { categoryIds, tagIds, ...data } = body;

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...data,
      ...(data.status === "PUBLISHED" && !data.publishedAt
        ? { publishedAt: new Date() }
        : {}),
      ...(categoryIds !== undefined && {
        categories: {
          deleteMany: {},
          create: categoryIds.map((cid: string) => ({ categoryId: cid })),
        },
      }),
      ...(tagIds !== undefined && {
        tags: {
          deleteMany: {},
          create: tagIds.map((tid: string) => ({ tagId: tid })),
        },
      }),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.update({ where: { id }, data: { status: "ARCHIVED" } });
  return NextResponse.json({ success: true });
}
