"use client";

import { BedDouble } from "lucide-react";

interface BookingWidgetProps {
  destinationName?: string;
}

export function BookingWidget({ destinationName }: BookingWidgetProps) {
  async function handleClick() {
    try {
      const res = await fetch("/api/afiliados/provider/booking/click", { method: "POST" });
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {
      window.open("https://booking.com", "_blank");
    }
  }

  return (
    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <BedDouble className="h-5 w-5" />
        <span className="font-semibold text-sm">Hospedagem</span>
      </div>
      <p className="text-stone-700 font-semibold">
        Encontre o melhor hotel{destinationName ? ` em ${destinationName}` : ""}
      </p>
      <p className="text-stone-500 text-sm">Compare preços e reserve com segurança pelo Booking.com</p>
      <button
        onClick={handleClick}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        Ver hotéis disponíveis →
      </button>
      <p className="text-xs text-stone-400 text-center">Parceiro Booking.com · Comissão paga pelo anunciante</p>
    </div>
  );
}
