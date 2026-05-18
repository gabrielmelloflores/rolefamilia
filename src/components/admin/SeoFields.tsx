"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SeoFieldsProps {
  seoTitle: string;
  seoDesc: string;
  onSeoTitleChange: (v: string) => void;
  onSeoDescChange: (v: string) => void;
}

export function SeoFields({
  seoTitle,
  seoDesc,
  onSeoTitleChange,
  onSeoDescChange,
}: SeoFieldsProps) {
  return (
    <div className="space-y-4 p-4 border border-stone-200 rounded-xl bg-stone-50">
      <h3 className="font-semibold text-stone-700 text-sm">SEO (opcional)</h3>
      <div className="space-y-2">
        <Label htmlFor="seoTitle" className="text-xs">
          Título SEO{" "}
          <span className="text-stone-400">({seoTitle.length}/60)</span>
        </Label>
        <Input
          id="seoTitle"
          value={seoTitle}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder="Título para Google (deixe vazio para usar o título do post)"
          maxLength={60}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seoDesc" className="text-xs">
          Descrição SEO{" "}
          <span className="text-stone-400">({seoDesc.length}/160)</span>
        </Label>
        <Textarea
          id="seoDesc"
          value={seoDesc}
          onChange={(e) => onSeoDescChange(e.target.value)}
          placeholder="Meta description para Google (deixe vazio para usar o excerpt)"
          rows={3}
          maxLength={160}
          className="resize-none text-sm"
        />
      </div>
    </div>
  );
}
