import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/albums - Get all albums
export async function GET() {
  try {
    const albums = await prisma.album.findMany({
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
        tracks: true,
      },
    })

    return NextResponse.json(albums)
  } catch (error) {
    console.error("Error fetching albums:", error)
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 })
  }
}

// POST /api/albums - Create a new album
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an artist
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist) {
      return NextResponse.json({ error: "Only artists can create albums" }, { status: 403 })
    }

    const data = await request.json()
    const { title, releaseYear, coverImage, tracks } = data

    // Validar dados
    if (!title || !releaseYear) {
      return NextResponse.json({ error: "Title and release year are required" }, { status: 400 })
    }

    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json({ error: "At least one track is required" }, { status: 400 })
    }

    // Validar faixas
    for (const track of tracks) {
      if (!track.title || !track.audioUrl) {
        return NextResponse.json(
          {
            error: "Each track must have a title and audio file",
          },
          { status: 400 },
        )
      }
    }

    // Create new album
    const album = await prisma.album.create({
      data: {
        title,
        releaseYear,
        coverImage,
        artistId: artist.id,
        tracks: {
          create: tracks.map((track: any) => ({
            title: track.title,
            duration: track.duration || 0,
            audioUrl: track.audioUrl,
          })),
        },
      },
      include: {
        tracks: true,
      },
    })

    return NextResponse.json(album, { status: 201 })
  } catch (error) {
    console.error("Error creating album:", error)
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 })
  }
}

