import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/career-plans/[id] - Get a specific career plan
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    // Transform the data for the response
    const transformedPlan = {
      ...plan,
      nodes: JSON.parse(plan.nodes as string),
      connections: JSON.parse(plan.connections as string),
    }

    return NextResponse.json(transformedPlan)
  } catch (error) {
    console.error("Error fetching career plan:", error)
    return NextResponse.json({ error: "Failed to fetch career plan" }, { status: 500 })
  }
}

// DELETE /api/career-plans/[id] - Delete a career plan
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    await prisma.careerPlan.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting career plan:", error)
    return NextResponse.json({ error: "Failed to delete career plan" }, { status: 500 })
  }
}

