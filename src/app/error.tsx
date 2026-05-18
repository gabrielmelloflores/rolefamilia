"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-6 px-4">
        <div className="text-6xl">😕</div>
        <h1 className="text-3xl font-bold text-stone-900 font-heading">
          Algo deu errado
        </h1>
        <p className="text-stone-500 max-w-md mx-auto">
          Desculpe o transtorno. Nossa equipe já foi notificada.
        </p>
        <Button
          onClick={reset}
          className="bg-amber-500 hover:bg-amber-600 text-stone-900"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
