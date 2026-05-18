import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const featured = searchParams.get("featured") === "true";

  const session = await auth();

  const itineraries = await prisma.itinerary.findMany({
    where: {
      ...(!session?.user && { isPublished: true }),
      ...(destination && { destination: { slug: destination } }),
      ...(difficulty && { difficulty: difficulty as never }),
      ...(featured && { isFeatured: true }),
    },
    include: {
      destination: { select: { id: true, name: true, slug: true, country: true } },
      _count: { select: { days: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(itineraries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, ...data } = body;

  const itinerary = await prisma.itinerary.create({
    data: { ...data, slug: slug || slugify(data.title) },
  });

  return NextResponse.json(itinerary, { status: 201 });
}
