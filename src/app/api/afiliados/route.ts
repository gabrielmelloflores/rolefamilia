import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") ?? undefined;

  const links = await prisma.affiliateLink.findMany({
    where: { ...(provider && { provider: provider as never }) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const link = await prisma.affiliateLink.create({ data: body });
  return NextResponse.json(link, { status: 201 });
}
