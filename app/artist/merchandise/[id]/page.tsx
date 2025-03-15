"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { ShoppingBagIcon, TrashIcon, PencilIcon } from "lucide-react"
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
import Image from "next/image"

interface Merchandise {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  stock: number
  artistId: string
}

export default function MerchandiseDetailPage({ params }: { params: { id: string } }) {
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ARTIST")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch merchandise data
  useEffect(() => {
    const fetchMerchandiseData = async () => {
      try {
        const response = await fetch(`/api/merchandise/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch merchandise data")
        }

        const data = await response.json()
        setMerchandise(data)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch merchandise data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMerchandiseData()
  }, [params.id, showNotification])

  const handleDeleteMerchandise = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/merchandise/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete merchandise")
      }

      showNotification({
        title: "Success",
        message: "Merchandise deleted successfully",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to delete merchandise",
        type: "error",
      })
      setIsDeleting(false)
    }
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

  if (!merchandise) {
    return (
      <AppLayout>
        <Navbar />
        <main className="py-8">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Merchandise Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The merchandise you're looking for doesn't exist or you don't have permission to view it.
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
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-white/20 hover:border-white/40"
              onClick={() => router.push(`/artist/merchandise/${merchandise.id}/edit`)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Item
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this merchandise item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteMerchandise}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                {merchandise.imageUrl ? (
                  <Image
                    src={merchandise.imageUrl || "/placeholder.svg"}
                    alt={merchandise.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <ShoppingBagIcon className="h-16 w-16 text-iridescent-3" />
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <h1 className="text-3xl font-bold mb-2">{merchandise.name}</h1>
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-iridescent-1">${merchandise.price.toFixed(2)}</p>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    merchandise.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {merchandise.stock > 0 ? `In Stock (${merchandise.stock})` : "Out of Stock"}
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{merchandise.description}</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

