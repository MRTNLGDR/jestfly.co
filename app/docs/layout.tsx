import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  ChevronRight,
  FileText,
  Code,
  Users,
  Music,
  Calendar,
  ShoppingBag,
  Mic,
  Coins,
  Play,
  BarChart,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation - Jestfly Artist Fan Platform",
  description: "Documentation and guides for the Jestfly Artist Fan Platform",
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", href: "/docs", icon: <FileText className="h-4 w-4" /> },
        { title: "Installation", href: "/docs/installation", icon: <Code className="h-4 w-4" /> },
        { title: "Authentication", href: "/docs/authentication", icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      title: "For Artists",
      items: [
        { title: "Artist Profile", href: "/docs/artist-profile", icon: <Users className="h-4 w-4" /> },
        { title: "Album Management", href: "/docs/album-management", icon: <Music className="h-4 w-4" /> },
        { title: "Event Management", href: "/docs/event-management", icon: <Calendar className="h-4 w-4" /> },
        { title: "Merchandise", href: "/docs/merchandise", icon: <ShoppingBag className="h-4 w-4" /> },
        { title: "Demo Submissions", href: "/docs/demo-submissions", icon: <Mic className="h-4 w-4" /> },
        { title: "Career Planner", href: "/docs/career-planner", icon: <ChevronRight className="h-4 w-4" /> },
        { title: "Live Streaming", href: "/docs/live-streaming", icon: <Play className="h-4 w-4" /> },
        { title: "Analytics", href: "/docs/analytics", icon: <BarChart className="h-4 w-4" /> },
      ],
    },
    {
      title: "For Fans",
      items: [
        { title: "User Profile", href: "/docs/user-profile", icon: <Users className="h-4 w-4" /> },
        { title: "Discovering Music", href: "/docs/discovering-music", icon: <Music className="h-4 w-4" /> },
        { title: "Attending Events", href: "/docs/attending-events", icon: <Calendar className="h-4 w-4" /> },
        { title: "Shopping", href: "/docs/shopping", icon: <ShoppingBag className="h-4 w-4" /> },
        { title: "JestCoins", href: "/docs/jestcoins", icon: <Coins className="h-4 w-4" /> },
        { title: "Watching Streams", href: "/docs/watching-streams", icon: <Play className="h-4 w-4" /> },
      ],
    },
    {
      title: "API Reference",
      items: [
        { title: "Authentication API", href: "/docs/api/authentication", icon: <Code className="h-4 w-4" /> },
        { title: "Artists API", href: "/docs/api/artists", icon: <Code className="h-4 w-4" /> },
        { title: "Albums API", href: "/docs/api/albums", icon: <Code className="h-4 w-4" /> },
        { title: "Events API", href: "/docs/api/events", icon: <Code className="h-4 w-4" /> },
        { title: "Merchandise API", href: "/docs/api/merchandise", icon: <Code className="h-4 w-4" /> },
        { title: "Demos API", href: "/docs/api/demos", icon: <Code className="h-4 w-4" /> },
        { title: "JestCoins API", href: "/docs/api/jestcoins", icon: <Code className="h-4 w-4" /> },
        { title: "Streaming API", href: "/docs/api/streaming", icon: <Code className="h-4 w-4" /> },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Jestfly Docs</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/docs" className="transition-colors hover:text-foreground/80">
              Documentation
            </Link>
            <Link href="/docs/api" className="transition-colors hover:text-foreground/80">
              API Reference
            </Link>
            <Link href="/docs/examples" className="transition-colors hover:text-foreground/80">
              Examples
            </Link>
          </nav>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="h-full overflow-y-auto">
              {categories.map((category) => (
                <div key={category.title} className="mb-4">
                  <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">{category.title}</h4>
                  <div className="grid grid-flow-row auto-rows-max text-sm">
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline"
                      >
                        {item.icon}
                        <span className="ml-2">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  )
}

