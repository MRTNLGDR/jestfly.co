import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Play } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { recordingService } from "@/lib/recording-service"

async function getPublicRecordings() {
  const recordings = await prisma.streamRecording.findMany({
    where: {
      isPublic: true,
      status: "READY",
    },
    include: {
      event: {
        include: {
          artist: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  })

  return recordings
}

async function getUserRecordings(userId: string) {
  const artist = await prisma.artist.findUnique({
    where: { userId },
  })

  if (!artist) {
    return []
  }

  const recordings = await prisma.streamRecording.findMany({
    where: {
      artistId: artist.id,
    },
    include: {
      event: {
        include: {
          artist: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return recordings
}

export default async function RecordingsPage() {
  const session = await getServerSession(authOptions)
  const publicRecordings = await getPublicRecordings()
  const userRecordings = session?.user ? await getUserRecordings(session.user.id) : []

  const isArtist = session?.user?.role === "ARTIST" && userRecordings.length > 0

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recordings</h1>
        <p className="text-muted-foreground">Watch recordings of past live streams from your favorite artists</p>
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Recordings</TabsTrigger>
          {isArtist && <TabsTrigger value="my-recordings">My Recordings</TabsTrigger>}
        </TabsList>

        <TabsContent value="recent" className="space-y-6">
          {publicRecordings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No recordings available yet</h3>
              <p className="text-muted-foreground mt-2">Check back later for recordings of live streams</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicRecordings.map((recording) => (
                <RecordingCard key={recording.id} recording={recording} />
              ))}
            </div>
          )}
        </TabsContent>

        {isArtist && (
          <TabsContent value="my-recordings" className="space-y-6">
            {userRecordings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No recordings available yet</h3>
                <p className="text-muted-foreground mt-2">Your stream recordings will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecordings.map((recording) => (
                  <RecordingCard key={recording.id} recording={recording} />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function RecordingCard({ recording }: { recording: any }) {
  // Format duration
  const formattedDuration = recording.duration ? recordingService.formatDuration(recording.duration) : "00:00:00"

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={recording.event.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
          alt={recording.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <Badge variant="secondary" className="absolute top-2 right-2 bg-black/70 text-white">
          {formattedDuration}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{recording.title}</CardTitle>
        <CardDescription>{recording.event.artist.stageName}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{format(new Date(recording.createdAt), "MMM d, yyyy")}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <a href={`/recordings/${recording.id}`}>Watch Recording</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

