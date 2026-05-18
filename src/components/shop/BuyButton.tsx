"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Loader2 } from "lucide-react";

interface BuyButtonProps {
  productId: string;
  productName: string;
}

export function BuyButton({ productId, productName }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erro ao criar sessão");
      window.location.href = data.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao iniciar pagamento");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-amber-500 text-stone-900 font-bold text-lg hover:bg-amber-400 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ShoppingBag className="h-5 w-5" />
      )}
      {loading ? "Redirecionando..." : `Comprar ${productName}`}
    </button>
  );
}
