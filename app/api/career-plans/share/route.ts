import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// POST /api/career-plans/share - Share a career plan via email
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { planId, email, isPublic } = data

    if (!planId || !email) {
      return NextResponse.json({ error: "Plan ID and email are required" }, { status: 400 })
    }

    // Check if the plan exists and belongs to the user
    const plan = await prisma.careerPlan.findUnique({
      where: {
        id: planId,
      },
    })

    if (!plan) {
      return NextResponse.json({ error: "Career plan not found" }, { status: 404 })
    }

    if (plan.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the plan's visibility if specified
    if (typeof isPublic === "boolean") {
      await prisma.careerPlan.update({
        where: {
          id: planId,
        },
        data: {
          isPublic,
        },
      })
    }

    // Send email with share link
    // This is a placeholder - in a real app, you would integrate with an email service
    console.log(`Sharing plan ${planId} with ${email}`)

    // For now, just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sharing career plan:", error)
    return NextResponse.json({ error: "Failed to share career plan" }, { status: 500 })
  }
}

