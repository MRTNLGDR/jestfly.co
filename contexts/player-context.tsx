"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Track {
  id: string
  title: string
  duration: number
  audioUrl: string
}

interface Album {
  id: string
  title: string
  artistName: string
  coverImage?: string
  tracks: Track[]
}

interface PlayerContextType {
  currentTrack: Track | null
  currentAlbum: Album | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  setCurrentTrack: (trackId: string | null) => void
  setCurrentAlbum: (albumId: string | null) => void
  togglePlay: () => void
  play: () => void
  pause: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(null)
  const [currentAlbum, setCurrentAlbumState] = useState<Album | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener("durationchange", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("ended", () => {
      next()
    })

    setAudioElement(audio)

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [volume])

  // Update audio source when current track changes
  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.audioUrl
      if (isPlaying) {
        audioElement.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
    }
  }, [audioElement, currentTrack, isPlaying])

  // Update volume when it changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume
    }
  }, [audioElement, volume])

  const setCurrentTrack = async (trackId: string | null) => {
    if (!trackId) {
      setCurrentTrackState(null)
      setIsPlaying(false)
      return
    }

    try {
      // Fetch track data from API
      const response = await fetch(`/api/tracks/${trackId}`)
      if (!response.ok) throw new Error("Failed to fetch track")

      const track = await response.json()
      setCurrentTrackState(track)
      setIsPlaying(true)
    } catch (error) {
      console.error("Error setting current track:", error)
    }
  }

  const setCurrentAlbum = async (albumId: string | null) => {
    if (!albumId) {
      setCurrentAlbumState(null)
      setCurrentTrackState(null)
      setIsPlaying(false)
      return
    }

    try {
      // Fetch album data from API
      const response = await fetch(`/api/albums/${albumId}`)
      if (!response.ok) throw new Error("Failed to fetch album")

      const album = await response.json()
      setCurrentAlbumState(album)

      // Set first track as current track
      if (album.tracks && album.tracks.length > 0) {
        setCurrentTrackState(album.tracks[0])
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Error setting current album:", error)
    }
  }

  const togglePlay = () => {
    if (!audioElement || !currentTrack) return

    if (isPlaying) {
      audioElement.pause()
    } else {
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
    }

    setIsPlaying(!isPlaying)
  }

  const play = () => {
    if (!audioElement || !currentTrack) return

    audioElement.play().catch((error) => {
      console.error("Error playing audio:", error)
    })

    setIsPlaying(true)
  }

  const pause = () => {
    if (!audioElement) return

    audioElement.pause()
    setIsPlaying(false)
  }

  const next = () => {
    if (!currentAlbum || !currentTrack) return

    const currentIndex = currentAlbum.tracks.findIndex((track) => track.id === currentTrack.id)
    if (currentIndex === -1 || currentIndex === currentAlbum.tracks.length - 1) {
      // If last track, loop back to first track
      setCurrentTrackState(currentAlbum.tracks[0])
    } else {
      setCurrentTrackState(currentAlbum.tracks[currentIndex + 1])
    }
  }

  const previous = () => {
    if (!currentAlbum || !currentTrack) return

    const currentIndex = currentAlbum.tracks.findIndex((track) => track.id === currentTrack.id)
    if (currentIndex === -1 || currentIndex === 0) {
      // If first track, loop to last track
      setCurrentTrackState(currentAlbum.tracks[currentAlbum.tracks.length - 1])
    } else {
      setCurrentTrackState(currentAlbum.tracks[currentIndex - 1])
    }
  }

  const seek = (time: number) => {
    if (!audioElement) return

    audioElement.currentTime = time
    setCurrentTime(time)
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentAlbum,
        isPlaying,
        currentTime,
        duration,
        volume,
        setCurrentTrack,
        setCurrentAlbum,
        togglePlay,
        play,
        pause,
        next,
        previous,
        seek,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayerContext() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider")
  }
  return context
}

