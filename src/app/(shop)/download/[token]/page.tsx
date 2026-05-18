import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DownloadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  });

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-16 w-16 text-red-400" />
        <h1 className="text-2xl font-bold text-stone-900">Link inválido</h1>
        <p className="text-stone-500">Este link de download não existe ou já foi removido.</p>
        <Link href="/loja" className="text-amber-600 hover:underline">Ir para a loja</Link>
      </div>
    );
  }

  const isExpired = order.expiresAt < new Date();
  const maxedOut = order.downloadCount >= order.maxDownloads;

  if (order.status === "PENDING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-16 w-16 text-yellow-400" />
        <h1 className="text-2xl font-bold text-stone-900">Pagamento pendente</h1>
        <p className="text-stone-500">Seu pagamento ainda está sendo processado. Tente novamente em instantes.</p>
      </div>
    );
  }

  if (isExpired || maxedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-16 w-16 text-red-400" />
        <h1 className="text-2xl font-bold text-stone-900">
          {isExpired ? "Link expirado" : "Limite de downloads atingido"}
        </h1>
        <p className="text-stone-500">
          {isExpired
            ? "Este link expirou. Entre em contato conosco para renovar seu acesso."
            : `Você atingiu o limite de ${order.maxDownloads} downloads. Entre em contato para ajuda.`}
        </p>
        <Link href="/contato" className="text-amber-600 hover:underline">Entrar em contato</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-20">
      <div className="max-w-md w-full mx-auto px-4 space-y-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />

        <div>
          <h1 className="font-heading text-3xl text-stone-900 font-bold mb-2">Seu download está pronto!</h1>
          <p className="text-stone-500">Clique no botão abaixo para baixar seu produto.</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
          <div className="flex gap-4 items-center text-left">
            <div className="relative h-16 w-14 rounded-xl overflow-hidden flex-none">
              <Image src={order.product.coverImage} alt={order.product.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">{order.product.name}</p>
              <p className="text-xs text-stone-400 mt-1">
                {order.downloadCount} de {order.maxDownloads} downloads utilizados
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Link expira em: {formatDate(order.expiresAt)}
          </p>
        </div>

        <a
          href={`/api/download/${token}`}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors text-lg"
        >
          <Download className="h-5 w-5" /> Baixar agora
        </a>

        <p className="text-xs text-stone-400">
          Mantenha este link em local seguro. Você tem {order.maxDownloads - order.downloadCount} download(s) restante(s).
        </p>
      </div>
    </div>
  );
}
