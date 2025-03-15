import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/search - Search across entities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") // Optional: filter by type

    if (!query) {
      return NextResponse.json({ error: "Missing search query" }, { status: 400 })
    }

    const searchTerm = `%${query}%`
    const results: any = {}

    // Search artists
    if (!type || type === "artists") {
      const artists = await prisma.artist.findMany({
        where: {
          OR: [
            { stageName: { contains: query, mode: "insensitive" } },
            { genre: { contains: query, mode: "insensitive" } },
            { bio: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        take: 10,
      })

      results.artists = artists.map((artist) => ({
        id: artist.id,
        name: artist.stageName,
        type: "artist",
        image: artist.coverImage,
        description: artist.genre,
        url: `/artists/${artist.id}`,
      }))
    }

    // Search albums
    if (!type || type === "albums") {
      const albums = await prisma.album.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { releaseYear: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          artist: true,
        },
        take: 10,
      })

      results.albums = albums.map((album) => ({
        id: album.id,
        name: album.title,
        type: "album",
        image: album.coverImage,
        description: `${album.artist.stageName} • ${album.releaseYear}`,
        url: `/artists/${album.artistId}/albums/${album.id}`,
      }))
    }

    // Search events
    if (!type || type === "events") {
      const events = await prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          artist: true,
        },
        take: 10,
      })

      results.events = events.map((event) => ({
        id: event.id,
        name: event.title,
        type: "event",
        description: `${event.artist.stageName} • ${new Date(event.date).toLocaleDateString()}`,
        url: `/events/${event.id}`,
      }))
    }

    // Search merchandise
    if (!type || type === "merchandise") {
      const merchandise = await prisma.merchandise.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          artist: true,
        },
        take: 10,
      })

      results.merchandise = merchandise.map((item) => ({
        id: item.id,
        name: item.name,
        type: "merchandise",
        image: item.imageUrl,
        description: `${item.artist.stageName} • $${item.price.toFixed(2)}`,
        url: `/merch/${item.id}`,
      }))
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}

