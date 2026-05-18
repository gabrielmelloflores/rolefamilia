"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusToggle } from "@/components/admin/StatusToggle";
import { CONTINENTS, BRAZIL_REGIONS } from "@/lib/constants";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";

export default function EditDestinoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    country: "",
    countryCode: "",
    continent: "",
    region: "",
    coverImage: "",
    description: "",
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    fetch(`/api/destinos/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          country: data.country ?? "",
          countryCode: data.countryCode ?? "",
          continent: data.continent ?? "",
          region: data.region ?? "",
          coverImage: data.coverImage ?? "",
          description: data.description ?? "",
          isPublished: data.isPublished ?? false,
          isFeatured: data.isFeatured ?? false,
        });
        setLoading(false);
      })
      .catch(() => { toast.error("Erro ao carregar destino"); setLoading(false); });
  }, [id]);

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.country || !form.continent || !form.coverImage) {
      toast.error("Preencha nome, país, continente e imagem");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/destinos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Destino atualizado!");
    } catch {
      toast.error("Erro ao salvar destino");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir este destino? Esta ação não pode ser desfeita.")) return;
    try {
      const res = await fetch(`/api/destinos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Destino excluído");
      router.push("/admin/destinos");
    } catch {
      toast.error("Erro ao excluir destino");
    }
  }

  if (loading) return <div className="text-stone-400 text-sm">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Editar Destino</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" /> Excluir
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
            <Save className="h-4 w-4 mr-2" /> Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label>Nome *</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Paris" />
        </div>

        <div className="col-span-2">
          <SlugInput titleValue={form.name} value={form.slug} onChange={(s) => set("slug", s)} />
        </div>

        <div className="space-y-2">
          <Label>País *</Label>
          <Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Ex: França" />
        </div>

        <div className="space-y-2">
          <Label>Código do País (ISO)</Label>
          <Input value={form.countryCode} onChange={(e) => set("countryCode", e.target.value.toUpperCase())} placeholder="Ex: FR" maxLength={2} />
        </div>

        <div className="space-y-2">
          <Label>Continente *</Label>
          <Select value={form.continent} onValueChange={(v) => set("continent", v)}>
            <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              {CONTINENTS.map((c) => (
                <SelectItem key={c.enum} value={c.enum}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {form.continent === "AMERICA_DO_SUL" && (
          <div className="space-y-2">
            <Label>Região (Brasil)</Label>
            <Select value={form.region} onValueChange={(v) => set("region", v)}>
              <SelectTrigger><SelectValue placeholder="Região" /></SelectTrigger>
              <SelectContent>
                {BRAZIL_REGIONS.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="col-span-2 space-y-2">
          <Label>Descrição</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Breve descrição do destino" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imagem de capa *</Label>
        <ImageUploader value={form.coverImage} onChange={(url) => set("coverImage", url)} />
      </div>

      <StatusToggle published={form.isPublished} onToggle={(p) => set("isPublished", p)} />
    </div>
  );
}
