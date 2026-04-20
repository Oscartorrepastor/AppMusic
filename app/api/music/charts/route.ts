import { NextRequest, NextResponse } from "next/server";
import { getFreeCharts } from "@/lib/free-music";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "25");

    const tracks = await getFreeCharts(limit);

    return NextResponse.json({
      tracks,
      total: tracks.length,
      provider: "deezer+itunes",
    });
  } catch (error) {
    console.error("Error fetching charts:", error);
    return NextResponse.json(
      { error: "Failed to fetch charts" },
      { status: 500 }
    );
  }
}