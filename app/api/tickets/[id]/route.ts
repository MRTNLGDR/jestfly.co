import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { monetizationService } from "@/lib/monetization-service"
import { prisma } from "@/lib/db"

// GET /api/tickets/[id] - Get a specific ticket
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ticket = await prisma.streamTicket.findUnique({
      where: { id: params.id },
      include: {
        event: {
          include: {
            artist: true,
          },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Check if the user is the ticket owner, the artist, or an admin
    if (
      ticket.userId !== session.user.id &&
      ticket.event.artist.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

// PATCH /api/tickets/[id] - Update a ticket status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ticket = await prisma.streamTicket.findUnique({
      where: { id: params.id },
      include: {
        event: {
          include: {
            artist: true,
          },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const data = await request.json()
    const { status } = data

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Check permissions based on the requested status change
    if (status === "COMPLETED") {
      // Only admin or artist can complete a ticket
      if (ticket.event.artist.userId !== session.user.id && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      const success = await monetizationService.completeTicket(params.id)

      if (!success) {
        return NextResponse.json({ error: "Failed to complete ticket" }, { status: 500 })
      }
    } else if (status === "CANCELLED") {
      // User can cancel their own ticket, or admin/artist can cancel any ticket
      if (
        ticket.userId !== session.user.id &&
        ticket.event.artist.userId !== session.user.id &&
        session.user.role !== "ADMIN"
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      const success = await monetizationService.cancelTicket(params.id)

      if (!success) {
        return NextResponse.json({ error: "Failed to cancel ticket" }, { status: 500 })
      }
    } else if (status === "REFUNDED") {
      // Only admin or artist can refund a ticket
      if (ticket.event.artist.userId !== session.user.id && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      const success = await monetizationService.refundTicket(params.id)

      if (!success) {
        return NextResponse.json({ error: "Failed to refund ticket" }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedTicket = await prisma.streamTicket.findUnique({
      where: { id: params.id },
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

