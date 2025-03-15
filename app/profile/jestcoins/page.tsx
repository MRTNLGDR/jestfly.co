"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { CoinsIcon as CoinIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Transaction {
  id: string
  amount: number
  reason: string
  type: "CREDIT" | "DEBIT"
  createdAt: string
}

export default function JestCoinsPage() {
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch JestCoin data
  useEffect(() => {
    const fetchJestCoinData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch balance
        const balanceResponse = await fetch("/api/jestcoins")

        if (!balanceResponse.ok) {
          throw new Error("Failed to fetch JestCoin balance")
        }

        const balanceData = await balanceResponse.json()
        setBalance(balanceData.balance)

        // Fetch transactions
        const transactionsResponse = await fetch("/api/jestcoins/transactions")

        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch JestCoin transactions")
        }

        const transactionsData = await transactionsResponse.json()
        setTransactions(transactionsData)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch JestCoin data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJestCoinData()
  }, [isAuthenticated, showNotification])

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

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          JestCoins
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <div className="flex flex-col items-center">
                <CoinIcon className="h-16 w-16 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold mb-1">Your Balance</h2>
                <p className="text-3xl font-bold text-yellow-500 mb-4">{balance} JestCoins</p>

                <div className="w-full space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                    asChild
                  >
                    <Link href="/merch">Spend JestCoins</Link>
                  </Button>

                  <Button variant="outline" className="w-full border-white/20 hover:border-white/40" asChild>
                    <Link href="/profile">Back to Profile</Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6">Transaction History</h2>

              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-3 border border-white/10 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center">
                          {transaction.type === "CREDIT" ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <p className="font-medium">{transaction.reason}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.createdAt), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                      <p className={`font-bold ${transaction.type === "CREDIT" ? "text-green-500" : "text-red-500"}`}>
                        {transaction.type === "CREDIT" ? "+" : "-"}
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-white/10 rounded-lg">
                  <CoinIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't earned or spent any JestCoins yet. Start interacting with the platform to earn rewards!
                  </p>
                  <Button
                    className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                    asChild
                  >
                    <Link href="/">Explore Platform</Link>
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

