"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { CalendarIcon } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  isVirtual: boolean
  streamUrl?: string
  artistId: string
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [isVirtual, setIsVirtual] = useState(false)
  const [streamUrl, setStreamUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ARTIST")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch event data")
        }

        const data = await response.json()
        setEvent(data)
        setTitle(data.title)
        setDescription(data.description)
        // Format date for input field (YYYY-MM-DD)
        const eventDate = new Date(data.date)
        setDate(eventDate.toISOString().split("T")[0])
        setTime(data.time)
        setLocation(data.location)
        setIsVirtual(data.isVirtual)
        setStreamUrl(data.streamUrl || "")
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch event data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [params.id, showNotification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!event) throw new Error("Event not found")

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date,
          time,
          location,
          isVirtual,
          streamUrl: isVirtual ? streamUrl : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update event")
      }

      showNotification({
        title: "Success",
        message: "Event updated successfully",
        type: "success",
      })

      router.push(`/artist/events/${event.id}`)
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update event",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <Navbar />
        <main className="flex justify-center items-center min-h-[80vh]">
          <p>Loading...</p>
        </main>
      </AppLayout>
    )
  }

  if (!event) {
    return (
      <AppLayout>
        <Navbar />
        <main className="py-8">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The event you're looking for doesn't exist or you don't have permission to edit it.
            </p>
            <Button
              className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              onClick={() => router.push("/artist/dashboard")}
            >
              Back to Dashboard
            </Button>
          </GlassCard>
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Edit Event
          </h1>
          <Button
            variant="outline"
            className="border-white/20 hover:border-white/40"
            onClick={() => router.push(`/artist/events/${event.id}`)}
          >
            Cancel
          </Button>
        </div>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
              <CalendarIcon className="h-10 w-10 text-iridescent-2" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                className="bg-transparent border-white/20 focus:border-white/40 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="bg-transparent border-white/20 focus:border-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="bg-transparent border-white/20 focus:border-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder={isVirtual ? "Online" : "Venue name, address, city, etc."}
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isVirtual" checked={isVirtual} onCheckedChange={setIsVirtual} />
              <Label htmlFor="isVirtual">This is a virtual event</Label>
            </div>

            {isVirtual && (
              <div className="space-y-2">
                <Label htmlFor="streamUrl">Stream URL</Label>
                <Input
                  id="streamUrl"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder="https://example.com/stream"
                  className="bg-transparent border-white/20 focus:border-white/40"
                />
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 hover:border-white/40"
                onClick={() => router.push(`/artist/events/${event.id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </AppLayout>
  )
}

