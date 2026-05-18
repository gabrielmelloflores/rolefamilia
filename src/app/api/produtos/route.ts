import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? undefined;
  const featured = searchParams.get("featured") === "true";

  const session = await auth();

  const products = await prisma.product.findMany({
    where: {
      ...(!session?.user && { isPublished: true }),
      ...(type && { type: type as never }),
      ...(featured && { isFeatured: true }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      type: true,
      price: true,
      currency: true,
      coverImage: true,
      previewImages: true,
      isPublished: true,
      isFeatured: true,
      createdAt: true,
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, ...data } = body;

  // Create Stripe product + price
  const stripeProduct = await stripe.products.create({
    name: data.name,
    description: data.description,
    images: data.coverImage ? [data.coverImage] : [],
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: Math.round(Number(data.price) * 100),
    currency: (data.currency ?? "brl").toLowerCase(),
  });

  const product = await prisma.product.create({
    data: {
      ...data,
      slug: slug || slugify(data.name),
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
