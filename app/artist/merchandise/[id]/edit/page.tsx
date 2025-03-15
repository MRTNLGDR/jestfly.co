"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { ShoppingBagIcon } from "lucide-react"
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

export default function EditMerchandisePage({ params }: { params: { id: string } }) {
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [stock, setStock] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
        setName(data.name)
        setDescription(data.description)
        setPrice(data.price.toString())
        setImageUrl(data.imageUrl)
        setStock(data.stock.toString())
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!merchandise) throw new Error("Merchandise not found")

      // Validate price
      const priceValue = Number.parseFloat(price)
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error("Price must be a positive number")
      }

      // Validate stock
      const stockValue = Number.parseInt(stock)
      if (isNaN(stockValue) || stockValue < 0) {
        throw new Error("Stock must be a non-negative number")
      }

      const response = await fetch(`/api/merchandise/${merchandise.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
          imageUrl,
          stock,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update merchandise")
      }

      showNotification({
        title: "Success",
        message: "Merchandise updated successfully",
        type: "success",
      })

      router.push(`/artist/merchandise/${merchandise.id}`)
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update merchandise",
        type: "error",
      })
    } finally {
      setIsSaving(false)
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
              The merchandise you're looking for doesn't exist or you don't have permission to edit it.
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Edit Merchandise
          </h1>
          <Button
            variant="outline"
            className="border-white/20 hover:border-white/40"
            onClick={() => router.push(`/artist/merchandise/${merchandise.id}`)}
          >
            Cancel
          </Button>
        </div>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          {imageUrl && (
            <div className="relative h-40 w-40 mx-auto mb-8 rounded-lg overflow-hidden">
              <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
          )}

          {!imageUrl && (
            <div className="flex items-center justify-center mb-8">
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
                <ShoppingBagIcon className="h-10 w-10 text-iridescent-3" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                className="bg-transparent border-white/20 focus:border-white/40 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="bg-transparent border-white/20 focus:border-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="bg-transparent border-white/20 focus:border-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
                className="bg-transparent border-white/20 focus:border-white/40"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 hover:border-white/40"
                onClick={() => router.push(`/artist/merchandise/${merchandise.id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </main>
    </AppLayout>
  )
}

