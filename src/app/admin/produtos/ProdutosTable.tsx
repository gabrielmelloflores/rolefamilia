"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";

type Product = {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: unknown;
  isPublished: boolean;
  _count: { orders: number };
};

export function ProdutosTable({ products }: { products: Product[] }) {
  return (
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
  );
}
