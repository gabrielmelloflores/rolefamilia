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
import { CONTINENTS, BRAZIL_REGIONS } from "@/lib/constants";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function NovoDestinoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
      const res = await fetch("/api/destinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Destino criado!");
      router.push("/admin/destinos");
    } catch {
      toast.error("Erro ao salvar destino");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Novo Destino</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
          <Save className="h-4 w-4 mr-2" /> Salvar
        </Button>
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
          <Select onValueChange={(v) => set("continent", v)}>
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
            <Select onValueChange={(v) => set("region", v)}>
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
