import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin, BUCKETS } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: { select: { fileUrl: true, fileName: true, name: true } } },
  });

  if (!order) {
    return NextResponse.redirect(new URL("/loja?error=invalid-token", process.env.NEXTAUTH_URL!));
  }

  if (order.status === "EXPIRED" || order.expiresAt < new Date()) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "EXPIRED" } });
    return NextResponse.redirect(new URL("/loja?error=expired", process.env.NEXTAUTH_URL!));
  }

  if (order.downloadCount >= order.maxDownloads) {
    return NextResponse.redirect(new URL("/loja?error=max-downloads", process.env.NEXTAUTH_URL!));
  }

  if (!order.product.fileUrl) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Extract path from Supabase URL
  const urlParts = order.product.fileUrl.split(`/${BUCKETS.PRODUCTS}/`);
  const filePath = urlParts[1];

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKETS.PRODUCTS)
    .createSignedUrl(filePath, 60); // 60s TTL

  if (error || !data) {
    return NextResponse.json({ error: "Could not generate download URL" }, { status: 500 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { downloadCount: { increment: 1 } },
  });

  return NextResponse.redirect(data.signedUrl);
}
