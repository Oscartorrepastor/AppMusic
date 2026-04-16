import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addFavoriteSchema = z.object({
  songId: z.string().min(1, "Song ID is required"),
});

// GET /api/favorites - Get user's favorite songs
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const favorites = (await prisma.favorite.findMany({
      where: { userId: user.id },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        song: {
          select: {
            id: true,
            title: true,
            artist: true,
            album: true,
            duration: true,
            audioUrl: true,
            coverUrl: true,
            genre: true,
            createdAt: true,
            uploadedById: true,
            albumId: true,
          },
        },
      },
    })) as Array<{
      song: {
        id: string;
        title: string;
        artist: string;
        album: string | null;
        duration: number;
        audioUrl: string;
        coverUrl: string | null;
        genre: string | null;
        createdAt: Date;
        uploadedById: string | null;
        albumId: string | null;
      };
    }>;

    const total = await prisma.favorite.count({ where: { userId: user.id } });

    return NextResponse.json({
      favorites: favorites.map((f) => f.song),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add song to favorites
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { songId } = addFavoriteSchema.parse(body);

    // Check if song exists
    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId: user.id,
          songId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Song already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        songId,
      },
      include: {
        song: true,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}
