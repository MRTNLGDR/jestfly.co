"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicIcon, CalendarIcon, ShoppingBagIcon, FileAudioIcon, BarChart3Icon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Artist {
  id: string
  stageName: string
  genre: string
  bio: string
  coverImage?: string
  verified: boolean
  albums: any[]
  events: any[]
  merchandise: any[]
  demos: any[]
}

export default function ArtistDashboardPage() {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
        <div className="relative h-[30vh] mb-8 rounded-xl overflow-hidden">
          <Image
            src={artist.coverImage || "/placeholder.svg?height=1200&width=2000"}
            alt={artist.stageName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 flex items-end">
            <div>
              <h1 className="text-4xl font-bold">{artist.stageName}</h1>
              <p className="text-xl text-muted-foreground">{artist.genre}</p>
              {artist.verified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                  Verified Artist
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Artist Dashboard</h2>
          <Button
            className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            onClick={() => router.push("/artist/edit")}
          >
            Edit Profile
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-white/5 p-1 rounded-lg mb-6">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="music" className="flex-1">
              Music
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1">
              Events
            </TabsTrigger>
            <TabsTrigger value="merchandise" className="flex-1">
              Merchandise
            </TabsTrigger>
            <TabsTrigger value="demos" className="flex-1">
              Demos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/10 mr-4">
                    <MusicIcon className="h-6 w-6 text-iridescent-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Albums</p>
                    <h3 className="text-2xl font-bold">{artist.albums.length}</h3>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/10 mr-4">
                    <CalendarIcon className="h-6 w-6 text-iridescent-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                    <h3 className="text-2xl font-bold">{artist.events.length}</h3>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/10 mr-4">
                    <ShoppingBagIcon className="h-6 w-6 text-iridescent-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Merchandise Items</p>
                    <h3 className="text-2xl font-bold">{artist.merchandise.length}</h3>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/10 mr-4">
                    <BarChart3Icon className="h-6 w-6 text-iridescent-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fans</p>
                    <h3 className="text-2xl font-bold">0</h3>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">About</h3>
              <p className="text-muted-foreground">{artist.bio || "No bio provided."}</p>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Recent Albums</h3>
                  <Link href="/artist/albums">
                    <Button variant="link" className="text-iridescent-1 hover:text-iridescent-2">
                      View All
                    </Button>
                  </Link>
                </div>
                {artist.albums.length > 0 ? (
                  <div className="space-y-4">
                    {artist.albums.slice(0, 3).map((album) => (
                      <div
                        key={album.id}
                        className="flex items-center p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                      >
                        <div className="relative h-12 w-12 mr-4">
                          <Image
                            src={album.coverImage || "/placeholder.svg?height=100&width=100"}
                            alt={album.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{album.title}</h4>
                          <p className="text-sm text-muted-foreground">{album.releaseYear}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No albums yet. Add your first album!</p>
                )}
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/artist/albums/create")}
                >
                  Add New Album
                </Button>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Upcoming Events</h3>
                  <Link href="/artist/events">
                    <Button variant="link" className="text-iridescent-1 hover:text-iridescent-2">
                      View All
                    </Button>
                  </Link>
                </div>
                {artist.events.length > 0 ? (
                  <div className="space-y-4">
                    {artist.events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                      >
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming events. Create your first event!</p>
                )}
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/artist/events/create")}
                >
                  Create New Event
                </Button>
              </GlassCard>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              asChild
            >
              <Link href="/artist/analytics">
                <BarChart3Icon className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </TabsContent>

          <TabsContent value="music">
            <GlassCard className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Your Albums</h3>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/artist/albums/create")}
                >
                  Add New Album
                </Button>
              </div>

              {artist.albums.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.albums.map((album) => (
                    <div
                      key={album.id}
                      className="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={album.coverImage || "/placeholder.svg?height=300&width=300"}
                          alt={album.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold">{album.title}</h4>
                        <p className="text-sm text-muted-foreground">{album.releaseYear}</p>
                        <p className="text-sm text-muted-foreground">{album.tracks.length} tracks</p>
                        <div className="flex space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:border-white/40"
                            onClick={() => router.push(`/artist/albums/${album.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:border-white/40"
                            onClick={() => router.push(`/artist/albums/${album.id}/edit`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MusicIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-bold mb-2">No Albums Yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Start sharing your music with fans by adding your first album.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                    onClick={() => router.push("/artist/albums/create")}
                  >
                    Add Your First Album
                  </Button>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="events">
            <GlassCard className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Your Events</h3>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/artist/events/create")}
                >
                  Create New Event
                </Button>
              </div>

              {artist.events.length > 0 ? (
                <div className="space-y-4">
                  {artist.events.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col md:flex-row justify-between gap-4 p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                      </div>
                      <div className="flex space-x-2 md:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 hover:border-white/40"
                          onClick={() => router.push(`/artist/events/${event.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 hover:border-white/40"
                          onClick={() => router.push(`/artist/events/${event.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-bold mb-2">No Events Yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Connect with your fans by creating virtual or in-person events.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                    onClick={() => router.push("/artist/events/create")}
                  >
                    Create Your First Event
                  </Button>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="merchandise">
            <GlassCard className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Your Merchandise</h3>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/artist/merchandise/create")}
                >
                  Add New Item
                </Button>
              </div>

              {artist.merchandise.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.merchandise.map((item) => (
                    <div
                      key={item.id}
                      className="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={item.imageUrl || "/placeholder.svg?height=300&width=300"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Stock: {item.stock}</p>
                        <div className="flex space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:border-white/40"
                            onClick={() => router.push(`/artist/merchandise/${item.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:border-white/40"
                            onClick={() => router.push(`/artist/merchandise/${item.id}/edit`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-bold mb-2">No Merchandise Yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Start selling merchandise to your fans and create additional revenue streams.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                    onClick={() => router.push("/artist/merchandise/create")}
                  >
                    Add Your First Item
                  </Button>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="demos">
            <GlassCard className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Your Demos</h3>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/artist/demos/create")}
                >
                  Submit New Demo
                </Button>
              </div>

              {artist.demos.length > 0 ? (
                <div className="space-y-4">
                  {artist.demos.map((demo) => (
                    <div
                      key={demo.id}
                      className="flex flex-col md:flex-row justify-between gap-4 p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                    >
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-bold">{demo.title}</h4>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              demo.status === "APPROVED"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : demo.status === "REJECTED"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {demo.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{demo.description}</p>
                        {demo.feedback && (
                          <div className="mt-2 p-2 bg-white/5 rounded-md">
                            <p className="text-sm font-medium">Feedback:</p>
                            <p className="text-sm text-muted-foreground">{demo.feedback}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 md:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 hover:border-white/40"
                          onClick={() => router.push(`/artist/demos/${demo.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileAudioIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-bold mb-2">No Demos Yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Submit your demos for feedback and potential promotion opportunities.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                    onClick={() => router.push("/artist/demos/create")}
                  >
                    Submit Your First Demo
                  </Button>
                </div>
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  )
}

