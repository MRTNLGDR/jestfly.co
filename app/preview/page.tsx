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
  Music,
  Calendar,
  ShoppingBag,
  Users,
  FileAudio,
  Video,
  BarChart3,
  Coins,
  MessageSquare,
  LayoutDashboard,
  Sparkles,
} from "lucide-react"

export default function PreviewPage() {
  return (
    <AppLayout>
      <Navbar />
      <main className="container py-8">
        <section className="mb-16">
          <GlassCard className="p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
              Jestfly Artist Fan Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
              Connect artists with fans through exclusive content, virtual events, and limited edition merchandise
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </GlassCard>
        </section>

        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Music className="h-8 w-8 text-iridescent-1" />}
              title="Artist Profiles"
              description="Create and customize your artist profile with music, bio, and media"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-iridescent-2" />}
              title="Virtual Events"
              description="Host and attend virtual concerts, Q&As, and meet & greets"
            />
            <FeatureCard
              icon={<ShoppingBag className="h-8 w-8 text-iridescent-3" />}
              title="Merchandise Store"
              description="Sell exclusive merchandise directly to your fans"
            />
            <FeatureCard
              icon={<Video className="h-8 w-8 text-iridescent-1" />}
              title="Live Streaming"
              description="Stream live performances with real-time chat and audience interaction"
            />
            <FeatureCard
              icon={<FileAudio className="h-8 w-8 text-iridescent-2" />}
              title="Demo Submissions"
              description="Submit demos for feedback and potential promotion opportunities"
            />
            <FeatureCard
              icon={<LayoutDashboard className="h-8 w-8 text-iridescent-3" />}
              title="Career Planner"
              description="Plan your music career with interactive tools and templates"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-iridescent-1" />}
              title="Analytics"
              description="Track performance metrics and audience engagement"
            />
            <FeatureCard
              icon={<Coins className="h-8 w-8 text-iridescent-2" />}
              title="JestCoins"
              description="Reward system for platform engagement and exclusive content"
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-iridescent-3" />}
              title="Fan Interaction"
              description="Comment, like, and interact with your favorite artists"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Platform Preview
          </h2>

          <Tabs defaultValue="home" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="artist">Artist</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <ScreenPreview
                title="Home Page"
                description="Discover featured artists, upcoming events, and new releases"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Featured artists carousel",
                  "Upcoming events section",
                  "New releases and trending content",
                  "Personalized recommendations",
                ]}
              />
            </TabsContent>

            <TabsContent value="artist">
              <ScreenPreview
                title="Artist Profile"
                description="Showcase your music, events, and merchandise to fans"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Customizable artist profile",
                  "Music catalog with streaming",
                  "Upcoming events and tour dates",
                  "Exclusive merchandise store",
                ]}
              />
            </TabsContent>

            <TabsContent value="events">
              <ScreenPreview
                title="Live Events"
                description="Attend virtual concerts and interactive events"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "HD live streaming",
                  "Real-time chat with artists and fans",
                  "Virtual meet & greets",
                  "Event recordings and replays",
                ]}
              />
            </TabsContent>

            <TabsContent value="career">
              <ScreenPreview
                title="Career Planner"
                description="Plan and track your music career journey"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Interactive career roadmap",
                  "Goal setting and tracking",
                  "Industry templates and best practices",
                  "Progress analytics and reporting",
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            User Journeys
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/10 mr-4">
                  <Music className="h-6 w-6 text-iridescent-1" />
                </div>
                <h3 className="text-xl font-bold">For Artists</h3>
              </div>
              <div className="space-y-4">
                <JourneyStep
                  number={1}
                  title="Create Your Profile"
                  description="Set up your artist profile with bio, genre, and media"
                />
                <JourneyStep
                  number={2}
                  title="Upload Your Music"
                  description="Share your albums, singles, and exclusive tracks"
                />
                <JourneyStep
                  number={3}
                  title="Schedule Events"
                  description="Create virtual concerts, Q&As, and fan meetups"
                />
                <JourneyStep
                  number={4}
                  title="Sell Merchandise"
                  description="Offer exclusive merchandise to your fans"
                />
                <JourneyStep number={5} title="Analyze & Grow" description="Track performance and grow your audience" />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-white/10 mr-4">
                  <Users className="h-6 w-6 text-iridescent-2" />
                </div>
                <h3 className="text-xl font-bold">For Fans</h3>
              </div>
              <div className="space-y-4">
                <JourneyStep
                  number={1}
                  title="Discover Artists"
                  description="Find new artists based on your preferences"
                />
                <JourneyStep
                  number={2}
                  title="Attend Events"
                  description="Join virtual concerts and interactive events"
                />
                <JourneyStep
                  number={3}
                  title="Support Artists"
                  description="Purchase merchandise and exclusive content"
                />
                <JourneyStep
                  number={4}
                  title="Interact & Connect"
                  description="Comment, like, and engage with your favorite artists"
                />
                <JourneyStep number={5} title="Earn Rewards" description="Collect JestCoins for platform engagement" />
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="mb-16">
          <GlassCard className="p-8 text-center">
            <Sparkles className="h-16 w-16 mx-auto text-iridescent-2 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Join Jestfly today and connect with artists and fans from around the world
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
                <Link href="/login">Login</Link>
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
          <Link href="#">Explore Feature</Link>
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

function JourneyStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 flex items-center justify-center mr-4">
        <span className="text-sm font-bold">{number}</span>
      </div>
      <div>
        <h4 className="text-lg font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

