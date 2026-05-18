"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StatusToggleProps {
  published: boolean;
  onToggle: (published: boolean) => void;
}

export function StatusToggle({ published, onToggle }: StatusToggleProps) {
  return (
    <div className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl">
      <Switch
        id="status"
        checked={published}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-green-500"
      />
      <div>
        <Label htmlFor="status" className="cursor-pointer font-medium">
          {published ? "Publicado" : "Rascunho"}
        </Label>
        <p className="text-xs text-stone-400">
          {published ? "Visível no site" : "Apenas no admin"}
        </p>
      </div>
      <Badge
        className={
          published
            ? "ml-auto bg-green-100 text-green-700 border-green-200"
            : "ml-auto bg-stone-100 text-stone-600 border-stone-200"
        }
        variant="outline"
      >
        {published ? "PUBLICADO" : "RASCUNHO"}
      </Badge>
    </div>
  );
}
