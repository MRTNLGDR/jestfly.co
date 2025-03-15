"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { MusicIcon, PlayIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePlayerContext } from "@/contexts/player-context"

interface AlbumCardProps {
  id: string
  title: string
  releaseYear: string
  coverImage?: string | null
  trackCount: number
  artistId: string
}

export function AlbumCard({ id, title, releaseYear, coverImage, trackCount, artistId }: AlbumCardProps) {
  const { setCurrentAlbum } = usePlayerContext()

  const handlePlay = () => {
    setCurrentAlbum(id)
  }

  return (
    <GlassCard className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square">
        {coverImage ? (
          <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <MusicIcon className="h-16 w-16 text-iridescent-1" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            className="rounded-full bg-iridescent-1 hover:bg-iridescent-2 h-12 w-12"
            onClick={handlePlay}
          >
            <PlayIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {releaseYear} • {trackCount} tracks
        </p>
        <Button variant="outline" size="sm" className="w-full border-white/20 hover:border-white/40" asChild>
          <Link href={`/artists/${artistId}/albums/${id}`}>View Album</Link>
        </Button>
      </div>
    </GlassCard>
  )
}

