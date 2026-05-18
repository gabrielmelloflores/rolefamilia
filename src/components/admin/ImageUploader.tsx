"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  bucket?: "images" | "products";
  className?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  onClear,
  bucket = "images",
  className,
  label = "Clique ou arraste uma imagem",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/") && bucket === "images") {
        toast.error("Por favor, selecione uma imagem");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload falhou");
        const { url } = await res.json();
        onChange(url);
        toast.success("Imagem enviada!");
      } catch {
        toast.error("Erro ao enviar imagem");
      } finally {
        setUploading(false);
      }
    },
    [bucket, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-stone-200 group">
          <Image
            src={value}
            alt="Preview"
            width={800}
            height={450}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                onChange("");
                onClear?.();
              }}
              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
            dragging
              ? "border-amber-400 bg-amber-50"
              : "border-stone-300 hover:border-amber-400 hover:bg-amber-50/50"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={bucket === "images" ? "image/*" : "*"}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
              <p className="text-sm text-stone-500">Enviando...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-stone-400 mb-2" />
              <p className="text-sm text-stone-500 text-center px-4">{label}</p>
              <p className="text-xs text-stone-400 mt-1">PNG, JPG, WEBP · Max 10MB</p>
            </>
          )}
        </label>
      )}
    </div>
  );
}
