"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { ArtistSidebar } from "@/components/layout/artist-sidebar"
import { GlassCard } from "@/components/ui/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueSummary } from "@/components/artist/revenue-summary"
import { TransactionHistory } from "@/components/artist/transaction-history"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"

export default function ArtistMonetizationPage() {
  const [artistId, setArtistId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

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
      } catch (error: any) {
        showNotification({
          title: "Erro",
          message: error.message || "Falha ao carregar perfil de artista",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtistProfile()
  }, [isAuthenticated, router, showNotification])

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  // Redirect if user is not an artist
  if (user?.role !== "ARTIST" && !isLoading) {
    router.push("/")
    return null
  }

  return (
    <AppLayout>
      <Navbar />
      <div className="flex">
        <ArtistSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Monetização
          </h1>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-white/10 rounded w-1/4"></div>
              <div className="h-60 bg-white/10 rounded"></div>
            </div>
          ) : artistId ? (
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="transactions">Transações</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <RevenueSummary artistId={artistId} />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionHistory artistId={artistId} />
              </TabsContent>
            </Tabs>
          ) : (
            <GlassCard className="p-6">
              <p className="text-center">
                Perfil de artista não encontrado. Por favor, crie seu perfil de artista primeiro.
              </p>
            </GlassCard>
          )}
        </main>
      </div>
    </AppLayout>
  )
}

