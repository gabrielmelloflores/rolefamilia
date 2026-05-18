import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { CONTINENTS } from "@/lib/constants";

export default async function AdminDestinosPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true, itineraries: true } } },
  });

  const getContinentLabel = (c: string) =>
    CONTINENTS.find((x) => x.enum === c)?.name ?? c;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Destinos</h2>
          <p className="text-sm text-stone-500">{destinations.length} destinos</p>
        </div>
        <Link href="/admin/destinos/novo" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 h-8 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
          <Plus className="h-4 w-4" /> Novo destino
        </Link>
      </div>

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
              <Badge
                variant="outline"
                className={
                  value
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-stone-50 text-stone-600 border-stone-200"
                }
              >
                {value ? "Publicado" : "Rascunho"}
              </Badge>
            ),
          },
          {
            key: "_count",
            header: "Posts / Roteiros",
            render: (_, row) => (
              <span className="text-stone-500 text-sm">
                {row._count.posts} posts · {row._count.itineraries} roteiros
              </span>
            ),
          },
        ]}
        actions={[
          {
            label: "Editar",
            onClick: (row) => { window.location.href = `/admin/destinos/${row.id}`; },
          },
        ]}
      />
    </div>
  );
}
