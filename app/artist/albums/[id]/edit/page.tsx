"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { MusicIcon, PlusIcon, XIcon } from "lucide-react"
import Image from "next/image"

interface Track {
  id?: string
  title: string
  duration: number
  audioUrl: string
}

interface Album {
  id: string
  title: string
  releaseYear: string
  coverImage?: string
  artistId: string
  tracks: Track[]
}

export default function EditAlbumPage({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [tracks, setTracks] = useState<Track[]>([])
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

  // Fetch album data
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await fetch(`/api/albums/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch album data")
        }

        const data = await response.json()
        setAlbum(data)
        setTitle(data.title)
        setReleaseYear(data.releaseYear)
        setCoverImage(data.coverImage || "")
        setTracks(data.tracks || [])
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch album data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbumData()
  }, [params.id, showNotification])

  const addTrack = () => {
    setTracks([...tracks, { title: "", duration: 0, audioUrl: "" }])
  }

  const removeTrack = (index: number) => {
    if (tracks.length === 1) return
    const newTracks = [...tracks]
    newTracks.splice(index, 1)
    setTracks(newTracks)
  }

  const updateTrack = (index: number, field: keyof Track, value: string | number) => {
    const newTracks = [...tracks]
    newTracks[index] = { ...newTracks[index], [field]: value }
    setTracks(newTracks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Validate tracks
    const validTracks = tracks.filter((track) => track.title && track.duration > 0 && track.audioUrl)
    if (validTracks.length === 0) {
      showNotification({
        title: "Error",
        message: "Please add at least one valid track",
        type: "error",
      })
      setIsSaving(false)
      return
    }

    try {
      if (!album) throw new Error("Album not found")

      const response = await fetch(`/api/albums/${album.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          releaseYear,
          coverImage,
          tracks: validTracks,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update album")
      }

      showNotification({
        title: "Success",
        message: "Album updated successfully",
        type: "success",
      })

      router.push(`/artist/albums/${album.id}`)
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update album",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to format seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Helper function to parse MM:SS to seconds
  const parseDuration = (duration: string) => {
    const [mins, secs] = duration.split(":").map(Number)
    return mins * 60 + (secs || 0)
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

  if (!album) {
    return (
      <AppLayout>
        <Navbar />
        <main className="py-8">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Album Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The album you're looking for doesn't exist or you don't have permission to edit it.
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
            Edit Album
          </h1>
          <Button
            variant="outline"
            className="border-white/20 hover:border-white/40"
            onClick={() => router.push(`/artist/albums/${album.id}`)}
          >
            Cancel
          </Button>
        </div>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          {coverImage && (
            <div className="relative h-40 w-40 mx-auto mb-8 rounded-lg overflow-hidden">
              <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>
          )}

          {!coverImage && (
            <div className="flex items-center justify-center mb-8">
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
                <MusicIcon className="h-10 w-10 text-iridescent-1" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Album Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Tracks</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/20 hover:border-white/40"
                  onClick={addTrack}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Track
                </Button>
              </div>

              {tracks.map((track, index) => (
                <div key={index} className="space-y-2 p-4 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Track {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrack(index)}
                      disabled={tracks.length === 1}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`track-${index}-title`}>Title</Label>
                    <Input
                      id={`track-${index}-title`}
                      value={track.title}
                      onChange={(e) => updateTrack(index, "title", e.target.value)}
                      required
                      className="bg-transparent border-white/20 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`track-${index}-duration`}>Duration (MM:SS)</Label>
                    <Input
                      id={`track-${index}-duration`}
                      value={track.duration ? formatDuration(track.duration) : ""}
                      onChange={(e) => updateTrack(index, "duration", parseDuration(e.target.value))}
                      required
                      placeholder="3:45"
                      className="bg-transparent border-white/20 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`track-${index}-audioUrl`}>Audio URL</Label>
                    <Input
                      id={`track-${index}-audioUrl`}
                      value={track.audioUrl}
                      onChange={(e) => updateTrack(index, "audioUrl", e.target.value)}
                      required
                      placeholder="https://example.com/audio.mp3"
                      className="bg-transparent border-white/20 focus:border-white/40"
                    />
                  </div>
                </div>
              ))}
            </div>

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
                onClick={() => router.push(`/artist/albums/${album.id}`)}
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

