import { prisma } from "@/lib/prisma";
import { PedidosTable } from "./PedidosTable";

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Pedidos</h2>
        <p className="text-sm text-stone-500">{orders.length} pedidos no total</p>
      </div>
      <PedidosTable orders={orders} />
    </div>
  );
}
