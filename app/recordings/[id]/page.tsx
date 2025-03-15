import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { recordingService } from "@/lib/recording-service"
import { RecordingPlayer } from "@/components/events/recording-player"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Download, User } from "lucide-react"
import { format } from "date-fns"

async function getRecording(id: string) {
  const recording = await prisma.streamRecording.findUnique({
    where: { id },
    include: {
      event: {
        include: {
          artist: true,
        },
      },
    },
  })

  return recording
}

export default async function RecordingPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const recording = await getRecording(params.id)

  if (!recording) {
    notFound()
  }

  // Check if the recording is public or if the user has access
  if (!recording.isPublic) {
    // If not public, check if the user is the artist or an admin
    if (!session?.user) {
      notFound()
    }

    const isArtist = recording.event.artist.userId === session.user.id
    const isAdmin = session.user.role === "ADMIN"

    if (!isArtist && !isAdmin) {
      notFound()
    }
  }

  // Format duration
  const formattedDuration = recording.duration ? recordingService.formatDuration(recording.duration) : "00:00:00"

  // Format file size
  const formattedFileSize = recording.fileSize
    ? recordingService.formatFileSize(recording.fileSize * 1024 * 1024) // Convert MB to bytes
    : "Unknown"

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <a href={`/events/${recording.eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </a>
        </Button>
        <h1 className="text-3xl font-bold">{recording.title}</h1>
        <p className="text-muted-foreground">
          Recording from {recording.event.title} by {recording.event.artist.stageName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recording Player */}
          <RecordingPlayer
            recordingUrl={recording.storageUrl || ""}
            title={recording.title}
            artistName={recording.event.artist.stageName}
            thumbnailUrl={recording.event.thumbnailUrl}
          />

          {/* Recording Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Recording</h2>
              <p className="whitespace-pre-line">{recording.description || recording.event.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recording Info */}
          <Card>
            <CardHeader>
              <CardTitle>Recording Details</CardTitle>
              <CardDescription>Information about this recording</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Recorded on {format(recording.createdAt, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Duration: {formattedDuration}</span>
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Size: {formattedFileSize}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Artist: {recording.event.artist.stageName}</span>
              </div>

              <Separator />

              <Button className="w-full" asChild>
                <a href={`/artists/${recording.event.artist.id}`}>View Artist Profile</a>
              </Button>
            </CardContent>
          </Card>

          {/* More Recordings */}
          <Card>
            <CardHeader>
              <CardTitle>More Recordings</CardTitle>
              <CardDescription>Other recordings from {recording.event.artist.stageName}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

