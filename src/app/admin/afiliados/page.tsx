import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AfiliadosTable } from "./AfiliadosTable";

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
      <AfiliadosTable links={links} />
    </div>
  );
}
