"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, PlayCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  viewCount: number | null;
  publishedAt: string;
  syncedAt: string;
}

export default function AdminYoutubePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function loadVideos() {
    const res = await fetch("/api/youtube/videos");
    if (res.ok) setVideos(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadVideos(); }, []);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/youtube/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.count} vídeos sincronizados!`);
      await loadVideos();
    } catch (e) {
      toast.error(`Erro ao sincronizar: ${e instanceof Error ? e.message : "tente novamente"}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Vídeos do YouTube</h2>
          <p className="text-sm text-stone-500">{videos.length} vídeos sincronizados</p>
        </div>
        <Button onClick={handleSync} disabled={syncing} className="bg-red-600 hover:bg-red-700 text-white">
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Sincronizando..." : "Sincronizar agora"}
        </Button>
      </div>

      {loading ? (
        <div className="text-stone-400 text-sm">Carregando...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <PlayCircle className="h-12 w-12 text-stone-300 mx-auto" />
          <p className="text-stone-400">Nenhum vídeo sincronizado ainda.</p>
          <p className="text-sm text-stone-400">Clique em "Sincronizar agora" para importar os vídeos do canal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video">
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium line-clamp-2">{v.title}</p>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>{v.viewCount ? `${v.viewCount.toLocaleString("pt-BR")} views` : "—"}</span>
                  <span>{formatDate(new Date(v.publishedAt))}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
