import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/songs/[id]/stream - Stream audio file with range request support
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

    const song = await prisma.song.findUnique({
      where: { id },
      select: {
        audioUrl: true,
      },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // For now, just redirect to the audio URL
    // In production, you would fetch the file and stream it with range support
    return NextResponse.redirect(song.audioUrl);
  } catch (error) {
    console.error("Error streaming song:", error);
    return NextResponse.json(
      { error: "Failed to stream song" },
      { status: 500 }
    );
  }
}
