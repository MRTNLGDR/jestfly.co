import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">{children}</div>
    </AppLayout>
  )
}

