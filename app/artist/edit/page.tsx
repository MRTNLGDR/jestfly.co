"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { MusicIcon } from "lucide-react"
import Image from "next/image"

interface Artist {
  id: string
  stageName: string
  genre: string
  bio: string
  coverImage?: string
}

export default function EditArtistProfilePage() {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [stageName, setStageName] = useState("")
  const [genre, setGenre] = useState("")
  const [bio, setBio] = useState("")
  const [coverImage, setCoverImage] = useState("")
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

  // Fetch artist data
  useEffect(() => {
    const fetchArtistData = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/artists/me")

        if (!response.ok) {
          throw new Error("Failed to fetch artist data")
        }

        const data = await response.json()
        setArtist(data)
        setStageName(data.stageName)
        setGenre(data.genre)
        setBio(data.bio || "")
        setCoverImage(data.coverImage || "")
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch artist data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchArtistData()
    }
  }, [user, showNotification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!artist) throw new Error("Artist profile not found")

      const response = await fetch(`/api/artists/${artist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageName,
          genre,
          bio,
          coverImage,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update artist profile")
      }

      showNotification({
        title: "Success",
        message: "Your artist profile has been updated!",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update artist profile",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
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

  if (!artist) {
    return (
      <AppLayout>
        <Navbar />
        <main className="py-8">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Artist Profile Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              It seems you don't have an artist profile yet. Create one to start sharing your music with fans.
            </p>
            <Button
              className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              onClick={() => router.push("/artist/create")}
            >
              Create Artist Profile
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
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Edit Artist Profile
        </h1>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          {coverImage && (
            <div className="relative h-40 w-40 mx-auto mb-8 rounded-full overflow-hidden">
              <Image src={coverImage || "/placeholder.svg"} alt={stageName} fill className="object-cover" />
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
              <Label htmlFor="stageName">Stage Name</Label>
              <Input
                id="stageName"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="bg-transparent border-white/20 focus:border-white/40 resize-none"
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
                onClick={() => router.push("/artist/dashboard")}
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

