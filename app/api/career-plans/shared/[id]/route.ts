import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/career-plans/shared/[id] - Get a shared career plan
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plan = await prisma.careerPlan.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!plan) {
      return NextResponse.json({ error: "Career plan not found" }, { status: 404 })
    }

    // Check if the plan is shared
    if (!plan.isPublic) {
      return NextResponse.json({ error: "This plan is not shared" }, { status: 403 })
    }

    // Transform the data for the response
    const transformedPlan = {
      ...plan,
      nodes: JSON.parse(plan.nodes as string),
      connections: JSON.parse(plan.connections as string),
    }

    return NextResponse.json(transformedPlan)
  } catch (error) {
    console.error("Error fetching shared career plan:", error)
    return NextResponse.json({ error: "Failed to fetch shared career plan" }, { status: 500 })
  }
}

