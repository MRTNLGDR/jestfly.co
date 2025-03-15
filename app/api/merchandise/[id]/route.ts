import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/merchandise/[id] - Get merchandise by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const merchandise = await prisma.merchandise.findUnique({
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
      },
    })

    if (!merchandise) {
      return NextResponse.json({ error: "Merchandise not found" }, { status: 404 })
    }

    return NextResponse.json(merchandise)
  } catch (error) {
    console.error("Error fetching merchandise:", error)
    return NextResponse.json({ error: "Failed to fetch merchandise" }, { status: 500 })
  }
}

// PATCH /api/merchandise/[id] - Update merchandise
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the merchandise to check ownership
    const merchandise = await prisma.merchandise.findUnique({
      where: {
        id: params.id,
      },
      include: {
        artist: true,
      },
    })

    if (!merchandise) {
      return NextResponse.json({ error: "Merchandise not found" }, { status: 404 })
    }

    // Check if the user is the owner of this merchandise or an admin
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist || (artist.id !== merchandise.artistId && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const { name, description, price, imageUrl, stock } = data

    // Update merchandise
    const updatedMerchandise = await prisma.merchandise.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        imageUrl,
        stock: Number.parseInt(stock),
      },
    })

    return NextResponse.json(updatedMerchandise)
  } catch (error) {
    console.error("Error updating merchandise:", error)
    return NextResponse.json({ error: "Failed to update merchandise" }, { status: 500 })
  }
}

// DELETE /api/merchandise/[id] - Delete merchandise
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the merchandise to check ownership
    const merchandise = await prisma.merchandise.findUnique({
      where: {
        id: params.id,
      },
      include: {
        artist: true,
      },
    })

    if (!merchandise) {
      return NextResponse.json({ error: "Merchandise not found" }, { status: 404 })
    }

    // Check if the user is the owner of this merchandise or an admin
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist || (artist.id !== merchandise.artistId && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete merchandise
    await prisma.merchandise.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting merchandise:", error)
    return NextResponse.json({ error: "Failed to delete merchandise" }, { status: 500 })
  }
}

