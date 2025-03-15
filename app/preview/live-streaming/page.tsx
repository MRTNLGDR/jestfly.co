import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Video,
  MessageSquare,
  Users,
  Clock,
  Calendar,
  BarChart3,
  Coins,
  Download,
  Play,
  Sparkles,
} from "lucide-react"

export default function LiveStreamingPreviewPage() {
  return (
    <AppLayout>
      <Navbar />
      <main className="container py-8">
        <section className="mb-16">
          <GlassCard className="p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
              Live Streaming
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
              Connect with your fans through high-quality live performances and interactive events
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/live">Watch Live Streams</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
                <Link href="/artist/streaming">Start Streaming</Link>
              </Button>
            </div>
          </GlassCard>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Streaming Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Video className="h-8 w-8 text-iridescent-1" />}
              title="HD Live Streaming"
              description="Stream in high definition with low latency for the best quality experience"
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-iridescent-2" />}
              title="Live Chat"
              description="Interact with your audience in real-time through our integrated chat system"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-iridescent-3" />}
              title="Virtual Meet & Greets"
              description="Host exclusive fan meetups before or after your main performance"
            />
            <FeatureCard
              icon={<Download className="h-8 w-8 text-iridescent-1" />}
              title="Recordings & Replays"
              description="Automatically record your streams for fans who couldn't attend live"
            />
            <FeatureCard
              icon={<Coins className="h-8 w-8 text-iridescent-2" />}
              title="Monetization Options"
              description="Sell tickets, accept tips, or offer exclusive content to subscribers"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-iridescent-3" />}
              title="Streaming Analytics"
              description="Track viewership, engagement, and revenue with detailed analytics"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            How It Works
          </h2>

          <Tabs defaultValue="viewer" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="viewer">For Viewers</TabsTrigger>
              <TabsTrigger value="streamer">For Streamers</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer">
              <ScreenPreview
                title="Watch Live Performances"
                description="Enjoy high-quality live streams from your favorite artists"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "HD video and audio streaming",
                  "Real-time chat with artists and other fans",
                  "Send virtual gifts and tips during performances",
                  "Access to recordings if you miss the live event",
                ]}
              />
            </TabsContent>

            <TabsContent value="streamer">
              <ScreenPreview
                title="Stream to Your Fans"
                description="Easily set up and manage your live streaming events"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Simple streaming setup with our browser-based studio",
                  "Schedule and promote upcoming streams",
                  "Monitor chat and engage with your audience",
                  "Track performance metrics in real-time",
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-4">Upcoming Live Events</h3>
              <div className="space-y-4">
                <EventItem
                  title="Virtual Concert: Luna Eclipse"
                  artist="Luna Eclipse"
                  date="March 20, 2025"
                  time="8:00 PM EST"
                  viewers={1200}
                />
                <EventItem
                  title="Album Release Party"
                  artist="Cosmic Drift"
                  date="March 25, 2025"
                  time="7:00 PM EST"
                  viewers={850}
                />
                <EventItem
                  title="Acoustic Session & Q&A"
                  artist="Neon Pulse"
                  date="April 2, 2025"
                  time="6:30 PM EST"
                  viewers={650}
                />
                <EventItem
                  title="Live Collaboration"
                  artist="Crystal Echoes & Stellar Wave"
                  date="April 10, 2025"
                  time="9:00 PM EST"
                  viewers={1500}
                />
              </div>
              <Button
                className="w-full mt-6 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/events">View All Events</Link>
              </Button>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-4">Recent Recordings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RecordingItem title="Live from Studio B" artist="Luna Eclipse" duration="1:24:36" views={3200} />
                <RecordingItem title="Acoustic Set" artist="Cosmic Drift" duration="58:12" views={1800} />
                <RecordingItem title="Fan Appreciation Night" artist="Neon Pulse" duration="1:12:45" views={2400} />
                <RecordingItem title="New Singles Preview" artist="Crystal Echoes" duration="45:30" views={1600} />
              </div>
              <Button
                className="w-full mt-6 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/recordings">Browse Recordings</Link>
              </Button>
            </GlassCard>
          </div>
        </section>

        <section>
          <GlassCard className="p-8 text-center">
            <Sparkles className="h-16 w-16 mx-auto text-iridescent-2 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Go Live?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Start streaming to your fans or discover new artists streaming live right now
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/artist/streaming">Start Streaming</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
                <Link href="/live">Watch Live</Link>
              </Button>
            </div>
          </GlassCard>
        </section>
      </main>
    </AppLayout>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <GlassCard className="p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground flex-grow">{description}</p>
        <div className="mt-4">
          <Button variant="link" className="p-0 h-auto text-iridescent-1 hover:text-iridescent-2">
            Learn more <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

function ScreenPreview({
  title,
  description,
  imageSrc,
  features,
}: {
  title: string
  description: string
  imageSrc: string
  features: string[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="p-1 rounded-full bg-iridescent-1/20 mr-3 mt-0.5">
                <ArrowRight className="h-4 w-4 text-iridescent-1" />
              </div>
              <p>{feature}</p>
            </div>
          ))}
        </div>
        <Button
          className="mt-6 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
          asChild
        >
          <Link href="/live">Try This Feature</Link>
        </Button>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60"></div>
        <Badge className="absolute top-4 right-4 bg-iridescent-1/80">Preview</Badge>
      </div>
    </div>
  )
}

function EventItem({
  title,
  artist,
  date,
  time,
  viewers,
}: {
  title: string
  artist: string
  date: string
  time: string
  viewers: number
}) {
  return (
    <div className="flex items-center p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{artist}</p>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span className="mr-3">{date}</span>
          <Clock className="h-3 w-3 mr-1" />
          <span>{time}</span>
        </div>
      </div>
      <div className="text-right">
        <Badge variant="outline" className="bg-iridescent-1/10">
          <Users className="h-3 w-3 mr-1" />
          {viewers} interested
        </Badge>
      </div>
    </div>
  )
}

function RecordingItem({
  title,
  artist,
  duration,
  views,
}: {
  title: string
  artist: string
  duration: string
  views: number
}) {
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden group">
      <Image src="/placeholder.svg?height=120&width=200" alt={title} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="secondary" className="rounded-full">
          <Play className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <h4 className="font-medium text-sm truncate">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
          <span>{duration}</span>
          <span>{views.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  )
}

