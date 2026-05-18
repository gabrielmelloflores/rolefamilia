"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronDown } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { BRAZIL_REGIONS, CONTINENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destinosOpen, setDestinosOpen] = useState(false);
  const pathname = usePathname();

  const isHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = cn(
    "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
    isHero && !scrolled
      ? "bg-transparent"
      : "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100"
  );

  const linkClass = cn(
    "text-sm font-medium transition-colors",
    isHero && !scrolled
      ? "text-white/90 hover:text-white"
      : "text-stone-600 hover:text-stone-900"
  );

  return (
    <>
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className={cn("text-xl font-bold tracking-tight", isHero && !scrolled ? "text-white" : "text-stone-900")}>
            Rolê Família
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setDestinosOpen(true)}
              onMouseLeave={() => setDestinosOpen(false)}
            >
              <button className={cn(linkClass, "flex items-center gap-1")}>
                Destinos <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", destinosOpen && "rotate-180")} />
              </button>

              {destinosOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] bg-white rounded-2xl shadow-2xl border border-stone-100 p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">🇧🇷 Brasil</p>
                    <div className="space-y-1">
                      <Link href="/destinos/brasil" className="block text-sm text-stone-600 hover:text-amber-600 font-medium py-1">
                        Todos os estados
                      </Link>
                      {BRAZIL_REGIONS.map((r) => (
                        <Link key={r.slug} href={`/destinos/brasil/${r.slug}`} className="block text-sm text-stone-600 hover:text-amber-600 py-1">
                          {r.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">🌍 Mundo</p>
                    <div className="space-y-1">
                      <Link href="/destinos/mundo" className="block text-sm text-stone-600 hover:text-amber-600 font-medium py-1">
                        Todos os destinos
                      </Link>
                      {CONTINENTS.filter((c) => c.enum !== "AMERICA_DO_SUL").map((c) => (
                        <Link key={c.enum} href={`/destinos/mundo/${c.slug}`} className="block text-sm text-stone-600 hover:text-amber-600 py-1">
                          {c.icon} {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className={linkClass}>Blog</Link>
            <Link href="/roteiros" className={linkClass}>Roteiros</Link>
            <Link href="/loja" className={linkClass}>Loja</Link>

            <Link href="/busca" className={cn(linkClass, "p-2 rounded-full hover:bg-stone-100")}>
              <Search className="h-4 w-4" />
            </Link>

            <a
              href="https://youtube.com/@rolefamilia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              ▶ YouTube
            </a>
          </div>

          <button
            className={cn("md:hidden p-2 rounded-lg", isHero && !scrolled ? "text-white" : "text-stone-700")}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
