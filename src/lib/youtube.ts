const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

interface YouTubeVideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { maxres?: { url: string }; high: { url: string } };
    publishedAt: string;
  };
}

export async function fetchLatestVideos(maxResults = 10) {
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
    throw new Error("YouTube API key or channel ID not configured");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", YOUTUBE_API_KEY);
  url.searchParams.set("channelId", CHANNEL_ID);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("order", "date");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

  const data = await res.json();

  return (data.items as YouTubeVideoItem[]).map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high.url,
    publishedAt: new Date(item.snippet.publishedAt),
  }));
}
