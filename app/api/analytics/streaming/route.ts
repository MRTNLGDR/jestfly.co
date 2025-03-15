import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { analyticsService } from "@/lib/analytics-service"
import { prisma } from "@/lib/db"

// GET /api/analytics/streaming - Get streaming analytics for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get("artistId")
    const eventId = searchParams.get("eventId")

    // If artistId is provided, get analytics for that artist
    if (artistId) {
      // Check if the user is the artist or an admin
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist || (artist.userId !== session.user.id && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      const analytics = await analyticsService.getArtistAnalytics(artistId)
      return NextResponse.json(analytics)
    }

    // If eventId is provided, get analytics for that event
    if (eventId) {
      // Check if the user is the artist who owns the event or an admin
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          artist: true,
        },
      })

      if (!event || (event.artist.userId !== session.user.id && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      const analytics = await analyticsService.getStreamAnalytics(eventId)
      return NextResponse.json(analytics)
    }

    // If the user is an artist, get their analytics
    if (session.user.role === "ARTIST") {
      const artist = await prisma.artist.findUnique({
        where: { userId: session.user.id },
      })

      if (!artist) {
        return NextResponse.json({ error: "Artist not found" }, { status: 404 })
      }

      const analytics = await analyticsService.getArtistAnalytics(artist.id)
      return NextResponse.json(analytics)
    }

    // Otherwise, return an error
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching streaming analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

