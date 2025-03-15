import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Music, Calendar, Package, FileAudio, BarChart, Radio } from "lucide-react"

export default async function ArtistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  // Check if the user is an artist
  const artist = await prisma.artist.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  if (!artist) {
    redirect("/")
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-2">
            <Link href="/artist/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/artist/albums">
              <Button variant="ghost" className="w-full justify-start">
                <Music className="mr-2 h-4 w-4" />
                Albums
              </Button>
            </Link>
            <Link href="/artist/events">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Button>
            </Link>
            <Link href="/artist/streaming">
              <Button variant="ghost" className="w-full justify-start">
                <Radio className="mr-2 h-4 w-4" />
                Live Streaming
              </Button>
            </Link>
            <Link href="/artist/merchandise">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Merchandise
              </Button>
            </Link>
            <Link href="/artist/demos">
              <Button variant="ghost" className="w-full justify-start">
                <FileAudio className="mr-2 h-4 w-4" />
                Demos
              </Button>
            </Link>
            <Link href="/artist/analytics">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

