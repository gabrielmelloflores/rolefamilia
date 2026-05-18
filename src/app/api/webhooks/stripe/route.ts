import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { absoluteUrl } from "@/lib/utils";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;

    if (!productId) return NextResponse.json({ received: true });

    // Idempotency check
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existing) return NextResponse.json({ received: true });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ received: true });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const order = await prisma.order.create({
      data: {
        productId,
        customerEmail: session.customer_details?.email ?? "",
        customerName: session.customer_details?.name,
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency?.toUpperCase() ?? "BRL",
        status: "PAID",
        expiresAt,
      },
    });

    const downloadUrl = absoluteUrl(`/download/${order.downloadToken}`);

    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Seu produto está pronto! — ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Compra confirmada! 🎉</h2>
          <p>Olá${order.customerName ? `, ${order.customerName}` : ""}!</p>
          <p>Obrigado pela sua compra de <strong>${product.name}</strong>.</p>
          <p>Clique no botão abaixo para baixar seu produto:</p>
          <a href="${downloadUrl}" style="display: inline-block; background: #f59e0b; color: #1c1917; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            📥 Baixar ${product.name}
          </a>
          <p style="color: #666; font-size: 14px;">
            ⚠️ Este link é válido por 7 dias e pode ser usado até ${order.maxDownloads} vezes.
          </p>
          <p>Boas aventuras! 🌍</p>
          <p>— Equipe Rolê Família</p>
        </div>
      `,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "DELIVERED" },
    });
  }

  return NextResponse.json({ received: true });
}
