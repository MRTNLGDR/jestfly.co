import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { recordingService } from "@/lib/recording-service"
import { prisma } from "@/lib/db"

// GET /api/recordings/[id] - Get a specific recording
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const recording = await recordingService.getRecording(params.id)

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 })
    }

    // Check if the recording is public
    const dbRecording = await prisma.streamRecording.findUnique({
      where: { id: params.id },
    })

    if (!dbRecording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 })
    }

    // If the recording is not public, check if the user is authorized
    if (!dbRecording.isPublic) {
      const session = await getServerSession(authOptions)

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Check if the user is the artist or an admin
      const isArtist = await prisma.artist.findUnique({
        where: {
          id: recording.artistId,
          userId: session.user.id,
        },
      })

      if (!isArtist && session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    return NextResponse.json(recording)
  } catch (error) {
    console.error("Error fetching recording:", error)
    return NextResponse.json({ error: "Failed to fetch recording" }, { status: 500 })
  }
}

// PATCH /api/recordings/[id] - Update a recording
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recording = await prisma.streamRecording.findUnique({
      where: { id: params.id },
      include: {
        artist: true,
      },
    })

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 })
    }

    // Check if the user is the artist or an admin
    if (recording.artist.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate the data
    const { title, description, isPublic } = data

    const updatedRecording = await prisma.streamRecording.update({
      where: { id: params.id },
      data: {
        title: title,
        description: description,
        isPublic: isPublic,
      },
    })

    return NextResponse.json(updatedRecording)
  } catch (error) {
    console.error("Error updating recording:", error)
    return NextResponse.json({ error: "Failed to update recording" }, { status: 500 })
  }
}

// DELETE /api/recordings/[id] - Delete a recording
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recording = await prisma.streamRecording.findUnique({
      where: { id: params.id },
      include: {
        artist: true,
      },
    })

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 })
    }

    // Check if the user is the artist or an admin
    if (recording.artist.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.streamRecording.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recording:", error)
    return NextResponse.json({ error: "Failed to delete recording" }, { status: 500 })
  }
}

