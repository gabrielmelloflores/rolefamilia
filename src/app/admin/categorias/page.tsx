"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Tag } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count: { posts: number };
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#f59e0b");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/categorias");
    if (res.ok) setCategories(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: slugify(newName), color: newColor }),
      });
      if (!res.ok) throw new Error();
      toast.success("Categoria criada!");
      setNewName("");
      await load();
    } catch {
      toast.error("Erro ao criar categoria");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria?")) return;
    try {
      await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      toast.success("Categoria excluída");
      await load();
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-xl font-bold">Categorias</h2>

      <div className="rounded-xl border border-stone-200 p-4 space-y-4">
        <h3 className="font-semibold text-stone-700">Nova categoria</h3>
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label>Nome</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Europa"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            />
          </div>
          <div className="space-y-2">
            <Label>Cor</Label>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-10 w-16 rounded-lg border border-stone-200 cursor-pointer"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreate} disabled={saving || !newName.trim()} className="bg-amber-500 hover:bg-amber-600 text-stone-900">
              <Plus className="h-4 w-4 mr-2" /> Criar
            </Button>
          </div>
        </div>
        {newName && (
          <p className="text-xs text-stone-400">Slug: <span className="font-mono">{slugify(newName)}</span></p>
        )}
      </div>

      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma categoria criada ainda.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color ?? "#f59e0b" }} />
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-stone-400 font-mono">{cat.slug} · {cat._count.posts} posts</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(cat.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
