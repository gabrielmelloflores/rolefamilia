export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description?: string | null;
  thumbnail: string;
  duration?: string | null;
  viewCount?: number | null;
  publishedAt: Date;
  syncedAt: Date;
}
