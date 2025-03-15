import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// POST /api/career-plans/copy - Copy a shared career plan to the user's account
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { planId } = data

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Get the original plan
    const originalPlan = await prisma.careerPlan.findUnique({
      where: {
        id: planId,
      },
    })

    if (!originalPlan) {
      return NextResponse.json({ error: "Career plan not found" }, { status: 404 })
    }

    // Check if the plan is shared
    if (!originalPlan.isPublic) {
      return NextResponse.json({ error: "This plan is not shared" }, { status: 403 })
    }

    // Create a copy of the plan for the current user
    const newPlan = await prisma.careerPlan.create({
      data: {
        title: `Copy of ${originalPlan.title}`,
        description: originalPlan.description,
        nodes: originalPlan.nodes,
        connections: originalPlan.connections,
        isPublic: false,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json(newPlan)
  } catch (error) {
    console.error("Error copying career plan:", error)
    return NextResponse.json({ error: "Failed to copy career plan" }, { status: 500 })
  }
}

