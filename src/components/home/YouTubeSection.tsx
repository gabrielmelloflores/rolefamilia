"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: Date | string;
}

export function YouTubeSection({ videos }: { videos: Video[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!videos.length) return null;

  return (
    <section className="py-20 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-2">YouTube</p>
            <h2 className="font-heading text-3xl sm:text-4xl text-white">Vídeos recentes</h2>
          </div>
          <a
            href="https://youtube.com/@rolefamilia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-stone-400 hover:text-white transition-colors"
          >
            Ver canal →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.slice(0, 6).map((video) => (
            <div key={video.videoId} className="rounded-2xl overflow-hidden bg-stone-800">
              <div className="relative aspect-video group cursor-pointer" onClick={() => setPlayingId(video.videoId)}>
                {playingId === video.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-stone-900/10 transition-colors flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4">
                <p className="text-white font-medium text-sm line-clamp-2">{video.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://youtube.com/@rolefamilia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-red-600 text-white font-bold hover:bg-red-500 transition-colors"
          >
            <Play className="h-4 w-4 fill-white" /> Inscreva-se no Canal
          </a>
        </div>
      </div>
    </section>
  );
}
