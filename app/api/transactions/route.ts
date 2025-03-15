import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { MonetizationService, RevenueSource } from "@/lib/monetization-service"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { amount, artistId, description, source, sourceId, metadata } = data

    if (!amount || !description || !source) {
      return NextResponse.json({ error: "Amount, description, and source are required" }, { status: 400 })
    }

    // Validar fonte da transação
    if (!Object.values(RevenueSource).includes(source as RevenueSource)) {
      return NextResponse.json({ error: "Invalid transaction source" }, { status: 400 })
    }

    // Validar ID do artista
    if (artistId) {
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return NextResponse.json({ error: "Artist not found" }, { status: 404 })
      }
    }

    // Validar ID da fonte (evento, merchandise, etc.)
    if (sourceId) {
      let sourceExists = false

      switch (source) {
        case RevenueSource.EVENT_TICKET:
          sourceExists = !!(await prisma.event.findUnique({
            where: { id: sourceId },
          }))
          break
        case RevenueSource.MERCHANDISE:
          sourceExists = !!(await prisma.merchandise.findUnique({
            where: { id: sourceId },
          }))
          break
        case RevenueSource.ALBUM_SALE:
          sourceExists = !!(await prisma.album.findUnique({
            where: { id: sourceId },
          }))
          break
        case RevenueSource.TRACK_SALE:
          sourceExists = !!(await prisma.track.findUnique({
            where: { id: sourceId },
          }))
          break
        default:
          sourceExists = true // Não validar para outros tipos
      }

      if (!sourceExists) {
        return NextResponse.json({ error: "Source item not found" }, { status: 404 })
      }
    }

    const transaction = await MonetizationService.createTransaction({
      amount,
      userId: session.user.id,
      artistId,
      description,
      source: source as RevenueSource,
      sourceId,
      metadata,
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error: any) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: error.message || "Failed to create transaction" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const artistId = searchParams.get("artistId")

    // Verificar permissões
    if (artistId && session.user.role !== "ARTIST" && session.user.role !== "ADMIN") {
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist || artist.userId !== session.user.id) {
        return NextResponse.json({ error: "You don't have permission to view these transactions" }, { status: 403 })
      }
    }

    if (userId && userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to view these transactions" }, { status: 403 })
    }

    // Construir query
    const where: any = {}

    if (userId) {
      where.userId = userId
    } else if (artistId) {
      where.artistId = artistId
    } else {
      // Se não for especificado, mostrar apenas as transações do usuário atual
      where.userId = session.user.id
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 })
  }
}

