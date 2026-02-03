import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const history = await prisma.listeningHistory.findMany({
      where: { userId: user.id },
      orderBy: { playedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        song: {
          select: {
            id: true,
            title: true,
            artist: true,
            album: true,
            coverUrl: true,
            duration: true,
          },
        },
      },
    });

    const total = await prisma.listeningHistory.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      history,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('History GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listening history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { songId } = await request.json();

    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      );
    }

    // Create history entry
    const historyEntry = await prisma.listeningHistory.create({
      data: {
        userId: user.id,
        songId,
      },
    });

    // Increment play count
    await prisma.song.update({
      where: { id: songId },
      data: {
        playCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      historyEntry,
    });
  } catch (error) {
    console.error('History POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add to listening history' },
      { status: 500 }
    );
  }
}
