import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/artists/me - Get the current user's artist profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the artist profile for the current user
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        albums: {
          include: {
            tracks: true,
          },
        },
        events: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
        },
        merchandise: true,
        demos: true,
      },
    })

    if (!artist) {
      return NextResponse.json({ error: "Artist profile not found" }, { status: 404 })
    }

    return NextResponse.json(artist)
  } catch (error) {
    console.error("Error fetching artist profile:", error)
    return NextResponse.json({ error: "Failed to fetch artist profile" }, { status: 500 })
  }
}

