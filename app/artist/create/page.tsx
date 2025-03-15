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
import { MusicIcon } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { useFileUpload } from "@/hooks/use-file-upload"
import { UPLOAD_BUCKETS } from "@/lib/upload-service"
import Image from "next/image"

export default function CreateArtistProfilePage() {
  const [stageName, setStageName] = useState("")
  const [genre, setGenre] = useState("")
  const [bio, setBio] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Usar nosso novo hook de upload
  const {
    upload,
    reset: resetUpload,
    isUploading,
    progress,
    error: uploadError,
    url: coverImageUrl,
  } = useFileUpload({
    bucket: UPLOAD_BUCKETS.ARTIST_IMAGES,
    path: "profiles",
    onSuccess: (url) => {
      showNotification({
        title: "Sucesso",
        message: "Imagem enviada com sucesso",
        type: "success",
      })
    },
    onError: (error) => {
      showNotification({
        title: "Erro",
        message: error.message || "Falha ao enviar imagem",
        type: "error",
      })
    },
  })

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  // Redirect if user already has an artist profile
  if (user?.role === "ARTIST") {
    router.push("/artist/dashboard")
    return null
  }

  const handleFileUpload = async (file: File) => {
    try {
      await upload(file)
    } catch (error) {
      // Erro já tratado pelo hook
      console.error("Erro ao fazer upload:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageName,
          genre,
          bio,
          coverImage: coverImageUrl,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create artist profile")
      }

      showNotification({
        title: "Sucesso",
        message: "Seu perfil de artista foi criado!",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Erro",
        message: error.message || "Falha ao criar perfil de artista",
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
          Criar Perfil de Artista
        </h1>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            {coverImageUrl ? (
              <div className="relative h-40 w-40 rounded-full overflow-hidden">
                <Image src={coverImageUrl || "/placeholder.svg"} alt="Imagem de perfil" fill className="object-cover" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
                <MusicIcon className="h-10 w-10 text-iridescent-1" />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <FileUpload
                label="Imagem de perfil"
                accept="image/*"
                onChange={handleFileUpload}
                onClear={resetUpload}
                value={coverImageUrl || ""}
                isUploading={isUploading}
                progress={progress}
                error={uploadError || ""}
                helperText="Recomendado: 500x500px. JPG, PNG ou GIF."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stageName">Nome Artístico</Label>
              <Input
                id="stageName"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Gênero Musical</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="bg-transparent border-white/20 focus:border-white/40 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              disabled={isLoading || isUploading}
            >
              {isLoading ? "Criando Perfil..." : "Criar Perfil de Artista"}
            </Button>
          </form>
        </GlassCard>
      </main>
    </AppLayout>
  )
}

