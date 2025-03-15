import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/artist/analytics - Get analytics data for the artist
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the artist
    const artist = await prisma.artist.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Get total favorites (for artist, albums, tracks, events, merchandise)
    const favorites = await prisma.favorite.findMany({
      where: {
        OR: [
          { entityType: "artist", entityId: artist.id },
          {
            entityType: "album",
            entityId: {
              in: (
                await prisma.album.findMany({
                  where: { artistId: artist.id },
                  select: { id: true },
                })
              ).map((a) => a.id),
            },
          },
          {
            entityType: "event",
            entityId: {
              in: (
                await prisma.event.findMany({
                  where: { artistId: artist.id },
                  select: { id: true },
                })
              ).map((e) => e.id),
            },
          },
          {
            entityType: "merchandise",
            entityId: {
              in: (
                await prisma.merchandise.findMany({
                  where: { artistId: artist.id },
                  select: { id: true },
                })
              ).map((m) => m.id),
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get unique fans (users who have favorited something)
    const uniqueFans = [...new Set(favorites.map((f) => f.userId))]

    // Get event attendees
    const eventIds = (
      await prisma.event.findMany({
        where: { artistId: artist.id },
        select: { id: true },
      })
    ).map((e) => e.id)

    const attendees = await prisma.eventAttendee.findMany({
      where: {
        eventId: {
          in: eventIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get merchandise purchases
    const merchandiseIds = (
      await prisma.merchandise.findMany({
        where: { artistId: artist.id },
        select: { id: true },
      })
    ).map((m) => m.id)

    const purchases = await prisma.purchase.findMany({
      where: {
        merchandiseId: {
          in: merchandiseIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        merchandise: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format the data for the frontend
    const recentFavorites = favorites.slice(0, 5).map((f) => ({
      id: f.id,
      entityType: f.entityType,
      entityId: f.entityId,
      entityName: f.entityType === "artist" ? artist.stageName : "Item", // Would need additional queries to get names
      userId: f.userId,
      userName: f.user.name,
      date: f.createdAt,
    }))

    const recentAttendees = attendees.slice(0, 5).map((a) => ({
      id: a.id,
      eventId: a.eventId,
      eventName: a.event.title,
      userId: a.userId,
      userName: a.user.name,
      date: a.createdAt,
    }))

    const recentPurchases = purchases.slice(0, 5).map((p) => ({
      id: p.id,
      itemId: p.merchandiseId,
      itemName: p.merchandise.name,
      userId: p.userId,
      userName: p.user.name,
      amount: p.totalPrice,
      date: p.createdAt,
    }))

    return NextResponse.json({
      totalFans: uniqueFans.length,
      totalFavorites: favorites.length,
      totalEventAttendees: attendees.length,
      totalPurchases: purchases.length,
      recentFavorites,
      recentAttendees,
      recentPurchases,
    })
  } catch (error) {
    console.error("Error fetching artist analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

