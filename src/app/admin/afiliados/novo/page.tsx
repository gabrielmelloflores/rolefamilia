"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AFFILIATE_PROVIDER_LABELS } from "@/lib/constants";

export default function NovoAfiliadoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "BOOKING",
    url: "",
    description: "",
    isActive: true,
  });

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
      const res = await fetch("/api/afiliados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Link criado!");
      router.push("/admin/afiliados");
    } catch {
      toast.error("Erro ao criar link");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Novo Link de Afiliado</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
          <Save className="h-4 w-4 mr-2" /> Salvar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nome *</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Holafly — chip para Europa" />
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
          <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://holafly.com/?ref=rolefamilia" type="url" />
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Contexto de uso deste link" />
        </div>

        <div className="flex items-center gap-3">
          <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
          <Label>Link ativo</Label>
        </div>
      </div>
    </div>
  );
}
