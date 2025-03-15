import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/demos/[id] - Get demo by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const demo = await prisma.demo.findUnique({
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

    if (!demo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 })
    }

    // Check if the user is the owner of this demo or an admin
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist || (artist.id !== demo.artistId && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(demo)
  } catch (error) {
    console.error("Error fetching demo:", error)
    return NextResponse.json({ error: "Failed to fetch demo" }, { status: 500 })
  }
}

// PATCH /api/demos/[id] - Update demo (admin only for status and feedback)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the demo to check ownership
    const demo = await prisma.demo.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!demo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 })
    }

    const data = await request.json()
    const { title, description, audioUrl, status, feedback } = data

    // Check permissions based on what's being updated
    if (status || feedback) {
      // Only admins can update status and feedback
      if (session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Only admins can update status and feedback" }, { status: 403 })
      }
    } else {
      // For other fields, check if the user is the owner
      const artist = await prisma.artist.findUnique({
        where: {
          userId: session.user.id,
        },
      })

      if (!artist || artist.id !== demo.artistId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      // Only allow updates if the demo is still pending
      if (demo.status !== "PENDING") {
        return NextResponse.json({ error: "Cannot update demo that has been reviewed" }, { status: 400 })
      }
    }

    // Update demo
    const updateData: any = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (audioUrl) updateData.audioUrl = audioUrl
    if (status) updateData.status = status
    if (feedback !== undefined) updateData.feedback = feedback

    const updatedDemo = await prisma.demo.update({
      where: {
        id: params.id,
      },
      data: updateData,
    })

    return NextResponse.json(updatedDemo)
  } catch (error) {
    console.error("Error updating demo:", error)
    return NextResponse.json({ error: "Failed to update demo" }, { status: 500 })
  }
}

// DELETE /api/demos/[id] - Delete demo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the demo to check ownership
    const demo = await prisma.demo.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!demo) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 })
    }

    // Check if the user is the owner of this demo or an admin
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist || (artist.id !== demo.artistId && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only allow deletion if the demo is still pending (unless admin)
    if (demo.status !== "PENDING" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Cannot delete demo that has been reviewed" }, { status: 400 })
    }

    // Delete demo
    await prisma.demo.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting demo:", error)
    return NextResponse.json({ error: "Failed to delete demo" }, { status: 500 })
  }
}

