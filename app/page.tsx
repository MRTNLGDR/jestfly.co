import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedArtists } from "@/components/home/featured-artists"
import { UpcomingEvents } from "@/components/home/upcoming-events"
import { FeaturesSection } from "@/components/home/features-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/db"

export default async function Home() {
  // Fetch featured artists
  const artists = await prisma.artist.findMany({
    take: 4,
    where: {
      verified: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  // Fetch upcoming events
  const events = await prisma.event.findMany({
    take: 3,
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
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
    },
  })

  // Format data for components
  const formattedArtists = artists.map((artist) => ({
    id: artist.id,
    name: artist.stageName,
    genre: artist.genre,
    imageUrl: artist.coverImage || "/placeholder.svg?height=400&width=400",
  }))

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date.toISOString().split("T")[0],
    time: event.time,
    location: event.location,
    artistId: event.artistId,
    artistName: event.artist.stageName,
    thumbnailUrl: event.thumbnailUrl || "/placeholder.svg?height=400&width=600",
  }))

  return (
    <AppLayout>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedArtists artists={formattedArtists} />
        <UpcomingEvents events={formattedEvents} />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </AppLayout>
  )
}

