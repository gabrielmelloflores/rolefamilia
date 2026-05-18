"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    type: "EBOOK",
    price: 0,
    currency: "BRL",
    coverImage: "",
    fileUrl: "",
    fileName: "",
    isPublished: false,
    isFeatured: false,
  });

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "products");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    set("fileUrl", url);
    set("fileName", file.name);
    toast.success("Arquivo enviado!");
  }

  async function handleSave() {
    if (!form.name || !form.coverImage || !form.price) {
      toast.error("Preencha nome, imagem e preço");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Produto criado no Stripe e banco!");
      router.push("/admin/produtos");
    } catch {
      toast.error("Erro ao criar produto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Novo Produto Digital</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
          <Save className="h-4 w-4 mr-2" /> Salvar e criar no Stripe
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label>Nome *</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Guia Completo de Bali" />
        </div>
        <div className="col-span-2">
          <SlugInput titleValue={form.name} value={form.slug} onChange={(s) => set("slug", s)} />
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Descrição *</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Descreva o produto" />
        </div>
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EBOOK">E-book</SelectItem>
              <SelectItem value="MAPA">Mapa</SelectItem>
              <SelectItem value="BUNDLE">Bundle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Preço (R$) *</Label>
          <Input type="number" min={0} step={0.01} value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imagem de capa *</Label>
        <ImageUploader value={form.coverImage} onChange={(url) => set("coverImage", url)} />
      </div>

      <div className="space-y-2">
        <Label>Arquivo do produto (PDF, ZIP, etc)</Label>
        <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
          <input
            type="file"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
          />
          <div className="text-sm text-stone-500">
            {form.fileName ? (
              <span className="text-green-600 font-medium">✓ {form.fileName}</span>
            ) : (
              "Clique para enviar o arquivo do produto"
            )}
          </div>
        </label>
      </div>

      <StatusToggle published={form.isPublished} onToggle={(p) => set("isPublished", p)} />
    </div>
  );
}
