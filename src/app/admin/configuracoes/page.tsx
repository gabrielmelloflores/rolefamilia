"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Settings {
  site_name: string;
  site_description: string;
  site_url: string;
  youtube_channel_url: string;
  instagram_url: string;
  contact_email: string;
  booking_affiliate_id: string;
  holafly_affiliate_code: string;
}

const DEFAULT: Settings = {
  site_name: "Rolê Família",
  site_description: "Viagens em família pelo Brasil e pelo mundo",
  site_url: "",
  youtube_channel_url: "",
  instagram_url: "",
  contact_email: "",
  booking_affiliate_id: "",
  holafly_affiliate_code: "",
};

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/configuracoes")
      .then((r) => r.json())
      .then((data) => setSettings({ ...DEFAULT, ...data }))
      .catch(() => {});
  }, []);

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success("Configurações salvas!");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Configurações do Site</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
          <Save className="h-4 w-4 mr-2" /> Salvar
        </Button>
      </div>

      <section className="space-y-4">
        <h3 className="font-semibold text-stone-700 border-b border-stone-100 pb-2">Informações gerais</h3>
        <div className="space-y-2">
          <Label>Nome do site</Label>
          <Input value={settings.site_name} onChange={(e) => set("site_name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={settings.site_description} onChange={(e) => set("site_description", e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>URL do site</Label>
          <Input value={settings.site_url} onChange={(e) => set("site_url", e.target.value)} placeholder="https://rolefamilia.com.br" type="url" />
        </div>
        <div className="space-y-2">
          <Label>Email de contato</Label>
          <Input value={settings.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="contato@rolefamilia.com.br" type="email" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-stone-700 border-b border-stone-100 pb-2">Redes sociais</h3>
        <div className="space-y-2">
          <Label>Canal do YouTube</Label>
          <Input value={settings.youtube_channel_url} onChange={(e) => set("youtube_channel_url", e.target.value)} placeholder="https://youtube.com/@rolefamilia" type="url" />
        </div>
        <div className="space-y-2">
          <Label>Instagram</Label>
          <Input value={settings.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} placeholder="https://instagram.com/rolefamilia" type="url" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-stone-700 border-b border-stone-100 pb-2">Afiliados</h3>
        <div className="space-y-2">
          <Label>Booking.com — Affiliate ID</Label>
          <Input value={settings.booking_affiliate_id} onChange={(e) => set("booking_affiliate_id", e.target.value)} placeholder="aid=xxxxx" />
        </div>
        <div className="space-y-2">
          <Label>Holafly — Código de desconto</Label>
          <Input value={settings.holafly_affiliate_code} onChange={(e) => set("holafly_affiliate_code", e.target.value)} placeholder="ROLEFAMILIA" />
        </div>
      </section>
    </div>
  );
}
