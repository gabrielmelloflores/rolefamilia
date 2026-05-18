"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Mensagem enviada! Responderemos em breve.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Contato" }]} />
          <h1 className="font-heading text-4xl sm:text-5xl text-stone-900 mt-4 mb-2">Fale conosco</h1>
          <p className="text-stone-500 text-lg">Adoramos receber mensagens! Responderemos em até 48h.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Nome</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Mensagem</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
              placeholder="Como podemos ajudar?"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-amber-500 text-stone-900 font-bold hover:bg-amber-400 transition-colors disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {sending ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      </div>
    </div>
  );
}
