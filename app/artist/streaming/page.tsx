"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { CalendarIcon, Clock, ExternalLinkIcon, PlayIcon, StopCircleIcon } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  streamStatus: string
  thumbnailUrl?: string
  streamKey?: string
  streamUrl?: string
  _count: {
    attendees: number
  }
}

export default function ArtistStreamingPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const { user, isAuthenticated, isArtist } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isArtist) {
      router.push("/")
      return
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?artistId=" + user?.artistId)

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()

        // Filter virtual events only
        const virtualEvents = data.filter((event: any) => event.isVirtual)
        setEvents(virtualEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: "Error",
          description: "Failed to load your events. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [isAuthenticated, isArtist, router, user, toast])

  const handleStartStream = async (eventId: string) => {
    try {
      const response = await fetch(`/api/streaming/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "start" }),
      })

      if (!response.ok) {
        throw new Error("Failed to start stream")
      }

      // Update the event status in the local state
      setEvents(events.map((event) => (event.id === eventId ? { ...event, streamStatus: "LIVE" } : event)))

      toast({
        title: "Stream Started",
        description: "Your stream is now live!",
      })

      // Navigate to the stream management page
      router.push(`/artist/events/${eventId}/stream`)
    } catch (error) {
      console.error("Error starting stream:", error)
      toast({
        title: "Error",
        description: "Failed to start the stream. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEndStream = async (eventId: string) => {
    try {
      const response = await fetch(`/api/streaming/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "end" }),
      })

      if (!response.ok) {
        throw new Error("Failed to end stream")
      }

      // Update the event status in the local state
      setEvents(events.map((event) => (event.id === eventId ? { ...event, streamStatus: "ENDED" } : event)))

      toast({
        title: "Stream Ended",
        description: "Your stream has been ended.",
      })
    } catch (error) {
      console.error("Error ending stream:", error)
      toast({
        title: "Error",
        description: "Failed to end the stream. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getUpcomingEvents = () => {
    return events.filter((event) => event.streamStatus === "SCHEDULED" && new Date(event.date) >= new Date())
  }

  const getLiveEvents = () => {
    return events.filter((event) => event.streamStatus === "LIVE")
  }

  const getPastEvents = () => {
    return events.filter(
      (event) =>
        event.streamStatus === "ENDED" || (event.streamStatus === "SCHEDULED" && new Date(event.date) < new Date()),
    )
  }

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Streaming Dashboard</h1>
        <p>Loading your events...</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Streaming Dashboard</h1>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getUpcomingEvents().length > 0 ? (
              getUpcomingEvents().map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-2 right-2">{event.streamStatus}</Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex justify-between pt-2">
                    <Button onClick={() => handleStartStream(event.id)} className="bg-red-600 hover:bg-red-700">
                      <PlayIcon className="mr-2 h-4 w-4" />
                      Go Live
                    </Button>

                    <Button variant="outline" onClick={() => router.push(`/artist/events/${event.id}/edit`)}>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-muted/50 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Upcoming Streams</h3>
                <p className="text-muted-foreground mb-4">Create a virtual event to start streaming.</p>
                <Button onClick={() => router.push("/artist/events/create")}>Create Virtual Event</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="live">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getLiveEvents().length > 0 ? (
              getLiveEvents().map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge variant="destructive" className="absolute top-2 right-2 animate-pulse">
                      LIVE
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex justify-between pt-2">
                    <Button onClick={() => router.push(`/artist/events/${event.id}/stream`)} variant="default">
                      Manage Stream
                    </Button>

                    <Button
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => handleEndStream(event.id)}
                    >
                      <StopCircleIcon className="mr-2 h-4 w-4" />
                      End Stream
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-muted/50 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Active Streams</h3>
                <p className="text-muted-foreground mb-4">You don't have any active streams right now.</p>
                {getUpcomingEvents().length > 0 && (
                  <Button onClick={() => setActiveTab("upcoming")}>View Upcoming Streams</Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPastEvents().length > 0 ? (
              getPastEvents().map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={event.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge variant="outline" className="absolute top-2 right-2">
                      {event.streamStatus === "ENDED" ? "ENDED" : "MISSED"}
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => router.push(`/events/${event.id}`)}>
                      <ExternalLinkIcon className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-muted/50 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Past Streams</h3>
                <p className="text-muted-foreground">Your past streams will appear here.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

