"use client";

import { useState } from "react";
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
import { Save, Eye } from "lucide-react";

export default function NovoPostPage() {
  const router = useRouter();
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

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(publish = false) {
    if (!form.title || !form.excerpt || !form.coverImage) {
      toast.error("Preencha título, resumo e imagem de capa");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: publish ? "PUBLISHED" : form.status,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      const post = await res.json();
      toast.success(publish ? "Post publicado!" : "Rascunho salvo!");
      router.push(`/admin/posts/${post.id}`);
    } catch {
      toast.error("Erro ao salvar post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">Novo Post</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar rascunho
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 text-stone-900"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Título do post"
              className="text-lg font-semibold"
            />
          </div>

          <SlugInput
            titleValue={form.title}
            value={form.slug}
            onChange={(slug) => set("slug", slug)}
          />

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo * (aparece nos cards e SEO)</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Breve descrição do post (até 200 palavras)"
              rows={3}
              maxLength={500}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo do post *</Label>
            <PostEditor
              value={form.content}
              onChange={(content) => set("content", content)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Imagem de capa *</Label>
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
