"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { ArtistSidebar } from "@/components/layout/artist-sidebar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { FileUpload } from "@/components/ui/file-upload"
import { useFileUpload } from "@/hooks/use-file-upload"
import { UPLOAD_BUCKETS } from "@/lib/upload-service"
import { TrackUploadForm, type Track } from "@/components/artist/track-upload-form"
import Image from "next/image"
import { AlbumIcon } from "lucide-react"

export default function CreateAlbumPage() {
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [tracks, setTracks] = useState<Track[]>([])
  const [artistId, setArtistId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArtist, setIsLoadingArtist] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Usar hook de upload para a capa do álbum
  const {
    upload,
    reset: resetUpload,
    isUploading,
    progress,
    error: uploadError,
    url: coverImageUrl,
  } = useFileUpload({
    bucket: UPLOAD_BUCKETS.ALBUM_COVERS,
    path: "covers",
    onSuccess: (url) => {
      showNotification({
        title: "Sucesso",
        message: "Imagem de capa enviada com sucesso",
        type: "success",
      })
    },
    onError: (error) => {
      showNotification({
        title: "Erro",
        message: error.message || "Falha ao enviar imagem de capa",
        type: "error",
      })
    },
  })

  // Fetch artist profile
  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (!isAuthenticated) return

      try {
        const response = await fetch("/api/artists/me")

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/artist/create")
            return
          }
          throw new Error("Failed to fetch artist profile")
        }

        const artist = await response.json()
        setArtistId(artist.id)
      } catch (error) {
        showNotification({
          title: "Erro",
          message: "Falha ao carregar perfil de artista",
          type: "error",
        })
      } finally {
        setIsLoadingArtist(false)
      }
    }

    fetchArtistProfile()
  }, [isAuthenticated, router, showNotification])

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  // Handle cover image upload
  const handleCoverUpload = async (file: File) => {
    try {
      await upload(file)
    } catch (error) {
      // Erro já tratado pelo hook
      console.error("Erro ao fazer upload da capa:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulário
    if (!title || !releaseYear) {
      showNotification({
        title: "Validação",
        message: "Preencha todos os campos obrigatórios",
        type: "error",
      })
      return
    }

    if (tracks.length === 0) {
      showNotification({
        title: "Validação",
        message: "Adicione pelo menos uma faixa ao álbum",
        type: "error",
      })
      return
    }

    for (const track of tracks) {
      if (!track.title || !track.audioUrl) {
        showNotification({
          title: "Validação",
          message: "Todas as faixas devem ter título e arquivo de áudio",
          type: "error",
        })
        return
      }
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          releaseYear,
          coverImage: coverImageUrl,
          tracks,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create album")
      }

      const album = await response.json()

      showNotification({
        title: "Sucesso",
        message: "Álbum criado com sucesso!",
        type: "success",
      })

      router.push(`/artist/albums/${album.id}`)
    } catch (error: any) {
      showNotification({
        title: "Erro",
        message: error.message || "Falha ao criar álbum",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingArtist) {
    return (
      <AppLayout>
        <Navbar />
        <div className="flex">
          <ArtistSidebar />
          <main className="flex-1 p-6">
            <p>Carregando...</p>
          </main>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Navbar />
      <div className="flex">
        <ArtistSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Criar Novo Álbum
          </h1>

          <GlassCard className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    {coverImageUrl ? (
                      <div className="relative h-48 w-48 rounded-md overflow-hidden">
                        <Image
                          src={coverImageUrl || "/placeholder.svg"}
                          alt="Capa do álbum"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-48 rounded-md bg-white/10 flex items-center justify-center">
                        <AlbumIcon className="h-16 w-16 text-iridescent-1" />
                      </div>
                    )}
                  </div>

                  <FileUpload
                    label="Capa do Álbum"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    onClear={resetUpload}
                    value={coverImageUrl || ""}
                    isUploading={isUploading}
                    progress={progress}
                    error={uploadError || ""}
                    helperText="Recomendado: 500x500px. JPG ou PNG."
                  />

                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Álbum</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-transparent border-white/20 focus:border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="releaseYear">Ano de Lançamento</Label>
                    <Input
                      id="releaseYear"
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(e.target.value)}
                      required
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="bg-transparent border-white/20 focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {artistId && <TrackUploadForm tracks={tracks} onChange={setTracks} artistId={artistId} />}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/artist/albums")}
                  className="border-white/20 hover:border-white/40"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? "Criando Álbum..." : "Criar Álbum"}
                </Button>
              </div>
            </form>
          </GlassCard>
        </main>
      </div>
    </AppLayout>
  )
}

