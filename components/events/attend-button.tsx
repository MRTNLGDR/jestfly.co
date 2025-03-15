"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"

interface AttendButtonProps {
  eventId: string
  initialAttending: boolean
}

export function AttendButton({ eventId, initialAttending }: AttendButtonProps) {
  const [isAttending, setIsAttending] = useState(initialAttending)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  const handleAttend = async () => {
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
      const response = await fetch(`/api/events/${eventId}/attend`, {
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
    <Button
      className={
        isAttending
          ? "bg-white/10 hover:bg-white/20 text-white w-full"
          : "bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity w-full"
      }
      onClick={handleAttend}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : isAttending ? "Cancel RSVP" : "RSVP to Event"}
    </Button>
  )
}

