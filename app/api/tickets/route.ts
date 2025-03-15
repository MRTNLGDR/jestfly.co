import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { monetizationService } from "@/lib/monetization-service"
import { prisma } from "@/lib/db"

// GET /api/tickets - Get tickets for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("eventId")

    // If eventId is provided, get tickets for that event
    if (eventId) {
      // Check if the user is the artist who owns the event or an admin
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          artist: true,
        },
      })

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      if (event.artist.userId !== session.user.id && session.user.role !== "ADMIN") {
        // Check if the user is just getting their own ticket
        const userTicket = await prisma.streamTicket.findFirst({
          where: {
            eventId,
            userId: session.user.id,
          },
        })

        return NextResponse.json(userTicket ? [userTicket] : [])
      }

      const tickets = await monetizationService.getEventTickets(eventId)
      return NextResponse.json(tickets)
    }

    // Otherwise, get all tickets for the user
    const tickets = await monetizationService.getUserTickets(session.user.id)
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { eventId } = data

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Check if the event exists and is paid
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (!event.isPaid) {
      return NextResponse.json({ error: "Event is free, no ticket required" }, { status: 400 })
    }

    // Create a ticket
    const ticket = await monetizationService.createTicket(eventId, session.user.id, event.price || 0, event.currency)

    if (!ticket) {
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

