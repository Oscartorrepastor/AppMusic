import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/albums/[id] - Get album details with songs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        songs: {
          orderBy: {
            title: "asc",
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json(
      { error: "Failed to fetch album" },
      { status: 500 }
    );
  }
}
