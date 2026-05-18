"use client";

export function DuracaoSelect({ value }: { value?: string }) {
  return (
    <select
      defaultValue={value ?? ""}
      onChange={(e) => {
        const url = e.target.value ? `/roteiros?duracao=${e.target.value}` : "/roteiros";
        window.location.href = url;
      }}
      className="px-4 py-2 rounded-full text-sm border border-stone-200 text-stone-600 bg-white focus:outline-none"
    >
      <option value="">Qualquer duração</option>
      <option value="3">Até 3 dias</option>
      <option value="7">Até 7 dias</option>
      <option value="14">Até 14 dias</option>
      <option value="30">Até 30 dias</option>
    </select>
  );
}
