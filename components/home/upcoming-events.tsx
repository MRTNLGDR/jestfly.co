import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  artistId: string
  artistName: string
}

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events = [] }: UpcomingEventsProps) {
  // Fallback to mock data if no events are provided
  const displayEvents =
    events.length > 0
      ? events
      : [
          {
            id: "1",
            title: "Virtual Concert: Luna Eclipse",
            date: "2023-12-15",
            time: "8:00 PM EST",
            location: "Online",
            artistId: "1",
            artistName: "Luna Eclipse",
          },
          {
            id: "2",
            title: "Album Release: Cosmic Drift",
            date: "2023-12-20",
            time: "7:00 PM EST",
            location: "Online",
            artistId: "2",
            artistName: "Cosmic Drift",
          },
          {
            id: "3",
            title: "Live Q&A with Neon Pulse",
            date: "2023-12-22",
            time: "6:30 PM EST",
            location: "Online",
            artistId: "3",
            artistName: "Neon Pulse",
          },
        ]

  return (
    <section className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Upcoming Events
        </h2>
        <Button variant="outline" className="border-white/20 hover:border-white/40" asChild>
          <Link href="/events">View All</Link>
        </Button>
      </div>
      <div className="space-y-6">
        {displayEvents.map((event) => (
          <GlassCard key={event.id} className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href={`/events/${event.id}`}>RSVP Now</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" className="border-white/20 hover:border-white/40" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
    </section>
  )
}

