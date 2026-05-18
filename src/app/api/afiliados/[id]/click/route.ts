import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limiter (per-process; use Redis in production)
const clicks = new Map<string, number>();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const key = `${ip}:${id}`;

  // Rate limit: 1 click per IP per link per 5 minutes
  const now = Date.now();
  const last = clicks.get(key) ?? 0;
  if (now - last < 5 * 60 * 1000) {
    const link = await prisma.affiliateLink.findUnique({
      where: { id },
      select: { url: true },
    });
    return NextResponse.json({ url: link?.url ?? "/" });
  }

  clicks.set(key, now);

  const link = await prisma.affiliateLink.update({
    where: { id },
    data: { clicks: { increment: 1 } },
    select: { url: true },
  });

  return NextResponse.json({ url: link.url });
}
