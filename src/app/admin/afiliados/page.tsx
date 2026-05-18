import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { AFFILIATE_PROVIDER_LABELS } from "@/lib/constants";

export default async function AdminAfiliadosPage() {
  const links = await prisma.affiliateLink.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Links de Afiliados</h2>
          <p className="text-sm text-stone-500">{links.length} links</p>
        </div>
        <Link href="/admin/afiliados/novo" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 h-8 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
          <Plus className="h-4 w-4" /> Novo link
        </Link>
      </div>

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
    </div>
  );
}
