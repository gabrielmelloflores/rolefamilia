import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700 transition-colors">Início</Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            {item.href ? (
              <Link href={item.href} className="hover:text-stone-700 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-stone-700 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
