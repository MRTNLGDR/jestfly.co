import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { MonetizationService } from "@/lib/monetization-service"
import { prisma } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const artistId = params.id

    // Verificar se o artista existe
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
    })

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    // Verificar permissões (apenas o próprio artista ou admin)
    if (artist.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to view this data" }, { status: 403 })
    }

    const revenueSummary = await MonetizationService.getArtistRevenueSummary(artistId)
    const topFans = await MonetizationService.getArtistTopFans(artistId, 5)

    return NextResponse.json({
      ...revenueSummary,
      topFans,
    })
  } catch (error: any) {
    console.error("Error fetching artist revenue:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch artist revenue" }, { status: 500 })
  }
}

