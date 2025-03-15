"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Music,
  Calendar,
  ShoppingBag,
  FileAudio,
  BarChart,
  Radio,
  Video,
  DollarSign,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ArtistSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ArtistSidebar({ className }: ArtistSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/artist/dashboard" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button
              variant={pathname === "/artist/analytics" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
            <Button
              variant={pathname === "/artist/analytics/streaming" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start pl-8"
              asChild
            >
              <Link href="/artist/analytics/streaming">
                <Video className="mr-2 h-4 w-4" />
                Streaming
              </Link>
            </Button>
            <Button
              variant={pathname === "/artist/monetization" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/monetization">
                <DollarSign className="mr-2 h-4 w-4" />
                Monetization
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Content</h2>
          <div className="space-y-1">
            <Button
              variant={pathname.startsWith("/artist/albums") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/albums">
                <Music className="mr-2 h-4 w-4" />
                Albums
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith("/artist/events") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/events">
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith("/artist/streaming") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start pl-8"
              asChild
            >
              <Link href="/artist/streaming">
                <Radio className="mr-2 h-4 w-4" />
                Live Streams
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith("/artist/merchandise") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/merchandise">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Merchandise
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith("/artist/demos") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/artist/demos">
                <FileAudio className="mr-2 h-4 w-4" />
                Demos
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Recordings</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/recordings" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/recordings">
                <Video className="mr-2 h-4 w-4" />
                All Recordings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

