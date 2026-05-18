import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const continent = searchParams.get("continent") ?? undefined;
  const region = searchParams.get("region") ?? undefined;
  const featured = searchParams.get("featured") === "true";

  const session = await auth();
  const isAdmin = !!session?.user;

  const destinations = await prisma.destination.findMany({
    where: {
      ...(!isAdmin && { isPublished: true }),
      ...(continent && { continent: continent as never }),
      ...(region && { region }),
      ...(featured && { isFeatured: true }),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(destinations);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, ...data } = body;

  const destination = await prisma.destination.create({
    data: {
      ...data,
      slug: slug || slugify(data.name),
    },
  });

  return NextResponse.json(destination, { status: 201 });
}
