import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  return NextResponse.json({
    videoId: null,
    title: query,
    url: searchUrl,
    thumbnail: null,
    embedUrl: null,
    provider: "youtube-search",
  });
}
