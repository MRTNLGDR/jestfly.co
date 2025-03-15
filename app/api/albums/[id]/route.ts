import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/albums/[id] - Get album by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const album = await prisma.album.findUnique({
      where: {
        id: params.id,
      },
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

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    return NextResponse.json(album)
  } catch (error) {
    console.error("Error fetching album:", error)
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 })
  }
}

// PATCH /api/albums/[id] - Update album
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the album to check ownership
    const album = await prisma.album.findUnique({
      where: {
        id: params.id,
      },
      include: {
        artist: true,
      },
    })

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    // Check if the user is the owner of this album or an admin
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist || (artist.id !== album.artistId && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const { title, releaseYear, coverImage, tracks } = data

    // Update album
    const updatedAlbum = await prisma.album.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        releaseYear,
        coverImage,
      },
    })

    // Update tracks if provided
    if (tracks && Array.isArray(tracks)) {
      // Delete existing tracks
      await prisma.track.deleteMany({
        where: {
          albumId: params.id,
        },
      })

      // Create new tracks
      await Promise.all(
        tracks.map(async (track: any) => {
          await prisma.track.create({
            data: {
              title: track.title,
              duration: track.duration,
              audioUrl: track.audioUrl,
              albumId: params.id,
            },
          })
        }),
      )
    }

    // Get updated album with tracks
    const albumWithTracks = await prisma.album.findUnique({
      where: {
        id: params.id,
      },
      include: {
        tracks: true,
      },
    })

    return NextResponse.json(albumWithTracks)
  } catch (error) {
    console.error("Error updating album:", error)
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 })
  }
}

// DELETE /api/albums/[id] - Delete album
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the album to check ownership
    const album = await prisma.album.findUnique({
      where: {
        id: params.id,
      },
      include: {
        artist: true,
      },
    })

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    // Check if the user is the owner of this album or an admin
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist || (artist.id !== album.artistId && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete album (this will also delete associated tracks due to cascade delete)
    await prisma.album.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting album:", error)
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 })
  }
}

