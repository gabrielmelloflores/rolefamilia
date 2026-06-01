import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DestinosTable } from "./DestinosTable";

export default async function AdminDestinosPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true, itineraries: true } } },
  });

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
      <DestinosTable destinations={destinations} />
    </div>
  );
}
