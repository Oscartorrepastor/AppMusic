import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/search - Search across songs, albums, playlists
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!query) {
      return NextResponse.json({
        songs: [],
        albums: [],
        playlists: [],
        artists: [],
      });
    }

    const searchFilter = {
      contains: query,
      mode: "insensitive" as const,
    };

    let songs: any[] = [];
    let albums: any[] = [];
    let playlists: any[] = [];
    let artists: string[] = [];

    // Search songs
    if (type === "all" || type === "songs") {
      songs = await prisma.song.findMany({
        where: {
          OR: [
            { title: searchFilter },
            { artist: searchFilter },
            { album: searchFilter },
          ],
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Search albums
    if (type === "all" || type === "albums") {
      albums = await prisma.album.findMany({
        where: {
          OR: [
            { title: searchFilter },
            { artist: searchFilter },
          ],
        },
        include: {
          songs: {
            select: {
              id: true,
            },
          },
        },
        take: 20,
        orderBy: {
          title: "asc",
        },
      });
    }

    // Search playlists
    if (type === "all" || type === "playlists") {
      playlists = await prisma.playlist.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: searchFilter },
                { description: searchFilter },
              ],
            },
            {
              OR: [
                { userId: user.id },
                { isPublic: true },
              ],
            },
          ],
        },
        include: {
          songs: {
            include: {
              song: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // Get unique artists from songs
    if (type === "all" || type === "artists") {
      const artistSongs = await prisma.song.findMany({
        where: {
          artist: searchFilter,
        },
        select: {
          artist: true,
          coverUrl: true,
        },
        distinct: ["artist"],
        take: 20,
      });

      artists = artistSongs.map((s) => s.artist);
    }

    return NextResponse.json({
      songs,
      albums,
      playlists,
      artists,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
