import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q") ?? "";

  if (q.trim().length < 2) {
    return NextResponse.json({ posts: [], destinations: [], itineraries: [] });
  }

  const [posts, destinations, itineraries] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, title: true, slug: true, coverImage: true, excerpt: true },
    }),
    prisma.destination.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { country: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, name: true, slug: true, coverImage: true, country: true },
    }),
    prisma.itinerary.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, title: true, slug: true, coverImage: true, duration: true },
    }),
  ]);

  return NextResponse.json({ posts, destinations, itineraries });
}
