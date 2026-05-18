"use client";

import { Shield } from "lucide-react";

interface SegurosBannerProps {
  variant?: "sidebar" | "inline";
}

export function SegurosBanner({ variant = "sidebar" }: SegurosBannerProps) {
  async function handleClick() {
    try {
      const res = await fetch("/api/afiliados/provider/seguros/click", { method: "POST" });
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {
      window.open("https://www.segurospromo.com.br", "_blank");
    }
  }

  if (variant === "inline") {
    return (
      <div className="my-8 rounded-2xl bg-amber-50 border border-amber-100 p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center flex-none">
          <Shield className="h-7 w-7 text-amber-600" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-bold text-stone-900 text-lg">Seguro Viagem</p>
          <p className="text-stone-500 text-sm">Compare e contrate o melhor seguro para sua família</p>
        </div>
        <button
          onClick={handleClick}
          className="whitespace-nowrap px-6 py-3 rounded-full bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 transition-colors"
        >
          Ver coberturas →
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 space-y-3">
      <div className="flex items-center gap-2 text-amber-700">
        <Shield className="h-5 w-5" />
        <span className="font-semibold text-sm">Seguro Viagem</span>
      </div>
      <p className="text-stone-900 font-semibold">Viaje com tranquilidade e proteção</p>
      <p className="text-stone-500 text-sm">Compare os melhores planos de seguro para toda a família.</p>
      <button
        onClick={handleClick}
        className="w-full py-3 rounded-xl bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 transition-colors"
      >
        Cotizar seguro →
      </button>
      <p className="text-xs text-stone-400 text-center">Parceiro Seguros Promo</p>
    </div>
  );
}
