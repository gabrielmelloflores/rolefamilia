"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Route,
  ShoppingBag,
  ShoppingCart,
  Link2,
  Mail,
  PlayCircle,
  Tag,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/destinos", label: "Destinos", icon: MapPin },
  { href: "/admin/roteiros", label: "Roteiros", icon: Route },
  { href: "/admin/produtos", label: "Produtos", icon: ShoppingBag },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/afiliados", label: "Afiliados", icon: Link2 },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/youtube", label: "YouTube", icon: PlayCircle },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-stone-900 text-white z-50 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-700">
          <div>
            <div className="text-xl font-bold text-amber-400 font-heading">
              Rolê Família
            </div>
            <div className="text-xs text-stone-400">Painel Admin</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-stone-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-500 text-stone-900"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-700">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-stone-200 transition-colors"
            target="_blank"
          >
            Ver site →
          </Link>
        </div>
      </aside>
    </>
  );
}
