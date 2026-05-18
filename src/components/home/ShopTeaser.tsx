import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  price: unknown;
  type: string;
}

export function ShopTeaser({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">Loja digital</p>
          <h2 className="font-heading text-3xl sm:text-4xl text-stone-900 mb-4">Leve nossa experiência com você</h2>
          <p className="text-stone-500 max-w-xl mx-auto">E-books, mapas e guias criados por nós para ajudar você a planejar a viagem perfeita.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/loja/${product.slug}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.coverImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-amber-500 text-stone-900 text-xs font-bold rounded-full uppercase">
                      {product.type === "EBOOK" ? "E-book" : product.type === "MAPA" ? "Mapa" : "Bundle"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900 line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-amber-600">{formatCurrency(Number(product.price))}</p>
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <ShoppingBag className="h-3.5 w-3.5" /> Comprar
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-amber-500 text-amber-600 font-bold hover:bg-amber-500 hover:text-stone-900 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" /> Ver toda a loja
          </Link>
        </div>
      </div>
    </section>
  );
}
