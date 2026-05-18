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
import { ItineraryDayEditor, DayData } from "@/components/admin/ItineraryDayEditor";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";

export default function EditRoteiroPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetch(`/api/roteiros/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          summary: data.summary ?? "",
          duration: data.duration ?? 1,
          difficulty: data.difficulty ?? "FACIL",
          priceFrom: Number(data.priceFrom) ?? 0,
          currency: data.currency ?? "BRL",
          coverImage: data.coverImage ?? "",
          isPublished: data.isPublished ?? false,
          highlights: data.highlights ?? [],
          included: data.included ?? [],
          notIncluded: data.notIncluded ?? [],
        });
        if (data.days?.length > 0) {
          setDays(data.days.map((d: DayData & { id: string }) => ({
            id: d.id ?? `day-${Date.now()}-${Math.random()}`,
            title: d.title,
            description: d.description ?? "",
            accommodation: d.accommodation ?? "",
            accommodationUrl: d.accommodationUrl ?? "",
            meals: d.meals ?? [],
            activities: d.activities ?? [],
          })));
        }
        setLoading(false);
      })
      .catch(() => { toast.error("Erro ao carregar roteiro"); setLoading(false); });
  }, [id]);

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
      const res = await fetch(`/api/roteiros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();

      if (days.length > 0) {
        await fetch(`/api/roteiros/${id}/dias`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days }),
        });
      }

      toast.success("Roteiro atualizado!");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir este roteiro?")) return;
    try {
      const res = await fetch(`/api/roteiros/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Roteiro excluído");
      router.push("/admin/roteiros");
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  if (loading) return <div className="text-stone-400 text-sm">Carregando...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Editar Roteiro</h2>
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
        <p className="text-sm text-stone-500">Arraste para reordenar. Os dias serão numerados automaticamente.</p>
        <ItineraryDayEditor days={days} onChange={setDays} />
      </div>
    </div>
  );
}
