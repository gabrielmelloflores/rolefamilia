import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProdutosTable } from "./ProdutosTable";

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Produtos Digitais</h2>
          <p className="text-sm text-stone-500">{products.length} produtos</p>
        </div>
        <Link href="/admin/produtos/novo" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 h-8 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>
      <ProdutosTable products={products} />
    </div>
  );
}
