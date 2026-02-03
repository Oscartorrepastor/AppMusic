import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  duration: z.number().positive("Duration must be positive"),
  audioUrl: z.string().url("Invalid audio URL"),
  coverUrl: z.string().url().optional(),
  genre: z.string().optional(),
  albumId: z.string().optional(),
});

// GET /api/songs - Fetch all songs with pagination, sorting, filtering
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const artist = searchParams.get("artist") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
        { album: { contains: search, mode: "insensitive" } },
      ];
    }

    if (genre) {
      where.genre = { contains: genre, mode: "insensitive" };
    }

    if (artist) {
      where.artist = { contains: artist, mode: "insensitive" };
    }

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
      }),
      prisma.song.count({ where }),
    ]);

    return NextResponse.json({
      songs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

// POST /api/songs - Upload new song
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = songSchema.parse(body);

    const song = await prisma.song.create({
      data: {
        ...validatedData,
        uploadedById: user.id,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating song:", error);
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
