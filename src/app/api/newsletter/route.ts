import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { absoluteUrl } from "@/lib/utils";
import { z } from "zod";
import { randomBytes } from "crypto";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const { email, name, source } = parsed.data;

  // Check if already subscribed
  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing?.confirmedAt) {
    return NextResponse.json({ message: "Já inscrito" });
  }

  const confirmToken = randomBytes(32).toString("hex");

  await prisma.subscriber.upsert({
    where: { email },
    update: { confirmToken, name, source },
    create: { email, name, source, confirmToken },
  });

  const confirmUrl = absoluteUrl(`/newsletter/confirmar?token=${confirmToken}`);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Confirme sua inscrição — Rolê Família",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Quase lá, ${name ?? "viajante"}! ✈️</h2>
        <p>Clique no botão abaixo para confirmar sua inscrição e receber as melhores dicas de viagem da Rolê Família:</p>
        <a href="${confirmUrl}" style="display: inline-block; background: #f59e0b; color: #1c1917; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Confirmar inscrição
        </a>
        <p style="color: #666; font-size: 14px;">Se você não solicitou isso, pode ignorar este email.</p>
      </div>
    `,
  });

  return NextResponse.json({ message: "Email de confirmação enviado!" });
}
