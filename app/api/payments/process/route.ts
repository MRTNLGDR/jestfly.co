import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { MonetizationService } from "@/lib/monetization-service"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { transactionId, paymentMethod, paymentDetails } = data

    if (!transactionId || !paymentMethod) {
      return NextResponse.json({ error: "Transaction ID and payment method are required" }, { status: 400 })
    }

    const result = await MonetizationService.processPayment({
      transactionId,
      paymentMethod,
      paymentDetails: paymentDetails || {},
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: error.message || "Failed to process payment" }, { status: 500 })
  }
}

