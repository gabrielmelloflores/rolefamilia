import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "Pendente",  className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  PAID:      { label: "Pago",      className: "bg-blue-50 text-blue-700 border-blue-200" },
  DELIVERED: { label: "Entregue",  className: "bg-green-50 text-green-700 border-green-200" },
  EXPIRED:   { label: "Expirado",  className: "bg-stone-50 text-stone-600 border-stone-200" },
  REFUNDED:  { label: "Reembolso", className: "bg-red-50 text-red-700 border-red-200" },
};

export default async function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!order) notFound();

  const s = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Pedido #{order.id.slice(-8).toUpperCase()}</h2>
        <Badge variant="outline" className={s.className}>{s.label}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 rounded-xl border border-stone-200 p-4 space-y-3">
          <h3 className="font-semibold text-stone-700">Dados do cliente</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-stone-400">Nome</p>
              <p className="font-medium">{order.customerName ?? "—"}</p>
            </div>
            <div>
              <p className="text-stone-400">Email</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-stone-200 p-4 space-y-3">
          <h3 className="font-semibold text-stone-700">Produto</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-stone-400">Nome</p>
              <p className="font-medium">{order.product.name}</p>
            </div>
            <div>
              <p className="text-stone-400">Valor pago</p>
              <p className="font-medium text-lg">{formatCurrency(Number(order.amount))}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-stone-200 p-4 space-y-3">
          <h3 className="font-semibold text-stone-700">Download</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-stone-400">Downloads realizados</p>
              <p className="font-medium">{order.downloadCount} / {order.maxDownloads}</p>
            </div>
            <div>
              <p className="text-stone-400">Expira em</p>
              <p className="font-medium">{formatDate(order.expiresAt)}</p>
            </div>
            <div>
              <p className="text-stone-400">Token</p>
              <p className="font-mono text-xs break-all">{order.downloadToken}</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-stone-200 p-4 space-y-3">
          <h3 className="font-semibold text-stone-700">Stripe</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-stone-400">Session ID</p>
              <p className="font-mono text-xs break-all">{order.stripeSessionId}</p>
            </div>
            <div>
              <p className="text-stone-400">Payment ID</p>
              <p className="font-mono text-xs break-all">{order.stripePaymentId ?? "—"}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-stone-400 text-sm">Criado em</p>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-stone-400 text-sm">Atualizado em</p>
          <p className="font-medium">{formatDate(order.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
