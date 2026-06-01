import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RoteirosTable } from "./RoteirosTable";

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
      <RoteirosTable itineraries={itineraries} />
    </div>
  );
}
