import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/merchandise - Get all merchandise
export async function GET() {
  try {
    const merchandise = await prisma.merchandise.findMany({
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
    })

    return NextResponse.json(merchandise)
  } catch (error) {
    console.error("Error fetching merchandise:", error)
    return NextResponse.json({ error: "Failed to fetch merchandise" }, { status: 500 })
  }
}

// POST /api/merchandise - Create a new merchandise item
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
      return NextResponse.json({ error: "Only artists can create merchandise" }, { status: 403 })
    }

    const data = await request.json()
    const { name, description, price, imageUrl, stock } = data

    // Create new merchandise item
    const merchandise = await prisma.merchandise.create({
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        imageUrl,
        stock: Number.parseInt(stock),
        artistId: artist.id,
      },
    })

    return NextResponse.json(merchandise, { status: 201 })
  } catch (error) {
    console.error("Error creating merchandise:", error)
    return NextResponse.json({ error: "Failed to create merchandise" }, { status: 500 })
  }
}

