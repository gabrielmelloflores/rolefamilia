import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, name: true, slug: true, country: true } },
      days: { orderBy: { dayNumber: "asc" } },
    },
  });
  if (!itinerary) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(itinerary);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const itinerary = await prisma.itinerary.update({ where: { id }, data: body });
  return NextResponse.json(itinerary);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.itinerary.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
