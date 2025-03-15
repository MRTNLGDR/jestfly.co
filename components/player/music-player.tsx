"use client"

import { useState } from "react"
import { usePlayerContext } from "@/contexts/player-context"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
  MinimizeIcon,
  MaximizeIcon,
} from "lucide-react"
import Image from "next/image"

export function MusicPlayer() {
  const {
    currentTrack,
    currentAlbum,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
  } = usePlayerContext()

  const [isMinimized, setIsMinimized] = useState(true)

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Get volume icon based on current volume
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeXIcon className="h-4 w-4" />
    if (volume < 0.3) return <VolumeIcon className="h-4 w-4" />
    if (volume < 0.7) return <Volume1Icon className="h-4 w-4" />
    return <Volume2Icon className="h-4 w-4" />
  }

  // Toggle mute
  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0)
    } else {
      setVolume(0.7)
    }
  }

  // If no track is playing, don't render the player
  if (!currentTrack) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${isMinimized ? "h-16" : "h-80"}`}>
      <GlassCard className="h-full p-4 rounded-b-none">
        <div className="flex items-center justify-between h-8 mb-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <MaximizeIcon className="h-4 w-4" /> : <MinimizeIcon className="h-4 w-4" />}
          </Button>
          <div className="text-sm font-medium">Now Playing</div>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {isMinimized ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-3 rounded overflow-hidden">
                <Image
                  src={currentAlbum?.coverImage || "/placeholder.svg?height=40&width=40"}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium truncate max-w-[200px]">{currentTrack.title}</div>
                <div className="text-xs text-muted-foreground">{currentAlbum?.artistName || "Unknown Artist"}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={previous}>
                <SkipBackIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 mx-1" onClick={togglePlay}>
                {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
                <SkipForwardIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                {getVolumeIcon()}
              </Button>
              <div className="text-xs w-16 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex">
              <div className="relative h-56 w-56 mr-6 rounded-lg overflow-hidden">
                <Image
                  src={currentAlbum?.coverImage || "/placeholder.svg?height=224&width=224"}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{currentTrack.title}</h3>
                <p className="text-lg text-muted-foreground mb-4">{currentAlbum?.artistName || "Unknown Artist"}</p>
                <p className="text-sm text-muted-foreground mb-6">{currentAlbum?.title || "Unknown Album"}</p>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={(value) => seek(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-center items-center space-x-4">
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={previous}>
                      <SkipBackIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-14 w-14 rounded-full bg-white/10"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={next}>
                      <SkipForwardIcon className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                      {getVolumeIcon()}
                    </Button>
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

