import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { recordingService } from "@/lib/recording-service"
import { prisma } from "@/lib/db"

// GET /api/recordings - Get recordings for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get("artistId")
    const eventId = searchParams.get("eventId")

    // If artistId is provided, get recordings for that artist
    if (artistId) {
      // Check if the user is the artist or an admin
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist || (artist.userId !== session.user.id && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      const recordings = await recordingService.getArtistRecordings(artistId)
      return NextResponse.json(recordings)
    }

    // If eventId is provided, get recordings for that event
    if (eventId) {
      const recordings = await recordingService.getEventRecordings(eventId)
      return NextResponse.json(recordings)
    }

    // If the user is an artist, get their recordings
    if (session.user.role === "ARTIST") {
      const artist = await prisma.artist.findUnique({
        where: { userId: session.user.id },
      })

      if (!artist) {
        return NextResponse.json([])
      }

      const recordings = await recordingService.getArtistRecordings(artist.id)
      return NextResponse.json(recordings)
    }

    // Otherwise, return an empty array
    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching recordings:", error)
    return NextResponse.json({ error: "Failed to fetch recordings" }, { status: 500 })
  }
}

