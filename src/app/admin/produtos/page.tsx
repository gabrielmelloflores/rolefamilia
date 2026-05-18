import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Produtos Digitais</h2>
          <p className="text-sm text-stone-500">{products.length} produtos</p>
        </div>
        <Link href="/admin/produtos/novo" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 h-8 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>

      <DataTable
        data={products}
        columns={[
          {
            key: "name",
            header: "Produto",
            render: (_, row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-stone-400 font-mono">{row.slug}</p>
              </div>
            ),
          },
          {
            key: "type",
            header: "Tipo",
            render: (value) => {
              const t = PRODUCT_TYPE_LABELS[value as keyof typeof PRODUCT_TYPE_LABELS];
              return <span className={`text-xs px-2 py-1 rounded-full ${t.color}`}>{t.label}</span>;
            },
          },
          { key: "price", header: "Preço", render: (value) => formatCurrency(Number(value)) },
          { key: "_count", header: "Vendas", render: (_, row) => `${row._count.orders} pedidos` },
          {
            key: "isPublished",
            header: "Status",
            render: (value) => (
              <Badge variant="outline" className={value ? "bg-green-50 text-green-700 border-green-200" : "bg-stone-50 text-stone-600"}>
                {value ? "Publicado" : "Rascunho"}
              </Badge>
            ),
          },
        ]}
        actions={[
          { label: "Editar", onClick: (row) => { window.location.href = `/admin/produtos/${row.id}`; } },
        ]}
      />
    </div>
  );
}
