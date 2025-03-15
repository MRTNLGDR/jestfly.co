"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Volume2, VolumeX, Maximize, Pause, Play, Users } from "lucide-react"

interface LiveStreamPlayerProps {
  hlsUrl: string
  title: string
  isLive: boolean
  viewerCount?: number
}

export function LiveStreamPlayer({ hlsUrl, title, isLive, viewerCount = 0 }: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    let hls: Hls | null = null

    const setupHls = () => {
      if (!isLive || !hlsUrl) {
        setError("Stream is not available")
        setIsLoading(false)
        return
      }

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })

        hls.loadSource(hlsUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false)
          if (video.autoplay) {
            video.play().catch((e) => console.error("Error playing video:", e))
          }
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Network error:", data)
                hls?.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error:", data)
                hls?.recoverMediaError()
                break
              default:
                console.error("Fatal error:", data)
                setError("Failed to load stream")
                break
            }
          }
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari
        video.src = hlsUrl
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false)
          video.play().catch((e) => console.error("Error playing video:", e))
        })
      } else {
        setError("Your browser does not support HLS streaming")
        setIsLoading(false)
      }
    }

    setupHls()

    // Handle play/pause events
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)

      if (hls) {
        hls.destroy()
      }
    }
  }, [hlsUrl, isLive])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch((e) => console.error("Error playing video:", e))
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen().catch((e) => console.error("Error exiting fullscreen:", e))
    } else {
      video.requestFullscreen().catch((e) => console.error("Error entering fullscreen:", e))
    }
  }

  return (
    <Card className="overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center p-4">
            <h3 className="text-xl font-bold text-white mb-2">Stream Unavailable</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      )}

      <div className="relative aspect-video bg-black">
        <video ref={videoRef} className="w-full h-full" playsInline autoPlay muted />

        {/* Stream info overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium truncate">{title}</h3>
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-black/50 text-white">
              <Users className="h-3 w-3 mr-1" />
              {viewerCount}
            </Badge>
          </div>
        </div>

        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

