import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Record<string, string> = await req.json();
  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
