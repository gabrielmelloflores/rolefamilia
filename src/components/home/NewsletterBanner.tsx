"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage-banner" }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      toast.success("Verifique seu email!");
    } catch {
      toast.error("Erro ao se inscrever.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <section className="py-20 bg-teal-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="h-14 w-14 rounded-full bg-teal-700 flex items-center justify-center mx-auto mb-6">
          <Mail className="h-6 w-6 text-teal-300" />
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">
          Receba roteiros exclusivos toda semana
        </h2>
        <p className="text-teal-300 text-lg mb-8">
          Mais de 1.000 famílias já recebem nossas dicas de viagem. Sem spam, prometemos.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-4 bg-teal-700 rounded-full text-white font-medium">
            ✓ Obrigado! Confirme seu email para ativar a inscrição.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="flex-1 px-5 py-4 rounded-full bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="px-8 py-4 rounded-full bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {subscribing ? "Inscrevendo..." : "Quero receber!"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
