import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// GET /api/jestcoins - Get user's JestCoin balance
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        jestCoins: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ balance: user.jestCoins })
  } catch (error) {
    console.error("Error fetching JestCoin balance:", error)
    return NextResponse.json({ error: "Failed to fetch JestCoin balance" }, { status: 500 })
  }
}

// POST /api/jestcoins - Award JestCoins to user
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { amount, reason } = data

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Update user's JestCoin balance
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        jestCoins: {
          increment: amount,
        },
      },
      select: {
        jestCoins: true,
      },
    })

    // Create transaction record
    await prisma.jestCoinTransaction.create({
      data: {
        userId: session.user.id,
        amount,
        reason: reason || "System award",
        type: "CREDIT",
      },
    })

    return NextResponse.json({
      success: true,
      newBalance: user.jestCoins,
      awarded: amount,
    })
  } catch (error) {
    console.error("Error awarding JestCoins:", error)
    return NextResponse.json({ error: "Failed to award JestCoins" }, { status: 500 })
  }
}

