import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MusicIcon, PlayIcon } from "lucide-react"
import { FavoriteButton } from "@/components/artist/favorite-button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { TrackList } from "@/components/artist/track-list"
import { CommentsSection } from "@/components/comments/comments-section"

export default async function AlbumDetailPage({
  params,
}: {
  params: { id: string; albumId: string }
}) {
  const session = await getServerSession(authOptions)

  // Fetch album data
  const album = await prisma.album.findUnique({
    where: {
      id: params.albumId,
    },
    include: {
      artist: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      tracks: {
        orderBy: {
          id: "asc",
        },
      },
    },
  })

  if (!album || album.artistId !== params.id) {
    notFound()
  }

  // Check if the user has favorited this album
  let isFavorited = false
  if (session?.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_entityType_entityId: {
          userId: session.user.id,
          entityType: "album",
          entityId: album.id,
        },
      },
    })
    isFavorited = !!favorite
  }

  // Format total duration
  const totalDuration = album.tracks.reduce((total, track) => total + track.duration, 0)
  const formatTotalDuration = () => {
    const minutes = Math.floor(totalDuration / 60)
    const seconds = totalDuration % 60
    return `${minutes} min ${seconds} sec`
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <Button variant="outline" className="mb-8 border-white/20 hover:border-white/40" asChild>
          <Link href={`/artists/${params.id}`}>Back to Artist</Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <GlassCard className="p-6 sticky top-24">
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
              <p className="text-lg text-muted-foreground mb-2">{album.artist.stageName}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {album.releaseYear} • {album.tracks.length} tracks • {formatTotalDuration()}
              </p>

              <div className="flex space-x-2 mb-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href={`/player?albumId=${album.id}`}>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Play Album
                  </Link>
                </Button>

                {session?.user && (
                  <FavoriteButton entityId={album.id} entityType="album" initialFavorited={isFavorited} />
                )}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4">Tracks</h2>
              <TrackList tracks={album.tracks} albumId={album.id} showDuration showPlayButton />
            </GlassCard>
          </div>
        </div>
        <div className="mt-8">
          <CommentsSection entityType="album" entityId={params.albumId} />
        </div>
      </main>
    </AppLayout>
  )
}

