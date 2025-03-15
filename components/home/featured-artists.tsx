import { ArtistCard } from "@/components/artist/artist-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Artist {
  id: string
  name: string
  genre: string
  imageUrl: string
}

interface FeaturedArtistsProps {
  artists: Artist[]
}

export function FeaturedArtists({ artists = [] }: FeaturedArtistsProps) {
  // Fallback to mock data if no artists are provided
  const displayArtists =
    artists.length > 0
      ? artists
      : [
          {
            id: "1",
            name: "Luna Eclipse",
            genre: "Electro Pop",
            imageUrl: "/placeholder.svg?height=400&width=400",
          },
          {
            id: "2",
            name: "Cosmic Drift",
            genre: "Ambient",
            imageUrl: "/placeholder.svg?height=400&width=400",
          },
          {
            id: "3",
            name: "Neon Pulse",
            genre: "Synthwave",
            imageUrl: "/placeholder.svg?height=400&width=400",
          },
          {
            id: "4",
            name: "Crystal Echoes",
            genre: "Dream Pop",
            imageUrl: "/placeholder.svg?height=400&width=400",
          },
        ]

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Featured Artists
        </h2>
        <Button variant="outline" className="border-white/20 hover:border-white/40" asChild>
          <Link href="/artists">View All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayArtists.map((artist) => (
          <ArtistCard key={artist.id} {...artist} />
        ))}
      </div>
    </section>
  )
}

