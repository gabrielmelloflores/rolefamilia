"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { AFFILIATE_PROVIDER_LABELS } from "@/lib/constants";
import type { AffiliateLink } from "@prisma/client";

export function AfiliadosTable({ links }: { links: AffiliateLink[] }) {
  return (
    <DataTable
      data={links}
      columns={[
        {
          key: "name",
          header: "Nome",
          render: (_, row) => (
            <div>
              <p className="font-medium">{row.name}</p>
              <p className="text-xs text-stone-400 truncate max-w-xs">{row.url}</p>
            </div>
          ),
        },
        {
          key: "provider",
          header: "Provedor",
          render: (value) => {
            const p = AFFILIATE_PROVIDER_LABELS[value as keyof typeof AFFILIATE_PROVIDER_LABELS];
            return <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.color}`}>{p.label}</span>;
          },
        },
        {
          key: "clicks",
          header: "Cliques",
          render: (value) => <span className="font-semibold">{value as number}</span>,
        },
        {
          key: "isActive",
          header: "Status",
          render: (value) => (
            <Badge variant="outline" className={value ? "bg-green-50 text-green-700 border-green-200" : "bg-stone-50 text-stone-600"}>
              {value ? "Ativo" : "Inativo"}
            </Badge>
          ),
        },
      ]}
      actions={[
        { label: "Editar", onClick: (row) => { window.location.href = `/admin/afiliados/${row.id}`; } },
      ]}
    />
  );
}
