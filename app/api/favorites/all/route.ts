import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/favorites/all - Get user's favorites with entity data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all favorites
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Fetch entity data for each favorite
    const favoritesWithEntities = await Promise.all(
      favorites.map(async (favorite) => {
        let entity = null

        switch (favorite.entityType) {
          case "artist":
            entity = await prisma.artist.findUnique({
              where: { id: favorite.entityId },
              include: { user: { select: { name: true } } },
            })
            break
          case "album":
            entity = await prisma.album.findUnique({
              where: { id: favorite.entityId },
              include: { artist: true },
            })
            break
          case "event":
            entity = await prisma.event.findUnique({
              where: { id: favorite.entityId },
              include: { artist: true },
            })
            break
          case "merchandise":
            entity = await prisma.merchandise.findUnique({
              where: { id: favorite.entityId },
              include: { artist: true },
            })
            break
        }

        return {
          ...favorite,
          entity,
        }
      }),
    )

    return NextResponse.json(favoritesWithEntities)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

