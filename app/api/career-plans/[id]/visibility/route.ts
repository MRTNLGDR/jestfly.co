import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT /api/career-plans/[id]/visibility - Update a career plan's visibility
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { isPublic } = data

    if (typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "isPublic field is required and must be a boolean" }, { status: 400 })
    }

    // Check if the plan exists and belongs to the user
    const plan = await prisma.careerPlan.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!plan) {
      return NextResponse.json({ error: "Career plan not found" }, { status: 404 })
    }

    if (plan.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the plan's visibility
    const updatedPlan = await prisma.careerPlan.update({
      where: {
        id: params.id,
      },
      data: {
        isPublic,
      },
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error("Error updating career plan visibility:", error)
    return NextResponse.json({ error: "Failed to update career plan visibility" }, { status: 500 })
  }
}

