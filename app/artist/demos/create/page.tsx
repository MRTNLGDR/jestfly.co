"use client"

import type React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { FileAudioIcon } from "lucide-react"

export default function SubmitDemoPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated or not an artist
  if (!isAuthenticated || user?.role !== "ARTIST") {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/demos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          audioUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit demo")
      }

      showNotification({
        title: "Success",
        message: "Your demo has been submitted for review!",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to submit demo",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Submit New Demo
        </h1>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
              <FileAudioIcon className="h-10 w-10 text-iridescent-1" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Demo Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                placeholder="Tell us about your demo, your inspiration, and what you're looking for in terms of feedback."
                className="bg-transparent border-white/20 focus:border-white/40 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audioUrl">Audio URL</Label>
              <Input
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Submitting Demo..." : "Submit Demo"}
            </Button>
          </form>
        </GlassCard>
      </main>
    </AppLayout>
  )
}

