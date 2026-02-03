import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPlaylistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  isPublic: z.boolean().default(false),
});

// GET /api/playlists - Get user's playlists
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: user.id,
      },
      include: {
        songs: {
          include: {
            song: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

// POST /api/playlists - Create new playlist
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPlaylistSchema.parse(body);

    const playlist = await prisma.playlist.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating playlist:", error);
    return NextResponse.json(
      { error: "Failed to create playlist" },
      { status: 500 }
    );
  }
}
