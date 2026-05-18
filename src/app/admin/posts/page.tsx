import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: { include: { category: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Posts</h2>
          <p className="text-sm text-stone-500">{posts.length} posts no total</p>
        </div>
        <Link href="/admin/posts/novo" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 h-8 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
          <Plus className="h-4 w-4" /> Novo post
        </Link>
      </div>

      <DataTable
        data={posts}
        columns={[
          {
            key: "title",
            header: "Título",
            render: (_, row) => (
              <div>
                <p className="font-medium text-stone-900 line-clamp-1">{row.title}</p>
                <p className="text-xs text-stone-400 font-mono">{row.slug}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (value) => (
              <Badge
                variant="outline"
                className={
                  value === "PUBLISHED"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : value === "DRAFT"
                    ? "bg-stone-50 text-stone-600 border-stone-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }
              >
                {value === "PUBLISHED" ? "Publicado" : value === "DRAFT" ? "Rascunho" : "Arquivado"}
              </Badge>
            ),
          },
          {
            key: "views",
            header: "Views",
            render: (value) => (
              <span className="text-stone-600">{Number(value).toLocaleString("pt-BR")}</span>
            ),
          },
          {
            key: "createdAt",
            header: "Criado em",
            render: (value) => (
              <span className="text-stone-500 text-sm">
                {formatDate(value as Date, { month: "short" })}
              </span>
            ),
          },
        ]}
        actions={[
          {
            label: "Editar",
            onClick: (row) => {
              window.location.href = `/admin/posts/${row.id}`;
            },
          },
          {
            label: "Ver no site",
            onClick: (row) => {
              window.open(`/blog/${row.slug}`, "_blank");
            },
          },
        ]}
      />
    </div>
  );
}
