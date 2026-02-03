import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get top songs by play count
    const topSongs = await prisma.song.findMany({
      where: { uploadedById: user.id },
      orderBy: { playCount: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        artist: true,
        album: true,
        coverUrl: true,
        playCount: true,
        duration: true,
      },
    });

    // Get total listening time from history
    const history = await prisma.listeningHistory.findMany({
      where: { userId: user.id },
      include: {
        song: {
          select: {
            duration: true,
          },
        },
      },
    });

    const totalListeningTime = history.reduce(
      (acc, entry) => acc + entry.song.duration,
      0
    );

    // Get favorite genres (from most played songs)
    const genreCounts: Record<string, number> = {};
    await Promise.all(
      history.map(async (entry) => {
        const song = await prisma.song.findUnique({
          where: { id: entry.songId },
          select: { genre: true },
        });
        if (song?.genre) {
          genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
        }
      })
    );

    const favoriteGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    // Get total play count
    const totalPlays = await prisma.listeningHistory.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      topSongs,
      totalListeningTime,
      favoriteGenres,
      totalPlays,
      totalSongs: await prisma.song.count({ where: { uploadedById: user.id } }),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
