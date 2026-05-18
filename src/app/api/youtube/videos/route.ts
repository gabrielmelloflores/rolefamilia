import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const videos = await prisma.youTubeVideo.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(videos);
}
