import { NextRequest, NextResponse } from "next/server";
import { DeezerAPI } from "@/lib/deezer";

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

    const results = await DeezerAPI.searchTracks(query, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching music:", error);
    return NextResponse.json(
      { error: "Failed to search music" },
      { status: 500 }
    );
  }
}