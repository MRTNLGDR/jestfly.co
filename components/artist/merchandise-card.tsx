"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

interface MerchandiseCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
  artistId: string
}

export function MerchandiseCard({ id, name, price, imageUrl, artistId }: MerchandiseCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      imageUrl,
      quantity: 1,
    })
  }

  return (
    <GlassCard className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square">
        {imageUrl ? (
          <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <ShoppingBagIcon className="h-16 w-16 text-iridescent-3" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate">{name}</h3>
        <p className="text-lg font-bold text-iridescent-1 mb-2">${price.toFixed(2)}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-white/20 hover:border-white/40" asChild>
            <Link href={`/artists/${artistId}/merchandise/${id}`}>View</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

