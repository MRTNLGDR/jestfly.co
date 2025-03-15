import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { prisma } from "@/lib/db"
import { EventCard } from "@/components/artist/event-card"
import { CalendarIcon } from "lucide-react"

export default async function EventsPage() {
  // Fetch upcoming events
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      artist: true,
      attendees: true,
    },
  })

  // Group events by month
  const eventsByMonth: Record<string, typeof events> = {}

  events.forEach((event) => {
    const date = new Date(event.date)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = []
    }

    eventsByMonth[monthYear].push(event)
  })

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Upcoming Events
        </h1>

        {Object.keys(eventsByMonth).length > 0 ? (
          Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{monthYear}</h2>
              <div className="space-y-4">
                {monthEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date.toISOString()}
                    time={event.time}
                    location={event.location}
                    isVirtual={event.isVirtual}
                    streamUrl={event.streamUrl}
                    artistName={event.artist.stageName}
                    attendeeCount={event.attendees.length}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <GlassCard className="p-8 text-center">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Upcoming Events</h2>
            <p className="text-muted-foreground">
              There are no upcoming events scheduled at this time. Check back later!
            </p>
          </GlassCard>
        )}
      </main>
    </AppLayout>
  )
}

