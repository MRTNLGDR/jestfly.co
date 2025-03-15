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
import { ShoppingBagIcon } from "lucide-react"

export default function CreateMerchandisePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [stock, setStock] = useState("1")
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

      const response = await fetch("/api/merchandise", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create merchandise")
      }

      showNotification({
        title: "Success",
        message: "Your merchandise has been created!",
        type: "success",
      })

      router.push("/artist/dashboard")
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to create merchandise",
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
          Create New Merchandise
        </h1>

        <GlassCard className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
              <ShoppingBagIcon className="h-10 w-10 text-iridescent-3" />
            </div>
          </div>

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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Creating Item..." : "Create Item"}
            </Button>
          </form>
        </GlassCard>
      </main>
    </AppLayout>
  )
}

