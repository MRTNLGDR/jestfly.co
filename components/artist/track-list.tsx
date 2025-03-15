"use client"

import { Button } from "@/components/ui/button"
import { PlayIcon, PauseIcon } from "lucide-react"
import { usePlayerContext } from "@/contexts/player-context"

interface Track {
  id: string
  title: string
  duration: number
  audioUrl: string
}

interface TrackListProps {
  tracks: Track[]
  albumId: string
  showDuration?: boolean
  showPlayButton?: boolean
}

export function TrackList({ tracks, albumId, showDuration = true, showPlayButton = true }: TrackListProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setCurrentAlbum, togglePlay } = usePlayerContext()

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handlePlayTrack = (trackId: string) => {
    if (currentTrack?.id === trackId) {
      togglePlay()
    } else {
      setCurrentAlbum(albumId)
      setCurrentTrack(trackId)
    }
  }

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center">
            {showPlayButton ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-3" onClick={() => handlePlayTrack(track.id)}>
                {currentTrack?.id === track.id && isPlaying ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <span className="w-8 mr-3 text-center text-muted-foreground">{index + 1}</span>
            )}
            <span className={currentTrack?.id === track.id ? "font-medium text-iridescent-1" : ""}>{track.title}</span>
          </div>
          {showDuration && <span className="text-sm text-muted-foreground">{formatTime(track.duration)}</span>}
        </div>
      ))}
    </div>
  )
}

