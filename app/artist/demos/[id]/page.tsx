"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { PlayIcon, PauseIcon, TrashIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Demo {
  id: string
  title: string
  description: string
  audioUrl: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  feedback?: string
  artistId: string
  createdAt: string
}

export default function DemoDetailPage({ params }: { params: { id: string } }) {
  const [demo, setDemo] = useState<Demo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ARTIST")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch demo data
  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const response = await fetch(`/api/demos/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch demo data")
        }

        const data = await response.json()
        setDemo(data)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch demo data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDemoData()
  }, [params.id, showNotification])

  const handleDeleteDemo = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/demos/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete demo")
      }

      showNotification({
        title: "Success",
        message: "Demo deleted successfully",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to delete demo",
        type: "error",
      })
      setIsDeleting(false)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  if (isLoading) {
    return (
      <AppLayout>
        <Navbar />
        <main className="flex justify-center items-center min-h-[80vh]">
          <p>Loading...</p>
        </main>
      </AppLayout>
    )
  }

  if (!demo) {
    return (
      <AppLayout>
        <Navbar />
        <main className="py-8">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Demo Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The demo you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              onClick={() => router.push("/artist/dashboard")}
            >
              Back to Dashboard
            </Button>
          </GlassCard>
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            className="border-white/20 hover:border-white/40"
            onClick={() => router.push("/artist/dashboard")}
          >
            Back to Dashboard
          </Button>
          {demo.status === "PENDING" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Demo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this demo submission.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteDemo}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{demo.title}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                demo.status === "APPROVED"
                  ? "bg-green-500/20 text-green-400"
                  : demo.status === "REJECTED"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {demo.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Submitted on {formatDate(demo.createdAt)}</p>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">{demo.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Audio</h2>
            <div className="flex items-center p-4 border border-white/10 rounded-lg">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 mr-3" onClick={togglePlay}>
                {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
              </Button>
              <div className="flex-grow">
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>

          {demo.feedback && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Feedback</h2>
              <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                <p className="text-muted-foreground whitespace-pre-line">{demo.feedback}</p>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Audio player (hidden) */}
        {demo.audioUrl && (
          <audio
            src={demo.audioUrl}
            autoPlay={isPlaying}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </main>
    </AppLayout>
  )
}

