import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckoutSucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400">Sessão não encontrada.</p>
      </div>
    );
  }

  let order = await prisma.order.findFirst({
    where: { stripeSessionId: session_id },
    include: { product: true },
  });

  if (!order) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        await new Promise((r) => setTimeout(r, 2000));
        order = await prisma.order.findFirst({
          where: { stripeSessionId: session_id },
          include: { product: true },
        });
      }
    } catch {
      // session retrieval failed
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600 text-lg">Processando seu pedido...</p>
        <p className="text-stone-400 text-sm">Isso pode levar alguns segundos. Verifique seu email em instantes.</p>
        <Link href="/" className="mt-4 text-amber-600 hover:underline">Voltar ao início</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-20">
      <div className="max-w-md w-full mx-auto px-4 space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>

        <div>
          <h1 className="font-heading text-3xl text-stone-900 font-bold mb-2">Compra realizada!</h1>
          <p className="text-stone-500">Obrigado pela confiança, {order.customerName ?? order.customerEmail}! ❤️</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6 text-left space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative h-16 w-14 rounded-xl overflow-hidden flex-none">
              <Image src={order.product.coverImage} alt={order.product.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">{order.product.name}</p>
              <p className="text-amber-600 font-bold">{formatCurrency(Number(order.amount))}</p>
            </div>
          </div>
          <p className="text-sm text-stone-500">
            Um email com o link de download foi enviado para <strong>{order.customerEmail}</strong>.
          </p>
        </div>

        {order.status === "DELIVERED" && (
          <Link
            href={`/download/${order.downloadToken}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors"
          >
            <Download className="h-5 w-5" /> Baixar agora
          </Link>
        )}

        <Link href="/loja" className="block text-sm text-stone-400 hover:text-stone-600 transition-colors">
          Continuar na loja →
        </Link>
      </div>
    </div>
  );
}
