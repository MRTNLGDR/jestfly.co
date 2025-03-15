import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MusicIcon, CalendarIcon, ShoppingBagIcon } from "lucide-react"
import { AlbumCard } from "@/components/artist/album-card"
import { EventCard } from "@/components/artist/event-card"
import { MerchandiseCard } from "@/components/artist/merchandise-card"
import { FavoriteButton } from "@/components/artist/favorite-button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { CommentsSection } from "@/components/comments/comments-section"

export default async function ArtistProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // Fetch artist data
  const artist = await prisma.artist.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          bio: true,
        },
      },
      albums: {
        include: {
          tracks: true,
        },
        orderBy: {
          releaseYear: "desc",
        },
      },
      events: {
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
      },
      merchandise: {
        where: {
          stock: {
            gt: 0,
          },
        },
      },
    },
  })

  if (!artist) {
    notFound()
  }

  // Check if the user has favorited this artist
  let isFavorited = false
  if (session?.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_entityType_entityId: {
          userId: session.user.id,
          entityType: "artist",
          entityId: artist.id,
        },
      },
    })
    isFavorited = !!favorite
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <div className="relative h-[40vh] mb-8 rounded-xl overflow-hidden">
          <Image
            src={artist.coverImage || "/placeholder.svg?height=1200&width=2000"}
            alt={artist.stageName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 flex items-end">
            <div>
              <h1 className="text-5xl font-bold">{artist.stageName}</h1>
              <p className="text-2xl text-muted-foreground">{artist.genre}</p>
              {artist.verified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-2">
                  Verified Artist
                </span>
              )}
            </div>
          </div>
          {session?.user && (
            <div className="absolute bottom-8 right-8">
              <FavoriteButton entityId={artist.id} entityType="artist" initialFavorited={isFavorited} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground mb-6">{artist.bio || "No bio provided."}</p>

              {session?.user && (
                <Button className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity">
                  Follow Artist
                </Button>
              )}
            </GlassCard>
          </div>

          <div className="md:col-span-2 space-y-12">
            {/* Albums Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Albums</h2>
                {artist.albums.length > 4 && (
                  <Button variant="link" className="text-iridescent-1 hover:text-iridescent-2" asChild>
                    <Link href={`/artists/${artist.id}/albums`}>View All</Link>
                  </Button>
                )}
              </div>

              {artist.albums.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {artist.albums.slice(0, 4).map((album) => (
                    <AlbumCard
                      key={album.id}
                      id={album.id}
                      title={album.title}
                      releaseYear={album.releaseYear}
                      coverImage={album.coverImage}
                      trackCount={album.tracks.length}
                      artistId={artist.id}
                    />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-6 text-center">
                  <MusicIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Albums Yet</h3>
                  <p className="text-muted-foreground">This artist hasn't released any albums yet.</p>
                </GlassCard>
              )}
            </section>

            {/* Upcoming Events Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                {artist.events.length > 3 && (
                  <Button variant="link" className="text-iridescent-1 hover:text-iridescent-2" asChild>
                    <Link href={`/artists/${artist.id}/events`}>View All</Link>
                  </Button>
                )}
              </div>

              {artist.events.length > 0 ? (
                <div className="space-y-4">
                  {artist.events.slice(0, 3).map((event) => (
                    <EventCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.date.toISOString()}
                      time={event.time}
                      location={event.location}
                      isVirtual={event.isVirtual}
                    />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-6 text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">This artist doesn't have any upcoming events scheduled.</p>
                </GlassCard>
              )}
            </section>

            {/* Merchandise Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Merchandise</h2>
                {artist.merchandise.length > 3 && (
                  <Button variant="link" className="text-iridescent-1 hover:text-iridescent-2" asChild>
                    <Link href={`/artists/${artist.id}/merchandise`}>View All</Link>
                  </Button>
                )}
              </div>

              {artist.merchandise.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {artist.merchandise.slice(0, 3).map((item) => (
                    <MerchandiseCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      artistId={artist.id}
                    />
                  ))}
                </div>
              ) : (
                <GlassCard className="p-6 text-center">
                  <ShoppingBagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Merchandise Available</h3>
                  <p className="text-muted-foreground">
                    This artist doesn't have any merchandise available for purchase.
                  </p>
                </GlassCard>
              )}
            </section>
            <section className="mt-12">
              <CommentsSection entityType="artist" entityId={params.id} />
            </section>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

