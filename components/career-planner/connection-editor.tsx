"use client"

import { useState, useEffect } from "react"
import type { NodeConnection } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2Icon } from "lucide-react"

interface ConnectionEditorProps {
  connection: NodeConnection | null
  onUpdate: (id: string, updates: Partial<NodeConnection>) => void
  onDelete: (id: string) => void
}

export function ConnectionEditor({ connection, onUpdate, onDelete }: ConnectionEditorProps) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    if (connection) {
      setLabel(connection.label || "")
    }
  }, [connection])

  if (!connection) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">Select a connection to edit its properties</div>
    )
  }

  const handleSave = () => {
    onUpdate(connection.id, {
      label,
    })
  }

  const handleDelete = () => {
    onDelete(connection.id)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit Connection</h3>
        <Button variant="destructive" size="icon" onClick={handleDelete} title="Delete connection">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter connection label"
          />
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}

