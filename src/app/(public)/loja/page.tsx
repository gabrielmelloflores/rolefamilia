import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Loja Digital — Rolê Família",
  description: "E-books, mapas e guias de viagem criados pela nossa família para a sua.",
};

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;

  const where = {
    isPublished: true,
    ...(tipo ? { type: tipo as "EBOOK" | "MAPA" | "BUNDLE" } : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.product.count({ where: { isPublished: true } }),
  ]);

  const types = [
    { value: "", label: "Todos" },
    { value: "EBOOK", label: "E-books" },
    { value: "MAPA", label: "Mapas" },
    { value: "BUNDLE", label: "Bundles" },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <Breadcrumb items={[{ label: "Loja" }]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 mt-4 mb-2">Loja Digital</h1>
          <p className="text-stone-500 text-lg">{total} produtos para a sua próxima aventura</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          {types.map((t) => (
            <Link
              key={t.value}
              href={t.value ? `/loja?tipo=${t.value}` : "/loja"}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${(!tipo && !t.value) || tipo === t.value ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-400">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/loja/${product.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.coverImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-amber-500 text-stone-900 text-xs font-bold rounded-full">
                        {product.type === "EBOOK" ? "E-book" : product.type === "MAPA" ? "Mapa" : "Bundle"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-900 line-clamp-2 mb-3 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-amber-600">{formatCurrency(Number(product.price))}</p>
                      <span className="text-xs text-stone-400 flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" /> Comprar</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
