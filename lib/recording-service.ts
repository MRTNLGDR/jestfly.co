import { prisma } from "@/lib/db"

// Interface for recording metadata
export interface RecordingMetadata {
  id: string
  eventId: string
  title: string
  artistId: string
  artistName: string
  thumbnailUrl?: string
  duration: number
  fileSize: number
  storageUrl: string
  createdAt: Date
  status: "PROCESSING" | "READY" | "ERROR"
}

// Service for managing stream recordings
export class RecordingService {
  private static instance: RecordingService

  private constructor() {}

  public static getInstance(): RecordingService {
    if (!RecordingService.instance) {
      RecordingService.instance = new RecordingService()
    }
    return RecordingService.instance
  }

  // Start recording a stream
  public async startRecording(eventId: string): Promise<boolean> {
    try {
      // Check if the event exists
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

      // Check if recording already exists
      const existingRecording = await prisma.streamRecording.findFirst({
        where: { eventId },
      })

      if (existingRecording) {
        // Update status if it exists
        await prisma.streamRecording.update({
          where: { id: existingRecording.id },
          data: { status: "PROCESSING" },
        })
      } else {
        // Create a new recording entry
        await prisma.streamRecording.create({
          data: {
            eventId,
            title: `${event.title} - Recording`,
            artistId: event.artistId,
            status: "PROCESSING",
          },
        })
      }

      // In a real implementation, this would trigger the recording process
      // on the streaming server

      return true
    } catch (error) {
      console.error("Error starting recording:", error)
      return false
    }
  }

  // Stop recording a stream
  public async stopRecording(eventId: string): Promise<boolean> {
    try {
      const recording = await prisma.streamRecording.findFirst({
        where: { eventId },
      })

      if (!recording) {
        return false
      }

      // In a real implementation, this would stop the recording process
      // and trigger post-processing

      // Update recording status
      await prisma.streamRecording.update({
        where: { id: recording.id },
        data: {
          status: "PROCESSING",
          endedAt: new Date(),
        },
      })

      // Simulate post-processing
      setTimeout(async () => {
        try {
          // Generate random duration between 30 and 120 minutes
          const durationMinutes = Math.floor(Math.random() * 90) + 30
          const duration = durationMinutes * 60

          // Generate random file size between 500MB and 2GB
          const fileSize = Math.floor(Math.random() * 1500) + 500

          await prisma.streamRecording.update({
            where: { id: recording.id },
            data: {
              status: "READY",
              duration,
              fileSize,
              storageUrl: `https://storage.jestfly.com/recordings/${recording.id}/index.m3u8`,
              processedAt: new Date(),
            },
          })
        } catch (error) {
          console.error("Error processing recording:", error)

          await prisma.streamRecording.update({
            where: { id: recording.id },
            data: {
              status: "ERROR",
            },
          })
        }
      }, 10000) // Simulate 10 seconds of processing

      return true
    } catch (error) {
      console.error("Error stopping recording:", error)
      return false
    }
  }

  // Get all recordings for an artist
  public async getArtistRecordings(artistId: string): Promise<RecordingMetadata[]> {
    try {
      const recordings = await prisma.streamRecording.findMany({
        where: { artistId },
        include: {
          event: {
            select: {
              title: true,
              thumbnailUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return recordings.map((recording) => ({
        id: recording.id,
        eventId: recording.eventId,
        title: recording.title,
        artistId: recording.artistId,
        artistName: "", // Would be populated in a real implementation
        thumbnailUrl: recording.event.thumbnailUrl,
        duration: recording.duration || 0,
        fileSize: recording.fileSize || 0,
        storageUrl: recording.storageUrl || "",
        createdAt: recording.createdAt,
        status: recording.status as "PROCESSING" | "READY" | "ERROR",
      }))
    } catch (error) {
      console.error("Error fetching artist recordings:", error)
      return []
    }
  }

  // Get all recordings for an event
  public async getEventRecordings(eventId: string): Promise<RecordingMetadata[]> {
    try {
      const recordings = await prisma.streamRecording.findMany({
        where: { eventId },
        include: {
          event: {
            select: {
              title: true,
              thumbnailUrl: true,
              artist: {
                select: {
                  stageName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return recordings.map((recording) => ({
        id: recording.id,
        eventId: recording.eventId,
        title: recording.title,
        artistId: recording.artistId,
        artistName: recording.event.artist.stageName,
        thumbnailUrl: recording.event.thumbnailUrl,
        duration: recording.duration || 0,
        fileSize: recording.fileSize || 0,
        storageUrl: recording.storageUrl || "",
        createdAt: recording.createdAt,
        status: recording.status as "PROCESSING" | "READY" | "ERROR",
      }))
    } catch (error) {
      console.error("Error fetching event recordings:", error)
      return []
    }
  }

  // Get a specific recording
  public async getRecording(recordingId: string): Promise<RecordingMetadata | null> {
    try {
      const recording = await prisma.streamRecording.findUnique({
        where: { id: recordingId },
        include: {
          event: {
            select: {
              title: true,
              thumbnailUrl: true,
              artist: {
                select: {
                  stageName: true,
                },
              },
            },
          },
        },
      })

      if (!recording) {
        return null
      }

      return {
        id: recording.id,
        eventId: recording.eventId,
        title: recording.title,
        artistId: recording.artistId,
        artistName: recording.event.artist.stageName,
        thumbnailUrl: recording.event.thumbnailUrl,
        duration: recording.duration || 0,
        fileSize: recording.fileSize || 0,
        storageUrl: recording.storageUrl || "",
        createdAt: recording.createdAt,
        status: recording.status as "PROCESSING" | "READY" | "ERROR",
      }
    } catch (error) {
      console.error("Error fetching recording:", error)
      return null
    }
  }

  // Format duration in seconds to HH:MM:SS
  public formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ].join(":")
  }

  // Format file size in bytes to human-readable format
  public formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 Byte"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }
}

// Export a singleton instance
export const recordingService = RecordingService.getInstance()

