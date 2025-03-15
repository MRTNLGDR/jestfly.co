import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { analyticsService } from "@/lib/analytics-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"

async function getArtistId(userId: string) {
  const artist = await prisma.artist.findUnique({
    where: { userId },
    select: { id: true },
  })

  return artist?.id
}

async function getStreamingAnalytics(artistId: string) {
  return analyticsService.getArtistAnalytics(artistId)
}

export default async function StreamingAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const artistId = await getArtistId(session.user.id)

  if (!artistId) {
    redirect("/artist/create")
  }

  const analytics = await getStreamingAnalytics(artistId)

  // Prepare data for charts
  const eventViewsData = analytics.events.map((event) => ({
    name: event.title,
    views: event.analytics.totalViews,
    date: format(new Date(event.date), "MMM d"),
  }))

  const deviceData = [
    { name: "Desktop", value: analytics.deviceBreakdown.desktop },
    { name: "Mobile", value: analytics.deviceBreakdown.mobile },
    { name: "Tablet", value: analytics.deviceBreakdown.tablet },
    { name: "Other", value: analytics.deviceBreakdown.other },
  ]

  const locationData = Object.entries(analytics.locationBreakdown).map(([country, count]) => ({
    name: country,
    value: count as number,
  }))

  const referrerData = Object.entries(analytics.referrerBreakdown).map(([referrer, count]) => ({
    name: referrer === "direct" ? "Direct" : referrer,
    value: count as number,
  }))

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Streaming Analytics</h1>
        <p className="text-muted-foreground">View analytics and insights for your live streams</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">Across all streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Watch Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(analytics.averageWatchTime / 60)}m {Math.floor(analytics.averageWatchTime % 60)}s
            </div>
            <p className="text-xs text-muted-foreground">Per viewer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalChatMessages}</div>
            <p className="text-xs text-muted-foreground">Across all streams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Live streams hosted</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views" className="space-y-6">
        <TabsList>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Views by Event</CardTitle>
              <CardDescription>Total views for each of your live streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventViewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="views" name="Views" fill="var(--color-views)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Viewers by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} views`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Breakdown</CardTitle>
                <CardDescription>Viewers by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} views`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Referrer Breakdown</CardTitle>
              <CardDescription>Where your viewers are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    value: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={referrerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" name="Views" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Detailed analytics for each of your live streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.events.map((event) => (
                  <Card key={event.eventId} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant={event.status === "LIVE" ? "destructive" : "outline"}>{event.status}</Badge>
                      </div>
                      <CardDescription>{format(new Date(event.date), "MMMM d, yyyy")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Views</p>
                          <p className="text-lg font-semibold">{event.analytics.totalViews}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Peak Viewers</p>
                          <p className="text-lg font-semibold">{event.analytics.peakViewers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Chat Messages</p>
                          <p className="text-lg font-semibold">{event.analytics.chatMessages}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. Watch Time</p>
                          <p className="text-lg font-semibold">
                            {Math.floor(event.analytics.averageWatchTime / 60)}m{" "}
                            {Math.floor(event.analytics.averageWatchTime % 60)}s
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

