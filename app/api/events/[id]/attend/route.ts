import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// POST /api/events/[id]/attend - RSVP to an event
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if the user is already attending
    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
    })

    if (existingAttendee) {
      return NextResponse.json({ error: "Already attending this event" }, { status: 400 })
    }

    // Create attendance record
    const attendee = await prisma.eventAttendee.create({
      data: {
        userId: session.user.id,
        eventId: params.id,
      },
    })

    return NextResponse.json(attendee, { status: 201 })
  } catch (error) {
    console.error("Error attending event:", error)
    return NextResponse.json({ error: "Failed to attend event" }, { status: 500 })
  }
}

// DELETE /api/events/[id]/attend - Cancel RSVP to an event
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the attendance record exists
    const attendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
    })

    if (!attendee) {
      return NextResponse.json({ error: "Not attending this event" }, { status: 404 })
    }

    // Delete attendance record
    await prisma.eventAttendee.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling event attendance:", error)
    return NextResponse.json({ error: "Failed to cancel attendance" }, { status: 500 })
  }
}

