import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, WifiIcon, LockIcon } from "lucide-react"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AttendButton } from "@/components/events/attend-button"
import { LiveStreamPlayer } from "@/components/events/live-stream-player"
import { LiveChat } from "@/components/events/live-chat"
import { TicketPurchase } from "@/components/events/ticket-purchase"
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

async function getTicketStatus(eventId: string, userId: string) {
  const ticket = await prisma.streamTicket.findFirst({
    where: {
      eventId,
      userId,
      status: "COMPLETED",
    },
  })

  return !!ticket
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  const isAttending = session?.user ? await getAttendeeStatus(params.id, session.user.id) : false

  const hasTicket = session?.user && event.isPaid ? await getTicketStatus(params.id, session.user.id) : !event.isPaid // If the event is free, everyone has a "ticket"

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
              <div className="flex space-x-2">
                {event.isVirtual && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <WifiIcon className="h-3 w-3" />
                    Virtual Event
                  </Badge>
                )}
                {event.isPaid && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <LockIcon className="h-3 w-3" />
                    Paid
                  </Badge>
                )}
              </div>
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
              {hasTicket || !event.isPaid ? (
                <LiveStreamPlayer
                  eventId={event.id}
                  streamUrl={event.streamUrl || ""}
                  isLive={isLive}
                  title={event.title}
                  artistName={event.artist.stageName}
                />
              ) : (
                <Card className="aspect-video flex items-center justify-center bg-muted/50">
                  <div className="text-center p-6">
                    <LockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">This is a paid stream</h3>
                    <p className="text-muted-foreground mb-4">
                      Purchase access to watch this live stream and recording.
                    </p>
                  </div>
                </Card>
              )}

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

          {/* Ticket Purchase (for paid virtual events) */}
          {event.isVirtual && event.isPaid && (
            <TicketPurchase
              eventId={event.id}
              eventTitle={event.title}
              price={event.price || 0}
              currency={event.currency}
              hasTicket={hasTicket}
            />
          )}

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
          {event.isVirtual && (hasTicket || !event.isPaid) && <LiveChat eventId={event.id} isLive={isLive} />}
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

