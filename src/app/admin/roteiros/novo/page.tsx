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
import { ItineraryDayEditor, DayData } from "@/components/admin/ItineraryDayEditor";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function NovoRoteiroPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [days, setDays] = useState<DayData[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    duration: 1,
    difficulty: "FACIL",
    priceFrom: 0,
    currency: "BRL",
    coverImage: "",
    isPublished: false,
    highlights: [] as string[],
    included: [] as string[],
    notIncluded: [] as string[],
  });

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.title || !form.summary || !form.coverImage) {
      toast.error("Preencha título, resumo e imagem");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/roteiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const itinerary = await res.json();

      if (days.length > 0) {
        await fetch(`/api/roteiros/${itinerary.id}/dias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days }),
        });
      }

      toast.success("Roteiro criado!");
      router.push("/admin/roteiros");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Novo Roteiro</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
          <Save className="h-4 w-4 mr-2" /> Salvar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label>Título *</Label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex: Portugal em 10 dias" />
        </div>

        <div className="col-span-2">
          <SlugInput titleValue={form.title} value={form.slug} onChange={(s) => set("slug", s)} />
        </div>

        <div className="col-span-2 space-y-2">
          <Label>Resumo *</Label>
          <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} rows={3} placeholder="Breve descrição do roteiro" />
        </div>

        <div className="space-y-2">
          <Label>Duração (dias)</Label>
          <Input type="number" min={1} value={form.duration} onChange={(e) => set("duration", Number(e.target.value))} />
        </div>

        <div className="space-y-2">
          <Label>Dificuldade</Label>
          <Select value={form.difficulty} onValueChange={(v) => set("difficulty", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FACIL">Fácil</SelectItem>
              <SelectItem value="MODERADO">Moderado</SelectItem>
              <SelectItem value="DIFICIL">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preço a partir de (R$)</Label>
          <Input type="number" min={0} value={form.priceFrom} onChange={(e) => set("priceFrom", Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imagem de capa *</Label>
        <ImageUploader value={form.coverImage} onChange={(url) => set("coverImage", url)} />
      </div>

      <StatusToggle published={form.isPublished} onToggle={(p) => set("isPublished", p)} />

      <div className="space-y-3">
        <h3 className="font-semibold text-stone-800">Dias do roteiro</h3>
        <p className="text-sm text-stone-500">
          Arraste para reordenar. Os dias serão numerados automaticamente.
        </p>
        <ItineraryDayEditor days={days} onChange={setDays} />
      </div>
    </div>
  );
}
