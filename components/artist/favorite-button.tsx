"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { awardJestCoins, JESTCOIN_REWARDS } from "@/lib/jestcoins"

interface FavoriteButtonProps {
  entityId: string
  entityType: string
  initialFavorited: boolean
}

export function FavoriteButton({ entityId, entityType, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      showNotification({
        title: "Authentication Required",
        message: "Please sign in to favorite items",
        type: "info",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityId,
          entityType,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update favorite")
      }

      setIsFavorited(!isFavorited)

      // Award JestCoins for adding to favorites (only when adding, not removing)
      if (!isFavorited) {
        const coinResult = await awardJestCoins(JESTCOIN_REWARDS.FAVORITE_ITEM, `Added ${entityType} to favorites`)

        if (coinResult?.success) {
          showNotification({
            title: "Added to Favorites",
            message: `Added to your favorites! You earned ${JESTCOIN_REWARDS.FAVORITE_ITEM} JestCoins.`,
            type: "success",
          })
        } else {
          showNotification({
            title: "Added to Favorites",
            message: `Added to your favorites`,
            type: "success",
          })
        }
      } else {
        showNotification({
          title: "Removed from Favorites",
          message: `Removed from your favorites`,
          type: "success",
        })
      }
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update favorite",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full h-10 w-10 ${
        isFavorited ? "bg-red-500/20 text-red-400 border-red-400" : "bg-white/10 border-white/20 hover:border-white/40"
      }`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <HeartIcon className={`h-5 w-5 ${isFavorited ? "fill-red-400" : ""}`} />
    </Button>
  )
}

