"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCartIcon, MinusIcon, PlusIcon } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useNotification } from "@/contexts/notification-context"

interface Merchandise {
  id: string
  name: string
  price: number
  imageUrl: string
  stock: number
}

interface AddToCartButtonProps {
  merchandise: Merchandise
}

export function AddToCartButton({ merchandise }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { showNotification } = useNotification()

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value) || value < 1) {
      setQuantity(1)
    } else if (value > merchandise.stock) {
      setQuantity(merchandise.stock)
    } else {
      setQuantity(value)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < merchandise.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: merchandise.id,
      name: merchandise.name,
      price: merchandise.price,
      imageUrl: merchandise.imageUrl,
      quantity,
    })

    showNotification({
      title: "Added to Cart",
      message: `${quantity} x ${merchandise.name} added to your cart`,
      type: "success",
    })
  }

  if (merchandise.stock <= 0) {
    return (
      <Button className="w-full bg-gray-500 cursor-not-allowed" disabled>
        Out of Stock
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-white/20"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          max={merchandise.stock}
          value={quantity}
          onChange={handleQuantityChange}
          className="h-10 w-20 mx-2 text-center bg-transparent border-white/20"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-white/20"
          onClick={increaseQuantity}
          disabled={quantity >= merchandise.stock}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
        onClick={handleAddToCart}
      >
        <ShoppingCartIcon className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  )
}

