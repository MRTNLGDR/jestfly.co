"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { CoinsIcon as CoinIcon } from "lucide-react"
import { awardJestCoins, JESTCOIN_REWARDS } from "@/lib/jestcoins"

export function DailyLoginReward() {
  const [hasClaimedToday, setHasClaimedToday] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()

  useEffect(() => {
    if (!isAuthenticated) return

    // Check if user has already claimed today's reward
    const lastClaimed = localStorage.getItem("jestfly-daily-reward-claimed")
    const today = new Date().toDateString()

    if (lastClaimed !== today) {
      setHasClaimedToday(false)
    }
  }, [isAuthenticated])

  const claimDailyReward = async () => {
    if (!isAuthenticated || hasClaimedToday) return

    setIsLoading(true)

    try {
      const result = await awardJestCoins(JESTCOIN_REWARDS.DAILY_LOGIN, "Daily login reward")

      if (result?.success) {
        // Mark as claimed for today
        localStorage.setItem("jestfly-daily-reward-claimed", new Date().toDateString())
        setHasClaimedToday(true)

        showNotification({
          title: "Daily Reward Claimed!",
          message: `You've earned ${JESTCOIN_REWARDS.DAILY_LOGIN} JestCoins for logging in today.`,
          type: "success",
        })
      } else {
        throw new Error("Failed to claim daily reward")
      }
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error.message || "Failed to claim daily reward",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || hasClaimedToday) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
        onClick={claimDailyReward}
        disabled={isLoading}
      >
        <CoinIcon className="h-4 w-4 mr-2" />
        {isLoading ? "Claiming..." : "Claim Daily Reward"}
      </Button>
    </div>
  )
}

