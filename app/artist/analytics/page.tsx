"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotification } from "@/contexts/notification-context"
import { UsersIcon, HeartIcon, ShoppingBagIcon, CalendarIcon } from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  totalFans: number
  totalFavorites: number
  totalEventAttendees: number
  totalPurchases: number
  recentFavorites: any[]
  recentAttendees: any[]
  recentPurchases: any[]
}

export default function ArtistAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ARTIST")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, isLoading, router])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!isAuthenticated || user?.role !== "ARTIST") {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/artist/analytics")

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data")
        }

        const data = await response.json()
        setAnalytics(data)
      } catch (error: any) {
        showNotification({
          title: "Error",
          message: error.message || "Failed to fetch analytics data",
          type: "error",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [isAuthenticated, user, showNotification])

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

  // For demo purposes, use mock data if analytics is null
  const analyticsData = analytics || {
    totalFans: 128,
    totalFavorites: 56,
    totalEventAttendees: 42,
    totalPurchases: 23,
    recentFavorites: [
      { id: "1", entityType: "album", entityName: "Summer Vibes", userName: "John Doe", date: "2023-04-15T12:30:00Z" },
      {
        id: "2",
        entityType: "artist",
        entityName: "Your Artist Profile",
        userName: "Jane Smith",
        date: "2023-04-14T10:15:00Z",
      },
      {
        id: "3",
        entityType: "track",
        entityName: "Sunset Dreams",
        userName: "Mike Johnson",
        date: "2023-04-13T18:45:00Z",
      },
    ],
    recentAttendees: [
      { id: "1", eventName: "Virtual Concert", userName: "Alice Brown", date: "2023-04-12T20:00:00Z" },
      { id: "2", eventName: "Album Release Party", userName: "Bob Wilson", date: "2023-04-10T19:30:00Z" },
      { id: "3", eventName: "Fan Meetup", userName: "Carol Davis", date: "2023-04-08T15:00:00Z" },
    ],
    recentPurchases: [
      { id: "1", itemName: "Signed Poster", userName: "David Miller", amount: 25.99, date: "2023-04-11T14:20:00Z" },
      {
        id: "2",
        itemName: "Limited Edition T-Shirt",
        userName: "Emma Wilson",
        amount: 34.99,
        date: "2023-04-09T11:10:00Z",
      },
      {
        id: "3",
        itemName: "Digital Album Download",
        userName: "Frank Thomas",
        amount: 9.99,
        date: "2023-04-07T09:45:00Z",
      },
    ],
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Artist Analytics
          </h1>
          <Button variant="outline" className="border-white/20 hover:border-white/40" asChild>
            <Link href="/artist/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <UsersIcon className="h-6 w-6 text-iridescent-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Fans</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalFans}</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <HeartIcon className="h-6 w-6 text-iridescent-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Favorites</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalFavorites}</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <CalendarIcon className="h-6 w-6 text-iridescent-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Event Attendees</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalEventAttendees}</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white/10 mr-4">
                <ShoppingBagIcon className="h-6 w-6 text-iridescent-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Purchases</p>
                <h3 className="text-2xl font-bold">{analyticsData.totalPurchases}</h3>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <HeartIcon className="h-5 w-5 mr-2" />
              Recent Favorites
            </h3>
            {analyticsData.recentFavorites.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentFavorites.map((favorite) => (
                  <div key={favorite.id} className="p-3 border border-white/10 rounded-lg">
                    <p className="font-medium">{favorite.entityName}</p>
                    <p className="text-xs text-muted-foreground">
                      Favorited by {favorite.userName} • {new Date(favorite.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent favorites</p>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Recent Event Attendees
            </h3>
            {analyticsData.recentAttendees.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentAttendees.map((attendee) => (
                  <div key={attendee.id} className="p-3 border border-white/10 rounded-lg">
                    <p className="font-medium">{attendee.eventName}</p>
                    <p className="text-xs text-muted-foreground">
                      Attended by {attendee.userName} • {new Date(attendee.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent event attendees</p>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Recent Purchases
            </h3>
            {analyticsData.recentPurchases.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="p-3 border border-white/10 rounded-lg">
                    <p className="font-medium">{purchase.itemName}</p>
                    <p className="text-xs text-muted-foreground">
                      Purchased by {purchase.userName} • ${purchase.amount.toFixed(2)} •{" "}
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent purchases</p>
            )}
          </GlassCard>
        </div>
      </main>
    </AppLayout>
  )
}

