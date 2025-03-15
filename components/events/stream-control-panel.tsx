"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useNotification } from "@/contexts/notification-context"
import { PlayIcon, MonitorStopIcon as StopIcon, AlertTriangleIcon, CopyIcon, CheckIcon } from "lucide-react"

interface StreamControlPanelProps {
  eventId: string
  streamKey: string
  currentStatus: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED"
  onStatusChange: (newStatus: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED") => void
}

export function StreamControlPanel({ eventId, streamKey, currentStatus, onStatusChange }: StreamControlPanelProps) {
  const { toast } = useToast()
  const { showNotification } = useNotification()
  const [isUpdating, setIsUpdating] = useState(false)
  const [copied, setCopied] = useState(false)

  const updateStreamStatus = async (status: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED") => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/events/${eventId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update stream status")
      }

      onStatusChange(status)

      showNotification({
        title: "Stream Status Updated",
        message: `Your stream is now ${status.toLowerCase()}.`,
        type: "success",
      })
    } catch (error) {
      console.error("Error updating stream status:", error)
      showNotification({
        title: "Error",
        message: "Failed to update stream status. Please try again.",
        type: "error",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey)
    setCopied(true)

    toast({
      title: "Stream Key Copied",
      description: "Your stream key has been copied to clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = () => {
    switch (currentStatus) {
      case "LIVE":
        return "text-red-500"
      case "SCHEDULED":
        return "text-yellow-500"
      case "ENDED":
        return "text-blue-500"
      case "CANCELLED":
        return "text-gray-500"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stream Control Panel
          <Badge
            variant={currentStatus === "LIVE" ? "destructive" : "outline"}
            className={`${currentStatus === "LIVE" ? "animate-pulse" : ""}`}
          >
            {currentStatus}
          </Badge>
        </CardTitle>
        <CardDescription>Manage your live stream settings and controls.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-4 border rounded-md bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Stream Key (Keep Private)</span>
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyStreamKey}>
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
          <div className="font-mono text-xs bg-background p-2 rounded border">{streamKey}</div>
        </div>

        <div className="p-4 border rounded-md bg-yellow-500/10 border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Important Information</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Use your streaming software (OBS, Streamlabs, etc.) and set the stream URL to
                <span className="font-mono bg-background mx-1 px-1 rounded">rtmp://stream.jestfly.com/live</span>
                and use the stream key above.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {currentStatus !== "LIVE" ? (
          <Button
            onClick={() => updateStreamStatus("LIVE")}
            disabled={isUpdating || currentStatus === "CANCELLED"}
            className="bg-red-600 hover:bg-red-700"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Go Live
          </Button>
        ) : (
          <Button onClick={() => updateStreamStatus("ENDED")} disabled={isUpdating} variant="outline">
            <StopIcon className="mr-2 h-4 w-4" />
            End Stream
          </Button>
        )}

        {currentStatus !== "CANCELLED" && currentStatus !== "ENDED" && (
          <Button
            variant="outline"
            onClick={() => updateStreamStatus("CANCELLED")}
            disabled={isUpdating}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            Cancel Stream
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

