"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "@/lib/constants";

type Itinerary = {
  id: string;
  title: string;
  difficulty: string;
  duration: number;
  priceFrom: unknown;
  isPublished: boolean;
  destination: { name: string } | null;
  _count: { days: number };
};

export function RoteirosTable({ itineraries }: { itineraries: Itinerary[] }) {
  return (
    <DataTable
      data={itineraries}
      columns={[
        {
          key: "title",
          header: "Título",
          render: (_, row) => (
            <div>
              <p className="font-medium">{row.title}</p>
              <p className="text-xs text-stone-400">{row.destination?.name ?? "Sem destino"}</p>
            </div>
          ),
        },
        {
          key: "difficulty",
          header: "Dificuldade",
          render: (value) => {
            const d = DIFFICULTY_LABELS[value as keyof typeof DIFFICULTY_LABELS];
            return <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.color}`}>{d.label}</span>;
          },
        },
        {
          key: "duration",
          header: "Duração",
          render: (_, row) => `${row.duration} dias / ${row._count.days} configurados`,
        },
        {
          key: "priceFrom",
          header: "A partir de",
          render: (value) => formatCurrency(Number(value)),
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
      ]}
      actions={[
        { label: "Editar", onClick: (row) => { window.location.href = `/admin/roteiros/${row.id}`; } },
      ]}
    />
  );
}
