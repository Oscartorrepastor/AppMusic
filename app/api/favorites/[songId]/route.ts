import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/favorites/[songId] - Remove song from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ songId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songId } = await params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_songId: {
          userId: user.id,
          songId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: {
        userId_songId: {
          userId: user.id,
          songId,
        },
      },
    });

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
