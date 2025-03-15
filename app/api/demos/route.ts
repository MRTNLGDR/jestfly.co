import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/demos - Get all demos (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const demos = await prisma.demo.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(demos)
  } catch (error) {
    console.error("Error fetching demos:", error)
    return NextResponse.json({ error: "Failed to fetch demos" }, { status: 500 })
  }
}

// POST /api/demos - Submit a new demo
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
      return NextResponse.json({ error: "Only artists can submit demos" }, { status: 403 })
    }

    const data = await request.json()
    const { title, description, audioUrl } = data

    // Create new demo
    const demo = await prisma.demo.create({
      data: {
        title,
        description,
        audioUrl,
        artistId: artist.id,
        status: "PENDING",
      },
    })

    return NextResponse.json(demo, { status: 201 })
  } catch (error) {
    console.error("Error creating demo:", error)
    return NextResponse.json({ error: "Failed to submit demo" }, { status: 500 })
  }
}

