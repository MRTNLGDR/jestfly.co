import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/artists/[id] - Get artist by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const artist = await prisma.artist.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            bio: true,
          },
        },
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
      },
    })

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    return NextResponse.json(artist)
  } catch (error) {
    console.error("Error fetching artist:", error)
    return NextResponse.json({ error: "Failed to fetch artist" }, { status: 500 })
  }
}

// PATCH /api/artists/[id] - Update artist profile
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the artist to check ownership
    const artist = await prisma.artist.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Check if the user is the owner of this artist profile or an admin
    if (artist.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const { stageName, genre, bio, coverImage } = data

    // Update artist profile
    const updatedArtist = await prisma.artist.update({
      where: {
        id: params.id,
      },
      data: {
        stageName,
        genre,
        bio,
        coverImage,
      },
    })

    return NextResponse.json(updatedArtist)
  } catch (error) {
    console.error("Error updating artist:", error)
    return NextResponse.json({ error: "Failed to update artist profile" }, { status: 500 })
  }
}

// DELETE /api/artists/[id] - Delete artist profile
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the artist to check ownership
    const artist = await prisma.artist.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Check if the user is the owner of this artist profile or an admin
    if (artist.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete artist profile
    await prisma.artist.delete({
      where: {
        id: params.id,
      },
    })

    // Update user role back to USER
    await prisma.user.update({
      where: {
        id: artist.userId,
      },
      data: {
        role: "USER",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting artist:", error)
    return NextResponse.json({ error: "Failed to delete artist profile" }, { status: 500 })
  }
}

