import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/artists - Get all artists
export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(artists)
  } catch (error) {
    console.error("Error fetching artists:", error)
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 })
  }
}

// POST /api/artists - Create a new artist profile
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { stageName, genre, bio } = data

    // Check if user already has an artist profile
    const existingArtist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (existingArtist) {
      return NextResponse.json({ error: "User already has an artist profile" }, { status: 400 })
    }

    // Create new artist profile
    const artist = await prisma.artist.create({
      data: {
        userId: session.user.id,
        stageName,
        genre,
        bio,
      },
    })

    // Update user role to ARTIST
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        role: "ARTIST",
      },
    })

    return NextResponse.json(artist, { status: 201 })
  } catch (error) {
    console.error("Error creating artist:", error)
    return NextResponse.json({ error: "Failed to create artist profile" }, { status: 500 })
  }
}

