export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        <p className="text-stone-500 text-sm">Carregando...</p>
      </div>
    </div>
  );
}
