import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/career-plans - Get all career plans for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const plans = await prisma.careerPlan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching career plans:", error)
    return NextResponse.json({ error: "Failed to fetch career plans" }, { status: 500 })
  }
}

// POST /api/career-plans - Create a new career plan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    const { title, description, nodes, connections } = data

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const plan = await prisma.careerPlan.create({
      data: {
        title,
        description,
        nodes: JSON.stringify(nodes),
        connections: JSON.stringify(connections),
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    // Transform the data for the response
    const transformedPlan = {
      ...plan,
      nodes: JSON.parse(plan.nodes as string),
      connections: JSON.parse(plan.connections as string),
    }

    return NextResponse.json(transformedPlan)
  } catch (error) {
    console.error("Error creating career plan:", error)
    return NextResponse.json({ error: "Failed to create career plan" }, { status: 500 })
  }
}

// PUT /api/career-plans - Update an existing career plan
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    const { id, title, description, nodes, connections } = data

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Check if the plan exists and belongs to the user
    const existingPlan = await prisma.careerPlan.findUnique({
      where: {
        id,
      },
    })

    if (!existingPlan) {
      return NextResponse.json({ error: "Career plan not found" }, { status: 404 })
    }

    if (existingPlan.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const plan = await prisma.careerPlan.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        nodes: JSON.stringify(nodes),
        connections: JSON.stringify(connections),
      },
    })

    // Transform the data for the response
    const transformedPlan = {
      ...plan,
      nodes: JSON.parse(plan.nodes as string),
      connections: JSON.parse(plan.connections as string),
    }

    return NextResponse.json(transformedPlan)
  } catch (error) {
    console.error("Error updating career plan:", error)
    return NextResponse.json({ error: "Failed to update career plan" }, { status: 500 })
  }
}

