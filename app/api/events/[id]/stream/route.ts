import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// POST /api/events/[id]/stream - Update stream status
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { status } = data

    if (!status || !["SCHEDULED", "LIVE", "ENDED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid stream status" }, { status: 400 })
    }

    // Check if the event exists and belongs to the artist
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        artist: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if the user is the artist who created the event
    if (event.artist.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to update this event" }, { status: 403 })
    }

    // Update the stream status
    const updatedEvent = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        streamStatus: status,
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating stream status:", error)
    return NextResponse.json({ error: "Failed to update stream status" }, { status: 500 })
  }
}

