"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { CONTINENTS } from "@/lib/constants";

type Destination = {
  id: string;
  name: string;
  country: string;
  continent: string;
  isPublished: boolean;
  _count: { posts: number; itineraries: number };
};

export function DestinosTable({ destinations }: { destinations: Destination[] }) {
  const getContinentLabel = (c: string) => CONTINENTS.find((x) => x.enum === c)?.name ?? c;

  return (
    <DataTable
      data={destinations}
      columns={[
        {
          key: "name",
          header: "Destino",
          render: (_, row) => (
            <div>
              <p className="font-medium">{row.name}</p>
              <p className="text-xs text-stone-400">{row.country}</p>
            </div>
          ),
        },
        {
          key: "continent",
          header: "Continente",
          render: (value) => getContinentLabel(value as string),
        },
        {
          key: "isPublished",
          header: "Status",
          render: (value) => (
            <Badge variant="outline" className={value ? "bg-green-50 text-green-700 border-green-200" : "bg-stone-50 text-stone-600 border-stone-200"}>
              {value ? "Publicado" : "Rascunho"}
            </Badge>
          ),
        },
        {
          key: "_count",
          header: "Posts / Roteiros",
          render: (_, row) => (
            <span className="text-stone-500 text-sm">{row._count.posts} posts · {row._count.itineraries} roteiros</span>
          ),
        },
      ]}
      actions={[
        { label: "Editar", onClick: (row) => { window.location.href = `/admin/destinos/${row.id}`; } },
      ]}
    />
  );
}
