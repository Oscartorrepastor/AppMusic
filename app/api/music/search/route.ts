import { NextRequest, NextResponse } from "next/server";
import { searchFreeTracks } from "@/lib/free-music";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "25");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const tracks = await searchFreeTracks(query, limit);

    return NextResponse.json({
      tracks,
      total: tracks.length,
      provider: "deezer+itunes",
    });
  } catch (error) {
    console.error("Error searching music:", error);
    return NextResponse.json(
      { error: "Failed to search music" },
      { status: 500 }
    );
  }
}