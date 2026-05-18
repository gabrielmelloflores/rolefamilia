import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PROVIDER_MAP: Record<string, string> = {
  booking: "BOOKING",
  holafly: "HOLAFLY",
  seguros: "SEGUROS_PROMO",
};

const recentClicks = new Map<string, number>();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const enumProvider = PROVIDER_MAP[provider.toLowerCase()];
  if (!enumProvider) return NextResponse.json({ error: "Unknown provider" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const key = `${ip}:${provider}`;
  const now = Date.now();
  const last = recentClicks.get(key) ?? 0;
  const rateLimited = now - last < 5 * 60 * 1000;
  if (!rateLimited) recentClicks.set(key, now);

  const link = await prisma.affiliateLink.findFirst({
    where: { provider: enumProvider as import("@prisma/client").AffiliateProvider, isActive: true },
    select: { id: true, url: true },
    orderBy: { clicks: "asc" },
  });

  if (!link) return NextResponse.json({ url: null });

  if (!rateLimited) {
    await prisma.affiliateLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    });
  }

  return NextResponse.json({ url: link.url });
}
