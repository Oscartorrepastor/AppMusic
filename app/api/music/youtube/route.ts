import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  try {
    const ytSearchModule = await import("yt-search");
    const ytSearch = ytSearchModule.default;
    const results = await ytSearch(query);
    const video = results.videos?.find((item: { seconds?: number }) => (item.seconds ?? 0) > 30) ?? results.videos?.[0];

    if (!video) {
      return NextResponse.json({
        videoId: null,
        title: query,
        url: searchUrl,
        thumbnail: null,
        embedUrl: null,
        provider: "youtube-search",
      });
    }

    return NextResponse.json({
      videoId: video.videoId,
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`,
      provider: "youtube",
    });
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return NextResponse.json({
      videoId: null,
      title: query,
      url: searchUrl,
      thumbnail: null,
      embedUrl: null,
      provider: "youtube-search",
    });
  }
}
