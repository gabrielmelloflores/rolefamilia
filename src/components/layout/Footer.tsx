"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Verifique seu email para confirmar a inscrição!");
      setEmail("");
    } catch {
      toast.error("Erro ao se inscrever. Tente novamente.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 space-y-4">
            <p className="text-xl font-bold text-white">Rolê Família</p>
            <p className="text-sm text-stone-400 leading-relaxed">
              Viagens em família pelo Brasil e pelo mundo. Roteiros, dicas e produtos digitais para tornar sua aventura inesquecível.
            </p>
            <div className="flex gap-3 pt-1">
              <a href="https://youtube.com/@rolefamilia" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-red-400 transition-colors text-sm">YouTube</a>
              <span className="text-stone-700">·</span>
              <a href="https://instagram.com/rolefamilia" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-pink-400 transition-colors text-sm">Instagram</a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white uppercase tracking-wider">Explorar</p>
            <nav className="flex flex-col gap-2">
              <Link href="/blog" className="text-sm text-stone-400 hover:text-white transition-colors">Blog</Link>
              <Link href="/destinos" className="text-sm text-stone-400 hover:text-white transition-colors">Destinos</Link>
              <Link href="/roteiros" className="text-sm text-stone-400 hover:text-white transition-colors">Roteiros</Link>
              <Link href="/loja" className="text-sm text-stone-400 hover:text-white transition-colors">Loja Digital</Link>
            </nav>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white uppercase tracking-wider">A Família</p>
            <nav className="flex flex-col gap-2">
              <Link href="/sobre" className="text-sm text-stone-400 hover:text-white transition-colors">Sobre nós</Link>
              <Link href="/contato" className="text-sm text-stone-400 hover:text-white transition-colors">Contato</Link>
              <a href="https://youtube.com/@rolefamilia" target="_blank" rel="noopener noreferrer" className="text-sm text-stone-400 hover:text-white transition-colors">Canal YouTube</a>
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-white uppercase tracking-wider">Newsletter</p>
            <p className="text-sm text-stone-400">Receba dicas e roteiros exclusivos toda semana.</p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-900 font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-60"
              >
                {subscribing ? "Inscrevendo..." : "Quero receber!"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Rolê Família. Todos os direitos reservados.</p>
          <p>Feito com ❤️ por uma família que ama viajar</p>
        </div>
      </div>
    </footer>
  );
}
