import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/tracks/[id] - Get track by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const track = await prisma.track.findUnique({
      where: {
        id: params.id,
      },
      include: {
        album: {
          include: {
            artist: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 })
    }

    // Format response
    const response = {
      id: track.id,
      title: track.title,
      duration: track.duration,
      audioUrl: track.audioUrl,
      album: {
        id: track.album.id,
        title: track.album.title,
        artistName: track.album.artist.stageName,
        artistId: track.album.artist.id,
        coverImage: track.album.coverImage,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching track:", error)
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 })
  }
}

