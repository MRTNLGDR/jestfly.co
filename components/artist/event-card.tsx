"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"

interface EventCardProps {
  id: string
  title: string
  date: string
  time: string
  location: string
  isVirtual: boolean
  streamUrl?: string | null
}

export function EventCard({ id, title, date, time, location, isVirtual, streamUrl }: EventCardProps) {
  const [isAttending, setIsAttending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const handleRSVP = async () => {
    if (!isAuthenticated) {
      showNotification({
        title: "Authentication Required",
        message: "Please sign in to RSVP for events",
        type: "info",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/events/${id}/attend`, {
        method: isAttending ? "DELETE" : "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update RSVP")
      }

      setIsAttending(!isAttending)
      showNotification({
        title: isAttending ? "RSVP Cancelled" : "RSVP Confirmed",
        message: isAttending ? "You are no longer attending this event" : "You are now attending this event",
        type: "success",
      })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update RSVP",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDate(date)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="mr-2 h-4 w-4" />
              {time}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPinIcon className="mr-2 h-4 w-4" />
              {location}
              {isVirtual && <span className="ml-2 text-iridescent-1">(Virtual Event)</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:self-center">
          <Button
            className={
              isAttending
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            }
            onClick={handleRSVP}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isAttending ? "Cancel RSVP" : "RSVP Now"}
          </Button>
          <Button variant="outline" className="border-white/20 hover:border-white/40" asChild>
            <Link href={`/events/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

