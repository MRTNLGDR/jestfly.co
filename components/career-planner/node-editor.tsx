"use client"

import { useState, useEffect } from "react"
import type { CareerNode, NodeType } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2Icon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NodeEditorProps {
  node: CareerNode | null
  onUpdate: (id: string, updates: Partial<CareerNode>) => void
  onDelete: (id: string) => void
}

export function NodeEditor({ node, onUpdate, onDelete }: NodeEditorProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<"low" | "medium" | "high" | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (node) {
      setTitle(node.data.title || "")
      setDescription(node.data.description || "")
      setDueDate(node.data.dueDate ? new Date(node.data.dueDate) : undefined)
      setPriority(node.data.priority)
      setColor(node.data.color)
    }
  }, [node])

  if (!node) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Select a node to edit its properties</div>
  }

  const handleSave = () => {
    onUpdate(node.id, {
      data: {
        ...node.data,
        title,
        description,
        dueDate: dueDate?.toISOString(),
        priority,
        color,
      },
    })
  }

  const handleDelete = () => {
    onDelete(node.id)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Edit {getNodeTypeLabel(node.type)}</h3>
        <Button variant="destructive" size="icon" onClick={handleDelete} title="Delete node">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}

function getNodeTypeLabel(type: NodeType): string {
  switch (type) {
    case "goal":
      return "Goal"
    case "milestone":
      return "Milestone"
    case "task":
      return "Task"
    case "resource":
      return "Resource"
    case "note":
      return "Note"
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

