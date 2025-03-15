import { NextResponse } from "next/server"
import { streamingService } from "@/lib/streaming-service"

// GET /api/streaming - Get all active streams
export async function GET() {
  try {
    const activeStreams = streamingService.getActiveStreams()
    return NextResponse.json(activeStreams)
  } catch (error) {
    console.error("Error fetching active streams:", error)
    return NextResponse.json({ error: "Failed to fetch active streams" }, { status: 500 })
  }
}

