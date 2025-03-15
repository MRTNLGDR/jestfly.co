"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { HeartIcon, MusicIcon, CalendarIcon, ShoppingBagIcon, ClockIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Favorite {
  id: string
  entityType: string
  entityId: string
  createdAt: string
  entity: any
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites/all")

        if (!response.ok) {
          throw new Error("Failed to fetch favorites")
        }

        const data = await response.json()
        setFavorites(data)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch favorites",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchFavorites()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, showNotification])

  const removeFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove from favorites")
      }

      // Update local state
      setFavorites(favorites.filter((fav) => fav.id !== id))

      showNotification({
        title: "Success",
        message: "Removed from favorites",
        type: "success",
      })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to remove from favorites",
        type: "error",
      })
    }
  }

  // Filter favorites by type
  const artistFavorites = favorites.filter((fav) => fav.entityType === "artist")
  const albumFavorites = favorites.filter((fav) => fav.entityType === "album")
  const eventFavorites = favorites.filter((fav) => fav.entityType === "event")
  const merchandiseFavorites = favorites.filter((fav) => fav.entityType === "merchandise")

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

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Your Favorites
        </h1>

        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="w-full bg-white/5 p-1 rounded-lg mb-6">
            <TabsTrigger value="artists" className="flex-1">
              Artists
            </TabsTrigger>
            <TabsTrigger value="albums" className="flex-1">
              Albums
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1">
              Events
            </TabsTrigger>
            <TabsTrigger value="merchandise" className="flex-1">
              Merchandise
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artists">
            {artistFavorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {artistFavorites.map((favorite) => (
                  <GlassCard key={favorite.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={favorite.entity.coverImage || "/placeholder.svg?height=300&width=300"}
                        alt={favorite.entity.stageName}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => removeFavorite(favorite.id)}
                      >
                        <HeartIcon className="h-4 w-4 fill-red-400" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{favorite.entity.stageName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{favorite.entity.genre}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/20 hover:border-white/40"
                        asChild
                      >
                        <Link href={`/artists/${favorite.entityId}`}>View Profile</Link>
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <MusicIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Favorite Artists</h2>
                <p className="text-muted-foreground mb-6">You haven't added any artists to your favorites yet.</p>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href="/artists">Explore Artists</Link>
                </Button>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="albums">
            {albumFavorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {albumFavorites.map((favorite) => (
                  <GlassCard key={favorite.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={favorite.entity.coverImage || "/placeholder.svg?height=300&width=300"}
                        alt={favorite.entity.title}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => removeFavorite(favorite.id)}
                      >
                        <HeartIcon className="h-4 w-4 fill-red-400" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{favorite.entity.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {favorite.entity.artist.stageName} • {favorite.entity.releaseYear}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/20 hover:border-white/40"
                        asChild
                      >
                        <Link href={`/artists/${favorite.entity.artistId}/albums/${favorite.entityId}`}>
                          View Album
                        </Link>
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <MusicIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Favorite Albums</h2>
                <p className="text-muted-foreground mb-6">You haven't added any albums to your favorites yet.</p>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href="/artists">Explore Artists</Link>
                </Button>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="events">
            {eventFavorites.length > 0 ? (
              <div className="space-y-4">
                {eventFavorites.map((favorite) => (
                  <GlassCard key={favorite.id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold">{favorite.entity.title}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2 text-red-400"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <HeartIcon className="h-4 w-4 fill-red-400" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">By {favorite.entity.artist.stageName}</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {new Date(favorite.entity.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ClockIcon className="mr-2 h-4 w-4" />
                            {favorite.entity.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPinIcon className="mr-2 h-4 w-4" />
                            {favorite.entity.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button
                          className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                          asChild
                        >
                          <Link href={`/events/${favorite.entityId}`}>View Event</Link>
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Favorite Events</h2>
                <p className="text-muted-foreground mb-6">You haven't added any events to your favorites yet.</p>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href="/events">Explore Events</Link>
                </Button>
              </GlassCard>
            )}
          </TabsContent>

          <TabsContent value="merchandise">
            {merchandiseFavorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {merchandiseFavorites.map((favorite) => (
                  <GlassCard key={favorite.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={favorite.entity.imageUrl || "/placeholder.svg?height=300&width=300"}
                        alt={favorite.entity.name}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => removeFavorite(favorite.id)}
                      >
                        <HeartIcon className="h-4 w-4 fill-red-400" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{favorite.entity.name}</h3>
                      <p className="text-lg font-bold text-iridescent-1 mb-2">${favorite.entity.price.toFixed(2)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/20 hover:border-white/40"
                        asChild
                      >
                        <Link href={`/merch/${favorite.entityId}`}>View Item</Link>
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <ShoppingBagIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Favorite Merchandise</h2>
                <p className="text-muted-foreground mb-6">You haven't added any merchandise to your favorites yet.</p>
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href="/merch">Explore Merchandise</Link>
                </Button>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  )
}

