import { NextRequest, NextResponse } from "next/server";
import { DeezerAPI } from "@/lib/deezer";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trackId = parseInt(params.id);

    if (isNaN(trackId)) {
      return NextResponse.json(
        { error: "Invalid track ID" },
        { status: 400 }
      );
    }

    const track = await DeezerAPI.getTrack(trackId);

    return NextResponse.json(track);
  } catch (error) {
    console.error("Error fetching track:", error);
    return NextResponse.json(
      { error: "Failed to fetch track" },
      { status: 500 }
    );
  }
}