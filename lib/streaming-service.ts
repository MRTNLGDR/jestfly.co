import { prisma } from "@/lib/db"

// Interface for stream metadata
export interface StreamMetadata {
  id: string
  title: string
  artistId: string
  artistName: string
  thumbnailUrl?: string
  viewerCount: number
  startedAt: Date
  status: "LIVE" | "ENDED"
}

// Mock implementation of a streaming service
// In a real application, this would integrate with a streaming provider like AWS Media Services, Mux, etc.
export class StreamingService {
  private static instance: StreamingService
  private activeStreams: Map<string, StreamMetadata>

  private constructor() {
    this.activeStreams = new Map()
  }

  public static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService()
    }
    return StreamingService.instance
  }

  // Start a new stream
  public async startStream(eventId: string): Promise<StreamMetadata | null> {
    try {
      // Get the event details
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          artist: {
            select: {
              stageName: true,
            },
          },
        },
      })

      if (!event) {
        throw new Error("Event not found")
      }

      // Create stream metadata
      const streamMetadata: StreamMetadata = {
        id: eventId,
        title: event.title,
        artistId: event.artistId,
        artistName: event.artist.stageName,
        thumbnailUrl: event.thumbnailUrl || undefined,
        viewerCount: 0,
        startedAt: new Date(),
        status: "LIVE",
      }

      // Store in active streams
      this.activeStreams.set(eventId, streamMetadata)

      // Update event status in database
      await prisma.event.update({
        where: { id: eventId },
        data: { streamStatus: "LIVE" },
      })

      return streamMetadata
    } catch (error) {
      console.error("Error starting stream:", error)
      return null
    }
  }

  // End a stream
  public async endStream(eventId: string): Promise<boolean> {
    try {
      const stream = this.activeStreams.get(eventId)

      if (!stream) {
        return false
      }

      // Update stream status
      stream.status = "ENDED"

      // Remove from active streams
      this.activeStreams.delete(eventId)

      // Update event status in database
      await prisma.event.update({
        where: { id: eventId },
        data: { streamStatus: "ENDED" },
      })

      return true
    } catch (error) {
      console.error("Error ending stream:", error)
      return false
    }
  }

  // Get all active streams
  public getActiveStreams(): StreamMetadata[] {
    return Array.from(this.activeStreams.values()).filter((stream) => stream.status === "LIVE")
  }

  // Get a specific stream
  public getStream(eventId: string): StreamMetadata | undefined {
    return this.activeStreams.get(eventId)
  }

  // Update viewer count
  public updateViewerCount(eventId: string, count: number): boolean {
    const stream = this.activeStreams.get(eventId)

    if (!stream) {
      return false
    }

    stream.viewerCount = count
    return true
  }

  // Generate RTMP URL for streaming software
  public getRtmpUrl(): string {
    return "rtmp://stream.jestfly.com/live"
  }

  // Generate HLS URL for viewers
  public getHlsUrl(eventId: string): string {
    return `https://stream.jestfly.com/hls/${eventId}/index.m3u8`
  }

  // Validate stream key
  public async validateStreamKey(streamKey: string, eventId: string): Promise<boolean> {
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      })

      return event?.streamKey === streamKey
    } catch (error) {
      console.error("Error validating stream key:", error)
      return false
    }
  }
}

// Export a singleton instance
export const streamingService = StreamingService.getInstance()

