"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/destinos": "Destinos",
  "/admin/roteiros": "Roteiros",
  "/admin/produtos": "Produtos",
  "/admin/pedidos": "Pedidos",
  "/admin/afiliados": "Links Afiliados",
  "/admin/newsletter": "Newsletter",
  "/admin/youtube": "YouTube",
  "/admin/categorias": "Categorias & Tags",
  "/admin/configuracoes": "Configurações",
};

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname === path) return title;
    }
    if (pathname.includes("/novo")) return "Novo";
    if (pathname.match(/\/admin\/\w+\/[^/]+$/)) return "Editar";
    return "Admin";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar
          onMenuClick={() => setSidebarOpen(true)}
          title={getTitle()}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
