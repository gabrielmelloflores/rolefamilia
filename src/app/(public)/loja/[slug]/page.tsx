import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BuyButton } from "@/components/shop/BuyButton";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatCurrency } from "@/lib/utils";
import { Shield, Download, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p) return {};
  return {
    title: `${p.name} — Loja Rolê Família`,
    description: p.seoDesc ?? p.description,
    openGraph: { images: [p.coverImage] },
  };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
  });

  if (!product) notFound();

  const typeLabel = product.type === "EBOOK" ? "E-book" : product.type === "MAPA" ? "Mapa" : "Bundle";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.coverImage,
    offers: {
      "@type": "Offer",
      price: Number(product.price).toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Breadcrumb items={[{ label: "Loja", href: "/loja" }, { label: product.name }]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl rotate-1 group-hover:rotate-0 transition-transform duration-500">
                <Image src={product.coverImage} alt={product.name} fill priority className="object-cover" />
              </div>
              <div className="absolute -top-3 -right-3">
                <span className="px-4 py-2 bg-amber-500 text-stone-900 text-sm font-bold rounded-full shadow-lg">
                  {typeLabel}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-2">{typeLabel} Digital</p>
                <h1 className="font-heading text-4xl text-stone-900 leading-tight mb-4">{product.name}</h1>
                <p className="text-stone-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-amber-600">{formatCurrency(Number(product.price))}</p>
                <p className="text-stone-400 text-sm">Pagamento único · Entrega imediata</p>
              </div>

              <BuyButton productId={product.id} productName={product.name} />

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: <Download className="h-5 w-5" />, label: "Download instantâneo" },
                  { icon: <Shield className="h-5 w-5" />, label: "Compra segura" },
                  { icon: <BookOpen className="h-5 w-5" />, label: "Acesso para sempre" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-stone-50 text-center">
                    <span className="text-teal-600">{item.icon}</span>
                    <span className="text-xs text-stone-500 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
