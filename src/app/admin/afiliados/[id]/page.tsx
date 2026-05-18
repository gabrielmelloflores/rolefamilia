"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Trash2 } from "lucide-react";
import { AFFILIATE_PROVIDER_LABELS } from "@/lib/constants";

export default function EditAfiliadoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState(0);
  const [form, setForm] = useState({
    name: "",
    provider: "BOOKING",
    url: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetch(`/api/afiliados/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          provider: data.provider ?? "BOOKING",
          url: data.url ?? "",
          description: data.description ?? "",
          isActive: data.isActive ?? true,
        });
        setClicks(data.clicks ?? 0);
        setLoading(false);
      })
      .catch(() => { toast.error("Erro ao carregar"); setLoading(false); });
  }, [id]);

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.url) {
      toast.error("Preencha nome e URL");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/afiliados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Link atualizado!");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir este link?")) return;
    try {
      await fetch(`/api/afiliados/${id}`, { method: "DELETE" });
      toast.success("Link excluído");
      router.push("/admin/afiliados");
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  if (loading) return <div className="text-stone-400 text-sm">Carregando...</div>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Editar Link de Afiliado</h2>
          <p className="text-sm text-stone-500">{clicks} cliques registrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" /> Excluir
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
            <Save className="h-4 w-4 mr-2" /> Salvar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nome *</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Provedor *</Label>
          <Select value={form.provider} onValueChange={(v) => set("provider", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(AFFILIATE_PROVIDER_LABELS).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>URL de afiliado *</Label>
          <Input value={form.url} onChange={(e) => set("url", e.target.value)} type="url" />
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
        </div>

        <div className="flex items-center gap-3">
          <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
          <Label>Link ativo</Label>
        </div>
      </div>
    </div>
  );
}
