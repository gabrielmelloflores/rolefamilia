import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchLatestVideos } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  const session = await auth();
  // Allow cron calls with secret header OR admin session
  const cronSecret = req.headers.get("x-cron-secret");
  const isAuthorized =
    session?.user || cronSecret === process.env.CRON_SECRET;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videos = await fetchLatestVideos(20);

  let upserted = 0;
  for (const video of videos) {
    await prisma.youTubeVideo.upsert({
      where: { videoId: video.videoId },
      update: { ...video, syncedAt: new Date() },
      create: video,
    });
    upserted++;
  }

  return NextResponse.json({ upserted });
}
