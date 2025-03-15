import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

// GET /api/events - Get all events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get("artistId")
    const upcoming = searchParams.get("upcoming") === "true"

    let whereClause = {}

    if (artistId) {
      whereClause = {
        ...whereClause,
        artistId,
      }
    }

    if (upcoming) {
      whereClause = {
        ...whereClause,
        date: {
          gte: new Date(),
        },
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        artist: {
          select: {
            stageName: true,
            coverImage: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - Create a new event
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
      return NextResponse.json({ error: "Only artists can create events" }, { status: 403 })
    }

    const data = await request.json()

    // Generate a stream key if it's a Jestfly native stream
    let streamKey = null
    if (data.isVirtual && data.streamPlatform === "JESTFLY") {
      streamKey = uuidv4()
    }

    // Create the event\
    const event = await prisma
    streamKey = uuidv4()

    // Create the event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.isVirtual ? "Virtual Event" : data.location,
        isVirtual: data.isVirtual,
        streamUrl: data.streamUrl,
        streamKey: streamKey,
        streamPlatform: data.streamPlatform,
        thumbnailUrl: data.thumbnailUrl,
        price: data.price,
        artistId: artist.id,
        streamStatus: "SCHEDULED",
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

Let
's update the event detail page to include the live streaming functionality:

```tsx file="app/events/[id]/page.tsx"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, WifiIcon } from "lucide-react"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AttendButton } from "@/components/events/attend-button"
import { LiveStreamPlayer } from "@/components/events/live-stream-player"
import { LiveChat } from "@/components/events/live-chat"
import { Separator } from "@/components/ui/separator"

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      artist: {
        select: {
          id: true,
          stageName: true,
          coverImage: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          attendees: true,
        },
      },
    },
  })

  return event
}

async function getAttendeeStatus(eventId: string, userId: string) {
  const attendee = await prisma.eventAttendee.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  })

  return !!attendee
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  const isAttending = session?.user ? await getAttendeeStatus(params.id, session.user.id) : false

  const eventDate = new Date(event.date)
  const isLive =
    event.isVirtual && event.streamStatus === "LIVE" && eventDate.toDateString() === new Date().toDateString()

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Event Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              {event.isVirtual && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <WifiIcon className="h-3 w-3" />
                  Virtual Event
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href={`/artists/${event.artist.id}`}>{event.artist.stageName}</a>
              </Button>
              {event.streamStatus === "LIVE" && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE NOW
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {format(eventDate, "EEEE, MMMM d, yyyy")}
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-1 h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-1 h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center">
                <UsersIcon className="mr-1 h-4 w-4" />
                {event._count.attendees} {event._count.attendees === 1 ? "attendee" : "attendees"}
              </div>
            </div>
          </div>

          {/* Live Stream Player (if virtual and live) */}
          {event.isVirtual && (
            <div className="space-y-4">
              <LiveStreamPlayer
                eventId={event.id}
                streamUrl={event.streamUrl || ""}
                isLive={isLive}
                title={event.title}
                artistName={event.artist.stageName}
              />

              <div className="flex justify-end">
                <AttendButton
                  eventId={event.id}
                  isAttending={isAttending}
                  buttonText={isAttending ? "Cancel RSVP" : "RSVP to Event"}
                />
              </div>
            </div>
          )}

          {/* Event Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>

          {/* Event Image */}
          {!event.isVirtual && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={event.thumbnailUrl || "/placeholder.svg?height=400&width=800"}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Artist Card */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                <Image
                  src={event.artist.coverImage || "/placeholder.svg?height=96&width=96"}
                  alt={event.artist.stageName}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{event.artist.stageName}</h3>
              <p className="text-sm text-muted-foreground mb-4">Event Host</p>
              <Button asChild variant="outline" className="w-full">
                <a href={`/artists/${event.artist.id}`}>View Artist Profile</a>
              </Button>
            </CardContent>
          </Card>

          {/* RSVP Card (for in-person events) */}
          {!event.isVirtual && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Attend This Event</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join {event._count.attendees} others who are attending this event.
                </p>
                <AttendButton
                  eventId={event.id}
                  isAttending={isAttending}
                  buttonText={isAttending ? "Cancel RSVP" : "RSVP to Event"}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}

          {/* Live Chat (for virtual events) */}
          {event.isVirtual && <LiveChat eventId={event.id} isLive={isLive} />}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Comments Section */}
      <Suspense fallback={<div>Loading comments...</div>}>
        {/* <CommentsSection entityId={event.id} entityType="event" /> */}
      </Suspense>
    </div>
  )
}

