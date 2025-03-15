"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { CoinsIcon as CoinIcon } from "lucide-react"

export function JestCoinBalance() {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchBalance = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/jestcoins")

        if (!response.ok) {
          throw new Error("Failed to fetch JestCoin balance")
        }

        const data = await response.json()
        setBalance(data.balance)
      } catch (error) {
        console.error("Error fetching JestCoin balance:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [isAuthenticated])

  if (!isAuthenticated || isLoading || balance === null) {
    return null
  }

  return (
    <Button variant="outline" size="sm" className="border-yellow-500/30 hover:border-yellow-500/50 text-yellow-500">
      <CoinIcon className="h-4 w-4 mr-1 text-yellow-500" />
      <span>{balance} JestCoins</span>
    </Button>
  )
}

