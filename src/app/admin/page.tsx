import { prisma } from "@/lib/prisma";
import { FileText, MapPin, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboard() {
  const [postCount, destinationCount, orderStats, subscriberCount] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.destination.count({ where: { isPublished: true } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "DELIVERED"] } },
      _count: true,
      _sum: { amount: true },
    }),
    prisma.subscriber.count({ where: { confirmedAt: { not: null } } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  const stats = [
    {
      title: "Posts publicados",
      value: postCount,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Destinos",
      value: destinationCount,
      icon: MapPin,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Pedidos",
      value: orderStats._count,
      icon: ShoppingCart,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Assinantes",
      value: subscriberCount,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500">{title}</p>
                  <p className="text-3xl font-bold text-stone-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-500">
              {formatCurrency(Number(orderStats._sum.amount ?? 0))}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              de {orderStats._count} pedidos pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-stone-400 text-sm">Nenhum pedido ainda</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-900 truncate max-w-[180px]">
                        {order.product.name}
                      </p>
                      <p className="text-xs text-stone-400">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-stone-900">
                        {formatCurrency(Number(order.amount))}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status === "DELIVERED" ? "Entregue" : "Pago"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
