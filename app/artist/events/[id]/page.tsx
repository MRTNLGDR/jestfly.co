"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, LinkIcon, TrashIcon, PencilIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import Link from "next/link"

interface Attendee {
  id: string
  userId: string
  user: {
    id: string
    name: string
    image?: string
  }
}

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
  attendees: Attendee[]
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
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

  const handleDeleteEvent = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete event")
      }

      showNotification({
        title: "Success",
        message: "Event deleted successfully",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to delete event",
        type: "error",
      })
      setIsDeleting(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
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
              The event you're looking for doesn't exist or you don't have permission to view it.
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
          <Button
            variant="outline"
            className="border-white/20 hover:border-white/40"
            onClick={() => router.push("/artist/dashboard")}
          >
            Back to Dashboard
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-white/20 hover:border-white/40"
              onClick={() => router.push(`/artist/events/${event.id}/edit`)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
            {event.isVirtual && (
              <Button asChild className="ml-auto">
                <Link href={`/artist/events/${event.id}/stream`}>Manage Stream</Link>
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the event and remove all RSVPs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteEvent}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <GlassCard className="p-6 mb-6">
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {event.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
                {event.isVirtual && event.streamUrl && (
                  <div className="flex items-center text-muted-foreground">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    <a
                      href={event.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-iridescent-1 hover:underline"
                    >
                      Stream URL
                    </a>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Attendees</h2>
                <div className="bg-white/10 px-2 py-1 rounded-full text-sm">
                  {event.attendees.length} {event.attendees.length === 1 ? "person" : "people"}
                </div>
              </div>

              {event.attendees.length > 0 ? (
                <div className="space-y-4">
                  {event.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center space-x-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={attendee.user.image || "/placeholder.svg?height=32&width=32"}
                          alt={attendee.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm">{attendee.user.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No attendees yet</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

