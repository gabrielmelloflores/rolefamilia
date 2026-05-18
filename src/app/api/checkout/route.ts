import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  productId: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId, isPublished: true },
    select: { stripePriceId: true, name: true, coverImage: true },
  });

  if (!product?.stripePriceId) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    success_url: absoluteUrl(`/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`),
    cancel_url: absoluteUrl(`/loja`),
    metadata: {
      productId: parsed.data.productId,
    },
    customer_creation: "always",
    billing_address_collection: "auto",
    locale: "pt-BR",
  });

  return NextResponse.json({ url: session.url });
}
