import Link from "next/link";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="h-16 border-b border-stone-100 flex items-center px-6">
        <Link href="/" className="font-bold text-stone-900 text-lg">
          Rolê Família
        </Link>
      </header>
      <main>{children}</main>
    </>
  );
}
