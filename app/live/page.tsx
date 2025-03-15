import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Live Streams | Jestfly",
  description: "Watch live performances from your favorite artists",
}

async function getLiveStreams() {
  try {
    // Get events that are currently live
    const liveEvents = await prisma.event.findMany({
      where: {
        isVirtual: true,
        streamStatus: "LIVE",
        date: {
          lte: new Date(),
        },
      },
      include: {
        artist: {
          select: {
            stageName: true,
            coverImage: true,
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

    return liveEvents
  } catch (error) {
    console.error("Error fetching live streams:", error)
    return []
  }
}

async function getUpcomingStreams() {
  try {
    // Get events that are scheduled for the future
    const upcomingEvents = await prisma.event.findMany({
      where: {
        isVirtual: true,
        streamStatus: "SCHEDULED",
        date: {
          gte: new Date(),
        },
      },
      include: {
        artist: {
          select: {
            stageName: true,
            coverImage: true,
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
      take: 10,
    })

    return upcomingEvents
  } catch (error) {
    console.error("Error fetching upcoming streams:", error)
    return []
  }
}

export default async function LiveStreamsPage() {
  const liveStreams = await getLiveStreams()
  const upcomingStreams = await getUpcomingStreams()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Live Streams</h1>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Happening Now</h2>
        </div>

        {liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams.map((stream) => (
              <Link href={`/events/${stream.id}`} key={stream.id}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <img
                      src={stream.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                      alt={stream.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge variant="destructive" className="absolute top-2 right-2 animate-pulse">
                      LIVE
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{stream.artist.stageName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{stream._count.attendees} watching</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No Live Streams Right Now</h3>
            <p className="text-muted-foreground mb-4">Check back later or browse upcoming streams below.</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Upcoming Streams</h2>
        </div>

        {upcomingStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingStreams.map((stream) => (
              <Link href={`/events/${stream.id}`} key={stream.id}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <img
                      src={stream.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                      alt={stream.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge variant="outline" className="absolute top-2 right-2">
                      UPCOMING
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{stream.artist.stageName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{new Date(stream.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{stream.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No Upcoming Streams</h3>
            <p className="text-muted-foreground">Check back later for new scheduled streams.</p>
          </div>
        )}
      </section>
    </div>
  )
}

