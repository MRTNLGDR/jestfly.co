"use client"

import { cn } from "@/lib/utils"
import { Code, Eye } from "lucide-react"
import { useState } from "react"

interface PreviewToggleProps {
  onToggle?: (showPreview: boolean) => void
  className?: string
}

export function PreviewToggle({ onToggle, className }: PreviewToggleProps) {
  const [showPreview, setShowPreview] = useState(true)

  const handleToggle = (preview: boolean) => {
    setShowPreview(preview)
    onToggle?.(preview)
  }

  return (
    <div className={cn("flex rounded-md bg-black/90 p-[1px]", className)}>
      <button
        onClick={() => handleToggle(true)}
        className={cn(
          "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-colors",
          showPreview ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
        )}
      >
        <Eye className="h-4 w-4" />
        Preview
      </button>
      <button
        onClick={() => handleToggle(false)}
        className={cn(
          "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-colors",
          !showPreview ? "bg-white/10 text-white" : "text-white/70 hover:text-white",
        )}
      >
        <Code className="h-4 w-4" />
        Code
      </button>
    </div>
  )
}

