import { NextRequest, NextResponse } from "next/server";
import { DeezerAPI } from "@/lib/deezer";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "25");

    const charts = await DeezerAPI.getChart(limit);

    return NextResponse.json(charts);
  } catch (error) {
    console.error("Error fetching charts:", error);
    return NextResponse.json(
      { error: "Failed to fetch charts" },
      { status: 500 }
    );
  }
}