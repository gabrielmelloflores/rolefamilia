"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "Pendente",  className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  PAID:      { label: "Pago",      className: "bg-blue-50 text-blue-700 border-blue-200" },
  DELIVERED: { label: "Entregue",  className: "bg-green-50 text-green-700 border-green-200" },
  EXPIRED:   { label: "Expirado",  className: "bg-stone-50 text-stone-600 border-stone-200" },
  REFUNDED:  { label: "Reembolso", className: "bg-red-50 text-red-700 border-red-200" },
};

type Order = {
  id: string;
  customerEmail: string;
  customerName: string | null;
  amount: unknown;
  status: string;
  downloadCount: number;
  maxDownloads: number;
  createdAt: Date;
  product: { name: string };
};

export function PedidosTable({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      data={orders}
      searchKeys={["customerEmail", "customerName"]}
      columns={[
        {
          key: "customerEmail",
          header: "Cliente",
          render: (_, row) => (
            <div>
              <p className="font-medium text-sm">{row.customerName ?? "—"}</p>
              <p className="text-xs text-stone-400">{row.customerEmail}</p>
            </div>
          ),
        },
        {
          key: "product",
          header: "Produto",
          render: (_, row) => <span className="text-sm">{row.product.name}</span>,
        },
        {
          key: "amount",
          header: "Valor",
          render: (value) => <span className="font-medium">{formatCurrency(Number(value))}</span>,
        },
        {
          key: "status",
          header: "Status",
          render: (value) => {
            const s = STATUS_STYLES[value as string] ?? STATUS_STYLES.PENDING;
            return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
          },
        },
        {
          key: "downloadCount",
          header: "Downloads",
          render: (_, row) => `${row.downloadCount}/${row.maxDownloads}`,
        },
        {
          key: "createdAt",
          header: "Data",
          render: (value) => <span className="text-xs text-stone-400">{formatDate(value as Date)}</span>,
        },
      ]}
      actions={[
        { label: "Ver detalhes", onClick: (row) => { window.location.href = `/admin/pedidos/${row.id}`; } },
      ]}
    />
  );
}
