"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";

interface SlugInputProps {
  titleValue?: string;
  value: string;
  onChange: (slug: string) => void;
}

export function SlugInput({ titleValue, value, onChange }: SlugInputProps) {
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!manual && titleValue) {
      onChange(slugify(titleValue));
    }
  }, [titleValue, manual, onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="slug">
        Slug (URL){" "}
        <span className="text-xs text-stone-400 font-normal">
          (auto-gerado do título)
        </span>
      </Label>
      <Input
        id="slug"
        value={value}
        onChange={(e) => {
          setManual(true);
          onChange(slugify(e.target.value));
        }}
        placeholder="meu-post-aqui"
        className="font-mono text-sm"
      />
      {value && (
        <p className="text-xs text-stone-400">
          URL: <span className="text-teal-600">/{value}</span>
        </p>
      )}
    </div>
  );
}
