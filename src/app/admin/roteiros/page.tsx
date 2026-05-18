import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DIFFICULTY_LABELS } from "@/lib/constants";

export default async function AdminRoteirosPage() {
  const itineraries = await prisma.itinerary.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      destination: { select: { name: true } },
      _count: { select: { days: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Roteiros</h2>
          <p className="text-sm text-stone-500">{itineraries.length} roteiros</p>
        </div>
        <Link href="/admin/roteiros/novo" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 h-8 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
          <Plus className="h-4 w-4" /> Novo roteiro
        </Link>
      </div>

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
    </div>
  );
}
