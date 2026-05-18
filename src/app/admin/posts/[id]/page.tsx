"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PostEditor } from "@/components/admin/PostEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SlugInput } from "@/components/admin/SlugInput";
import { SeoFields } from "@/components/admin/SeoFields";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { toast } from "sonner";
import { Save, Eye, Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: {} as Record<string, unknown>,
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    seoTitle: "",
    seoDesc: "",
  });

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((post) => {
        setForm({
          title: post.title ?? "",
          slug: post.slug ?? "",
          excerpt: post.excerpt ?? "",
          content: post.content ?? {},
          coverImage: post.coverImage ?? "",
          status: post.status ?? "DRAFT",
          seoTitle: post.seoTitle ?? "",
          seoDesc: post.seoDesc ?? "",
        });
        setLoading(false);
      });
  }, [id]);

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(publish = false) {
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(publish && { status: "PUBLISHED" }),
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      toast.success("Post salvo!");
      if (publish) router.refresh();
    } catch {
      toast.error("Erro ao salvar post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">Editar Post</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          {form.status !== "PUBLISHED" && (
            <Button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900"
            >
              <Eye className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.open(`/blog/${form.slug}`, "_blank")}
          >
            Ver no site
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="text-lg font-semibold"
            />
          </div>

          <SlugInput titleValue={form.title} value={form.slug} onChange={(s) => set("slug", s)} />

          <div className="space-y-2">
            <Label>Resumo *</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <PostEditor value={form.content} onChange={(c) => set("content", c)} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Imagem de capa</Label>
            <ImageUploader
              value={form.coverImage}
              onChange={(url) => set("coverImage", url)}
            />
          </div>

          <StatusToggle
            published={form.status === "PUBLISHED"}
            onToggle={(p) => set("status", p ? "PUBLISHED" : "DRAFT")}
          />

          <SeoFields
            seoTitle={form.seoTitle}
            seoDesc={form.seoDesc}
            onSeoTitleChange={(v) => set("seoTitle", v)}
            onSeoDescChange={(v) => set("seoDesc", v)}
          />
        </div>
      </div>
    </div>
  );
}
