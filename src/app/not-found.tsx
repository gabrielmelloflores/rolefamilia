import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-6 px-4">
        <div className="text-8xl font-bold text-amber-500 font-heading">404</div>
        <h1 className="text-3xl font-bold text-stone-900 font-heading">
          Página não encontrada
        </h1>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          Parece que você se perdeu no mapa! Essa página não existe ou foi movida.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="inline-flex items-center justify-center rounded-lg px-4 h-10 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-stone-900 transition-colors">
            Voltar ao início
          </Link>
          <Link href="/destinos" className="inline-flex items-center justify-center rounded-lg px-4 h-10 text-sm font-medium border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors">
            Ver destinos
          </Link>
        </div>
      </div>
    </div>
  );
}
