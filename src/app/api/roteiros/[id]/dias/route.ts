import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, Meal } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const days = await prisma.itineraryDay.findMany({
    where: { itineraryId: id },
    orderBy: { dayNumber: "asc" },
  });
  return NextResponse.json(days);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: itineraryId } = await params;
  const { days } = await req.json() as { days: Array<Record<string, unknown>> };

  // Bulk upsert: delete all and re-insert in order
  await prisma.itineraryDay.deleteMany({ where: { itineraryId } });

  const created = await prisma.itineraryDay.createMany({
    data: days.map((day, i) => ({
      itineraryId,
      dayNumber: i + 1,
      title: day.title as string,
      description: day.description ? (day.description as Prisma.InputJsonValue) : Prisma.JsonNull,
      accommodation: (day.accommodation as string | null | undefined) ?? null,
      accommodationUrl: (day.accommodationUrl as string | null | undefined) ?? null,
      meals: ((day.meals as string[]) ?? []) as Meal[],
      activities: day.activities ? (day.activities as Prisma.InputJsonValue) : Prisma.JsonNull,
      images: (day.images as string[]) ?? [],
    })),
  });

  return NextResponse.json({ created: created.count });
}
