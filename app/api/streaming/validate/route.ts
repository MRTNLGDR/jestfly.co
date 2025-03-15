import { NextResponse } from "next/server"
import { streamingService } from "@/lib/streaming-service"

// POST /api/streaming/validate - Validate stream key
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { streamKey, eventId } = data

    if (!streamKey || !eventId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const isValid = await streamingService.validateStreamKey(streamKey, eventId)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid stream key" }, { status: 403 })
    }

    // Start the stream if validation is successful
    const stream = await streamingService.startStream(eventId)

    if (!stream) {
      return NextResponse.json({ error: "Failed to start stream" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error validating stream key:", error)
    return NextResponse.json({ error: "Failed to validate stream key" }, { status: 500 })
  }
}

