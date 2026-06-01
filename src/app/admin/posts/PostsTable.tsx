"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: Date;
};

export function PostsTable({ posts }: { posts: Post[] }) {
  return (
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
            <Badge variant="outline" className={
              value === "PUBLISHED" ? "bg-green-50 text-green-700 border-green-200"
              : value === "DRAFT" ? "bg-stone-50 text-stone-600 border-stone-200"
              : "bg-red-50 text-red-600 border-red-200"
            }>
              {value === "PUBLISHED" ? "Publicado" : value === "DRAFT" ? "Rascunho" : "Arquivado"}
            </Badge>
          ),
        },
        {
          key: "views",
          header: "Views",
          render: (value) => <span className="text-stone-600">{Number(value).toLocaleString("pt-BR")}</span>,
        },
        {
          key: "createdAt",
          header: "Criado em",
          render: (value) => <span className="text-stone-500 text-sm">{formatDate(value as Date, { month: "short" })}</span>,
        },
      ]}
      actions={[
        { label: "Editar", onClick: (row) => { window.location.href = `/admin/posts/${row.id}`; } },
        { label: "Ver no site", onClick: (row) => { window.open(`/blog/${row.slug}`, "_blank"); } },
      ]}
    />
  );
}
