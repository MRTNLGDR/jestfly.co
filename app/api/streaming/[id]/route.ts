import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { streamingService } from "@/lib/streaming-service"
import { prisma } from "@/lib/db"

// GET /api/streaming/[id] - Get stream details
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const stream = streamingService.getStream(params.id)

    if (!stream) {
      // Check if the event exists but is not currently streaming
      const event = await prisma.event.findUnique({
        where: { id: params.id },
        include: {
          artist: {
            select: {
              stageName: true,
            },
          },
        },
      })

      if (!event) {
        return NextResponse.json({ error: "Stream not found" }, { status: 404 })
      }

      // Return event details with stream status
      return NextResponse.json({
        id: event.id,
        title: event.title,
        artistId: event.artistId,
        artistName: event.artist.stageName,
        thumbnailUrl: event.thumbnailUrl,
        status: event.streamStatus,
        hlsUrl: event.streamStatus === "LIVE" ? streamingService.getHlsUrl(event.id) : null,
      })
    }

    // Return active stream details
    return NextResponse.json({
      ...stream,
      hlsUrl: streamingService.getHlsUrl(params.id),
    })
  } catch (error) {
    console.error("Error fetching stream:", error)
    return NextResponse.json({ error: "Failed to fetch stream" }, { status: 500 })
  }
}

// POST /api/streaming/[id] - Start or update a stream
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { action } = data

    // Check if the event exists and belongs to the artist
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        artist: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if the user is the artist who created the event
    if (event.artist.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to manage this stream" }, { status: 403 })
    }

    // Handle different actions
    switch (action) {
      case "start":
        const stream = await streamingService.startStream(params.id)

        if (!stream) {
          return NextResponse.json({ error: "Failed to start stream" }, { status: 500 })
        }

        return NextResponse.json({
          ...stream,
          rtmpUrl: streamingService.getRtmpUrl(),
          hlsUrl: streamingService.getHlsUrl(params.id),
        })

      case "end":
        const success = await streamingService.endStream(params.id)

        if (!success) {
          return NextResponse.json({ error: "Failed to end stream" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error managing stream:", error)
    return NextResponse.json({ error: "Failed to manage stream" }, { status: 500 })
  }
}

