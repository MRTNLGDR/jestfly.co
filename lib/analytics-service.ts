import { prisma } from "@/lib/db"

// Interface for stream analytics
export interface StreamAnalytics {
  eventId: string
  viewerCount: number
  peakViewers: number
  totalViews: number
  averageWatchTime: number
  chatMessages: number
  reactions: number
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
    other: number
  }
  locationBreakdown: {
    [country: string]: number
  }
  referrerBreakdown: {
    [referrer: string]: number
  }
}

// Service for managing stream analytics
export class AnalyticsService {
  private static instance: AnalyticsService

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  // Track a view for a stream
  public async trackView(eventId: string, userId?: string, data?: any): Promise<boolean> {
    try {
      await prisma.streamView.create({
        data: {
          eventId,
          userId,
          device: data?.device || "unknown",
          location: data?.location || "unknown",
          referrer: data?.referrer || "direct",
          duration: 0, // Will be updated when the user leaves
        },
      })

      return true
    } catch (error) {
      console.error("Error tracking view:", error)
      return false
    }
  }

  // Update view duration
  public async updateViewDuration(viewId: string, duration: number): Promise<boolean> {
    try {
      await prisma.streamView.update({
        where: { id: viewId },
        data: { duration },
      })

      return true
    } catch (error) {
      console.error("Error updating view duration:", error)
      return false
    }
  }

  // Track a chat message
  public async trackChatMessage(eventId: string, userId?: string): Promise<boolean> {
    try {
      await prisma.streamAnalytics.upsert({
        where: { eventId },
        update: {
          chatMessages: {
            increment: 1,
          },
        },
        create: {
          eventId,
          chatMessages: 1,
        },
      })

      return true
    } catch (error) {
      console.error("Error tracking chat message:", error)
      return false
    }
  }

  // Track a reaction
  public async trackReaction(eventId: string, userId?: string): Promise<boolean> {
    try {
      await prisma.streamAnalytics.upsert({
        where: { eventId },
        update: {
          reactions: {
            increment: 1,
          },
        },
        create: {
          eventId,
          reactions: 1,
        },
      })

      return true
    } catch (error) {
      console.error("Error tracking reaction:", error)
      return false
    }
  }

  // Update viewer count
  public async updateViewerCount(eventId: string, count: number): Promise<boolean> {
    try {
      const analytics = await prisma.streamAnalytics.findUnique({
        where: { eventId },
      })

      if (!analytics) {
        await prisma.streamAnalytics.create({
          data: {
            eventId,
            viewerCount: count,
            peakViewers: count,
          },
        })
      } else {
        await prisma.streamAnalytics.update({
          where: { eventId },
          data: {
            viewerCount: count,
            peakViewers: Math.max(analytics.peakViewers, count),
          },
        })
      }

      return true
    } catch (error) {
      console.error("Error updating viewer count:", error)
      return false
    }
  }

  // Get analytics for a stream
  public async getStreamAnalytics(eventId: string): Promise<StreamAnalytics | null> {
    try {
      const analytics = await prisma.streamAnalytics.findUnique({
        where: { eventId },
      })

      if (!analytics) {
        return null
      }

      // Get total views
      const totalViews = await prisma.streamView.count({
        where: { eventId },
      })

      // Get average watch time
      const views = await prisma.streamView.findMany({
        where: { eventId },
        select: { duration: true },
      })

      const totalDuration = views.reduce((sum, view) => sum + (view.duration || 0), 0)
      const averageWatchTime = views.length > 0 ? totalDuration / views.length : 0

      // Get device breakdown
      const devices = await prisma.streamView.groupBy({
        by: ["device"],
        where: { eventId },
        _count: true,
      })

      const deviceBreakdown = {
        desktop: 0,
        mobile: 0,
        tablet: 0,
        other: 0,
      }

      devices.forEach((device) => {
        if (device.device === "desktop") {
          deviceBreakdown.desktop = device._count
        } else if (device.device === "mobile") {
          deviceBreakdown.mobile = device._count
        } else if (device.device === "tablet") {
          deviceBreakdown.tablet = device._count
        } else {
          deviceBreakdown.other += device._count
        }
      })

      // Get location breakdown
      const locations = await prisma.streamView.groupBy({
        by: ["location"],
        where: { eventId },
        _count: true,
      })

      const locationBreakdown: { [country: string]: number } = {}

      locations.forEach((location) => {
        locationBreakdown[location.location] = location._count
      })

      // Get referrer breakdown
      const referrers = await prisma.streamView.groupBy({
        by: ["referrer"],
        where: { eventId },
        _count: true,
      })

      const referrerBreakdown: { [referrer: string]: number } = {}

      referrers.forEach((referrer) => {
        referrerBreakdown[referrer.referrer] = referrer._count
      })

      return {
        eventId,
        viewerCount: analytics.viewerCount,
        peakViewers: analytics.peakViewers,
        totalViews,
        averageWatchTime,
        chatMessages: analytics.chatMessages,
        reactions: analytics.reactions,
        deviceBreakdown,
        locationBreakdown,
        referrerBreakdown,
      }
    } catch (error) {
      console.error("Error getting stream analytics:", error)
      return null
    }
  }

  // Get analytics for an artist
  public async getArtistAnalytics(artistId: string): Promise<any> {
    try {
      // Get all events for the artist
      const events = await prisma.event.findMany({
        where: {
          artistId,
          isVirtual: true,
        },
        select: {
          id: true,
          title: true,
          date: true,
          streamStatus: true,
        },
      })

      // Get analytics for each event
      const eventAnalytics = await Promise.all(
        events.map(async (event) => {
          const analytics = await this.getStreamAnalytics(event.id)

          return {
            eventId: event.id,
            title: event.title,
            date: event.date,
            status: event.streamStatus,
            analytics: analytics || {
              viewerCount: 0,
              peakViewers: 0,
              totalViews: 0,
              averageWatchTime: 0,
              chatMessages: 0,
              reactions: 0,
              deviceBreakdown: {
                desktop: 0,
                mobile: 0,
                tablet: 0,
                other: 0,
              },
              locationBreakdown: {},
              referrerBreakdown: {},
            },
          }
        }),
      )

      // Calculate totals
      const totalViews = eventAnalytics.reduce((sum, event) => sum + event.analytics.totalViews, 0)
      const totalChatMessages = eventAnalytics.reduce((sum, event) => sum + event.analytics.chatMessages, 0)
      const totalReactions = eventAnalytics.reduce((sum, event) => sum + event.analytics.reactions, 0)

      // Calculate average watch time across all events
      const totalWatchTime = eventAnalytics.reduce((sum, event) => {
        return sum + event.analytics.averageWatchTime * event.analytics.totalViews
      }, 0)

      const averageWatchTime = totalViews > 0 ? totalWatchTime / totalViews : 0

      // Combine device breakdown
      const deviceBreakdown = {
        desktop: 0,
        mobile: 0,
        tablet: 0,
        other: 0,
      }

      eventAnalytics.forEach((event) => {
        deviceBreakdown.desktop += event.analytics.deviceBreakdown.desktop
        deviceBreakdown.mobile += event.analytics.deviceBreakdown.mobile
        deviceBreakdown.tablet += event.analytics.deviceBreakdown.tablet
        deviceBreakdown.other += event.analytics.deviceBreakdown.other
      })

      // Combine location breakdown
      const locationBreakdown: { [country: string]: number } = {}

      eventAnalytics.forEach((event) => {
        Object.entries(event.analytics.locationBreakdown).forEach(([country, count]) => {
          locationBreakdown[country] = (locationBreakdown[country] || 0) + (count as number)
        })
      })

      // Combine referrer breakdown
      const referrerBreakdown: { [referrer: string]: number } = {}

      eventAnalytics.forEach((event) => {
        Object.entries(event.analytics.referrerBreakdown).forEach(([referrer, count]) => {
          referrerBreakdown[referrer] = (referrerBreakdown[referrer] || 0) + (count as number)
        })
      })

      return {
        artistId,
        totalEvents: events.length,
        totalViews,
        averageWatchTime,
        totalChatMessages,
        totalReactions,
        deviceBreakdown,
        locationBreakdown,
        referrerBreakdown,
        events: eventAnalytics,
      }
    } catch (error) {
      console.error("Error getting artist analytics:", error)
      return null
    }
  }
}

// Export a singleton instance
export const analyticsService = AnalyticsService.getInstance()

