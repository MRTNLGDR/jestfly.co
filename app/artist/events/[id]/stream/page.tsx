"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { StreamControlPanel } from "@/components/events/stream-control-panel"
import { LiveStreamPlayer } from "@/components/events/live-stream-player"
import { LiveChat } from "@/components/events/live-chat"
import { AlertCircle, ArrowLeft, BarChart3, MessageSquare, Settings, Users } from "lucide-react"

interface StreamPageProps {
  params: {
    id: string
  }
}

interface EventDetails {
  id: string
  title: string
  description: string
  date: string
  time: string
  streamStatus: string
  streamKey: string
  thumbnailUrl?: string
  hlsUrl?: string
  viewerCount: number
}

export default function ArtistStreamPage({ params }: StreamPageProps) {
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [loading, setLoading] = useState(true)
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

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch event details")
        }

        const data = await response.json()

        // Check if the event belongs to the current artist
        if (data.artistId !== user?.artistId) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to manage this stream.",
            variant: "destructive",
          })
          router.push("/artist/streaming")
          return
        }

        // Get stream details if the event is live
        if (data.streamStatus === "LIVE") {
          const streamResponse = await fetch(`/api/streaming/${params.id}`)

          if (streamResponse.ok) {
            const streamData = await streamResponse.json()
            setEvent({
              ...data,
              hlsUrl: streamData.hlsUrl,
              viewerCount: streamData.viewerCount || 0,
            })
          } else {
            setEvent({
              ...data,
              viewerCount: 0,
            })
          }
        } else {
          setEvent({
            ...data,
            viewerCount: 0,
          })
        }
      } catch (error) {
        console.error("Error fetching event details:", error)
        toast({
          title: "Error",
          description: "Failed to load event details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()

    // Poll for viewer count updates if the stream is live
    let interval: NodeJS.Timeout

    if (event?.streamStatus === "LIVE") {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/streaming/${params.id}`)

          if (response.ok) {
            const data = await response.json()
            setEvent((prev) =>
              prev
                ? {
                    ...prev,
                    viewerCount: data.viewerCount || 0,
                  }
                : null,
            )
          }
        } catch (error) {
          console.error("Error updating viewer count:", error)
        }
      }, 10000) // Update every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAuthenticated, isArtist, params.id, router, user, toast, event?.streamStatus])

  const handleStatusChange = (newStatus: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED") => {
    if (event) {
      setEvent({
        ...event,
        streamStatus: newStatus,
      })

      if (newStatus === "ENDED" || newStatus === "CANCELLED") {
        // Redirect to the streaming dashboard after ending the stream
        setTimeout(() => {
          router.push("/artist/streaming")
        }, 2000)
      }
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Stream Management</h1>
        <p>Loading stream details...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Stream Management</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <Button onClick={() => router.push("/artist/streaming")}>Back to Streaming Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.push("/artist/streaming")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Stream Management</h1>
        <Badge
          variant={event.streamStatus === "LIVE" ? "destructive" : "outline"}
          className={`ml-2 ${event.streamStatus === "LIVE" ? "animate-pulse" : ""}`}
        >
          {event.streamStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {event.streamStatus === "LIVE" && event.hlsUrl ? (
                <LiveStreamPlayer
                  hlsUrl={event.hlsUrl}
                  title={event.title}
                  isLive={true}
                  viewerCount={event.viewerCount}
                />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold mb-2">Stream Preview</h3>
                    <p className="text-muted-foreground mb-4">Your stream will appear here once you go live.</p>
                    {event.streamStatus === "SCHEDULED" && (
                      <Button onClick={() => handleStatusChange("LIVE")} className="bg-red-600 hover:bg-red-700">
                        Go Live Now
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="chat">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat
              </TabsTrigger>
              <TabsTrigger value="viewers">
                <Users className="h-4 w-4 mr-2" />
                Viewers
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <LiveChat eventId={event.id} isLive={event.streamStatus === "LIVE"} />
            </TabsContent>

            <TabsContent value="viewers">
              <Card>
                <CardHeader>
                  <CardTitle>Viewers</CardTitle>
                  <CardDescription>People currently watching your stream.</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold mb-2">{event.viewerCount}</h3>
                      <p className="text-muted-foreground">Current Viewers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Stream Analytics</CardTitle>
                  <CardDescription>Performance metrics for your stream.</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">
                      Detailed analytics will be available after your stream ends.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <StreamControlPanel
            eventId={event.id}
            streamKey={event.streamKey}
            currentStatus={event.streamStatus as any}
            onStatusChange={handleStatusChange}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Stream Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Recommended Settings</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Resolution: 1080p (1920x1080) or 720p (1280x720)</li>
                  <li>Framerate: 30fps</li>
                  <li>Bitrate: 4000-6000 kbps</li>
                  <li>Keyframe Interval: 2 seconds</li>
                  <li>Audio: AAC, 128-192 kbps, 48 kHz</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Streaming Software</h3>
                <p className="text-sm text-muted-foreground">
                  We recommend using OBS Studio, Streamlabs, or XSplit for streaming.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

