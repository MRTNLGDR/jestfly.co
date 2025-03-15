"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { MusicIcon, PlayIcon, PauseIcon, TrashIcon, PencilIcon } from "lucide-react"
import Image from "next/image"
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

interface Track {
  id: string
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

export default function AlbumDetailPage({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
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

  const handleDeleteAlbum = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/albums/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete album")
      }

      showNotification({
        title: "Success",
        message: "Album deleted successfully",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to delete album",
        type: "error",
      })
      setIsDeleting(false)
    }
  }

  const togglePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  // Helper function to format seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
              The album you're looking for doesn't exist or you don't have permission to view it.
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
              onClick={() => router.push(`/artist/albums/${album.id}/edit`)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Album
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Album
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the album and all its tracks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAlbum}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                {album.coverImage ? (
                  <Image src={album.coverImage || "/placeholder.svg"} alt={album.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <MusicIcon className="h-16 w-16 text-iridescent-1" />
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold">{album.title}</h1>
              <p className="text-muted-foreground">Release Year: {album.releaseYear}</p>
              <p className="text-muted-foreground">{album.tracks.length} Tracks</p>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4">Tracks</h2>
              {album.tracks.length > 0 ? (
                <div className="space-y-2">
                  {album.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 mr-3"
                          onClick={() => togglePlayTrack(track)}
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <PauseIcon className="h-4 w-4" />
                          ) : (
                            <PlayIcon className="h-4 w-4" />
                          )}
                        </Button>
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No tracks in this album.</p>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Audio player (hidden) */}
        {currentTrack && (
          <audio
            src={currentTrack.audioUrl}
            autoPlay={isPlaying}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </main>
    </AppLayout>
  )
}

