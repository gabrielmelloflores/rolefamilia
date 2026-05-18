import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { confirmToken: token },
  });

  if (!subscriber) {
    return NextResponse.redirect(new URL("/newsletter/obrigado?status=invalid", req.url));
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { confirmedAt: new Date(), confirmToken: null },
  });

  // Send welcome email
  await resend.emails.send({
    from: FROM_EMAIL,
    to: subscriber.email,
    subject: "Bem-vindo à família! 🌍 — Rolê Família",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Você faz parte da família agora! ✈️</h2>
        <p>Olá${subscriber.name ? `, ${subscriber.name}` : ""}!</p>
        <p>Sua inscrição foi confirmada. A partir de agora você vai receber:</p>
        <ul>
          <li>✅ Roteiros detalhados de destinos incríveis</li>
          <li>✅ Dicas exclusivas que só a nossa família sabe</li>
          <li>✅ Ofertas especiais em produtos digitais</li>
          <li>✅ Bastidores do canal do YouTube</li>
        </ul>
        <p>Bora explorar o mundo juntos! 🌎</p>
        <p>— Equipe Rolê Família</p>
      </div>
    `,
  });

  return NextResponse.redirect(new URL("/newsletter/obrigado", req.url));
}
