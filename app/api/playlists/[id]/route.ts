import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePlaylistSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  isPublic: z.boolean().optional(),
});

// GET /api/playlists/[id] - Get playlist details with songs
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

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: true,
          },
          orderBy: {
            addedAt: "desc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Check if user has access to playlist
    if (!playlist.isPublic && playlist.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}

// PUT /api/playlists/[id] - Update playlist
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if playlist exists and belongs to user
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (existingPlaylist.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updatePlaylistSchema.parse(body);

    const playlist = await prisma.playlist.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(playlist);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating playlist:", error);
    return NextResponse.json(
      { error: "Failed to update playlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/playlists/[id] - Delete playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if playlist exists and belongs to user
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (existingPlaylist.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.playlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return NextResponse.json(
      { error: "Failed to delete playlist" },
      { status: 500 }
    );
  }
}
