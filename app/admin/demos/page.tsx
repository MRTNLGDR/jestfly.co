"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { FileAudioIcon, PlayIcon, PauseIcon, CheckIcon, XIcon } from "lucide-react"

interface Demo {
  id: string
  title: string
  description: string
  audioUrl: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  feedback?: string
  artistId: string
  createdAt: string
  artist: {
    user: {
      name: string
    }
  }
}

export default function AdminDemosPage() {
  const [demos, setDemos] = useState<Demo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDemo, setCurrentDemo] = useState<Demo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch demos
  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const response = await fetch("/api/demos")

        if (!response.ok) {
          throw new Error("Failed to fetch demos")
        }

        const data = await response.json()
        setDemos(data)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch demos",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDemos()
  }, [showNotification])

  const handleSelectDemo = (demo: Demo) => {
    setCurrentDemo(demo)
    setFeedback(demo.feedback || "")
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleApprove = async () => {
    if (!currentDemo) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/demos/${currentDemo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "APPROVED",
          feedback,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to approve demo")
      }

      // Update local state
      const updatedDemo = { ...currentDemo, status: "APPROVED" as const, feedback }
      setDemos(demos.map((demo) => (demo.id === currentDemo.id ? updatedDemo : demo)))
      setCurrentDemo(updatedDemo)

      showNotification({
        title: "Success",
        message: "Demo approved successfully",
        type: "success",
      })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to approve demo",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!currentDemo) return

    if (!feedback.trim()) {
      showNotification({
        title: "Error",
        message: "Please provide feedback when rejecting a demo",
        type: "error",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/demos/${currentDemo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED",
          feedback,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to reject demo")
      }

      // Update local state
      const updatedDemo = { ...currentDemo, status: "REJECTED" as const, feedback }
      setDemos(demos.map((demo) => (demo.id === currentDemo.id ? updatedDemo : demo)))
      setCurrentDemo(updatedDemo)

      showNotification({
        title: "Success",
        message: "Demo rejected successfully",
        type: "success",
      })
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to reject demo",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Demo Review Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-4">Demos</h2>

              {demos.length > 0 ? (
                <div className="space-y-2">
                  {demos.map((demo) => (
                    <div
                      key={demo.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentDemo?.id === demo.id
                          ? "border-iridescent-1 bg-white/5"
                          : "border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => handleSelectDemo(demo)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{demo.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
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
                      <p className="text-xs text-muted-foreground">By {demo.artist.user.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(demo.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileAudioIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No demos to review</p>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            {currentDemo ? (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{currentDemo.title}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentDemo.status === "APPROVED"
                        ? "bg-green-500/20 text-green-400"
                        : currentDemo.status === "REJECTED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {currentDemo.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">By {currentDemo.artist.user.name}</p>
                <p className="text-sm text-muted-foreground mb-6">Submitted on {formatDate(currentDemo.createdAt)}</p>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{currentDemo.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Audio</h3>
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

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Feedback</h3>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    placeholder="Provide feedback to the artist..."
                    className="bg-transparent border-white/20 focus:border-white/40 resize-none"
                    disabled={currentDemo.status !== "PENDING"}
                  />
                </div>

                {currentDemo.status === "PENDING" && (
                  <div className="flex space-x-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={isSubmitting}
                    >
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={handleReject}
                      disabled={isSubmitting || !feedback.trim()}
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center">
                <FileAudioIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-bold mb-2">No Demo Selected</h2>
                <p className="text-muted-foreground">Select a demo from the list to review it.</p>
              </GlassCard>
            )}
          </div>
        </div>

        {/* Audio player (hidden) */}
        {currentDemo?.audioUrl && (
          <audio
            src={currentDemo.audioUrl}
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

