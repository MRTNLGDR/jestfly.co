import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"

export default function DemoPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
        Jestfly Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Career Planner</h2>
          <p className="text-white/70 mb-6">
            Plan your music career with our interactive career planner. Set goals, track progress, and visualize your
            journey.
          </p>
          <Button className="w-full" asChild>
            <Link href="/demo/career-planner">View Demo</Link>
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Artist Profile</h2>
          <p className="text-white/70 mb-6">
            Explore how artists can showcase their work, manage releases, and connect with fans.
          </p>
          <Button className="w-full" variant="secondary" disabled>
            Coming Soon
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-4">Live Streaming</h2>
          <p className="text-white/70 mb-6">
            Experience our virtual event platform with live streaming, chat, and interactive features.
          </p>
          <Button className="w-full" variant="secondary" disabled>
            Coming Soon
          </Button>
        </GlassCard>
      </div>
    </div>
  )
}

