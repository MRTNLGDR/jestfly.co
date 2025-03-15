"use client"

import { PreviewToggle } from "@/components/preview-toggle"

export default function ExamplePage() {
  return (
    <div className="p-4">
      <PreviewToggle
        onToggle={(showPreview) => {
          console.log("Preview mode:", showPreview)
        }}
      />
    </div>
  )
}

