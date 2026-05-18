"use client";

import { Globe } from "lucide-react";

interface HolaflyBannerProps {
  variant?: "sidebar" | "inline";
}

export function HolaflyBanner({ variant = "sidebar" }: HolaflyBannerProps) {
  async function handleClick() {
    try {
      const res = await fetch("/api/afiliados/provider/holafly/click", { method: "POST" });
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {
      window.open("https://holafly.com", "_blank");
    }
  }

  if (variant === "inline") {
    return (
      <div className="my-8 rounded-2xl bg-teal-900 text-white p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="h-14 w-14 rounded-full bg-teal-700 flex items-center justify-center flex-none">
          <Globe className="h-7 w-7 text-teal-300" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-bold text-lg">Chip Internacional Holafly</p>
          <p className="text-teal-300 text-sm">Conecte-se em +170 países sem taxa de roaming</p>
        </div>
        <button
          onClick={handleClick}
          className="whitespace-nowrap px-6 py-3 rounded-full bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 transition-colors"
        >
          Comprar com 5% OFF
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-teal-900 p-5 space-y-3">
      <div className="flex items-center gap-2 text-teal-400">
        <Globe className="h-5 w-5" />
        <span className="font-semibold text-sm">Chip Internacional</span>
      </div>
      <p className="text-white font-semibold">Viaje conectado sem surpresas na fatura</p>
      <p className="text-teal-300 text-sm">Holafly: eSIM para +170 países, sem taxa de roaming.</p>
      <button
        onClick={handleClick}
        className="w-full py-3 rounded-xl bg-amber-500 text-stone-900 font-bold text-sm hover:bg-amber-400 transition-colors"
      >
        Comprar com 5% OFF →
      </button>
      <p className="text-xs text-teal-600 text-center">Parceiro Holafly · Use o código ROLEFAMILIA</p>
    </div>
  );
}
