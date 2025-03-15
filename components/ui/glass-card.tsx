import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("rounded-lg border border-white/10 bg-black/30 backdrop-blur-md shadow-xl", className)}>
      {children}
    </div>
  )
}

