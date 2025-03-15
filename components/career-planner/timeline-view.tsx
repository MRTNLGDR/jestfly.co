"use client"

import { useState, useEffect } from "react"
import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  nodes: CareerNode[]
  connections: NodeConnection[]
  onNodeClick: (nodeId: string) => void
  selectedNodeId: string | null
}

export function TimelineView({ nodes, connections, onNodeClick, selectedNodeId }: TimelineViewProps) {
  const [timelineNodes, setTimelineNodes] = useState<CareerNode[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const nodesPerPage = 5

  // Sort and organize nodes by due date
  useEffect(() => {
    const sortedNodes = [...nodes]
      .filter((node) => node.data.dueDate) // Only include nodes with due dates
      .sort((a, b) => {
        const dateA = new Date(a.data.dueDate || "").getTime()
        const dateB = new Date(b.data.dueDate || "").getTime()
        return dateA - dateB
      })

    setTimelineNodes(sortedNodes)
  }, [nodes])

  const totalPages = Math.ceil(timelineNodes.length / nodesPerPage)
  const displayNodes = timelineNodes.slice(currentPage * nodesPerPage, (currentPage + 1) * nodesPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // Get connected nodes for a given node
  const getConnectedNodes = (nodeId: string) => {
    const outgoing = connections
      .filter((conn) => conn.sourceId === nodeId)
      .map((conn) => nodes.find((n) => n.id === conn.targetId))
      .filter(Boolean) as CareerNode[]

    const incoming = connections
      .filter((conn) => conn.targetId === nodeId)
      .map((conn) => nodes.find((n) => n.id === conn.sourceId))
      .filter(Boolean) as CareerNode[]

    return { outgoing, incoming }
  }

  // Get node type color
  const getNodeColor = (type: string) => {
    switch (type) {
      case "goal":
        return "bg-blue-500"
      case "milestone":
        return "bg-purple-500"
      case "task":
        return "bg-green-500"
      case "resource":
        return "bg-amber-500"
      case "note":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string | undefined) => {
    if (!priority) return null

    const variants: Record<string, string> = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }

    return <Badge className={cn(variants[priority] || "")}>{priority}</Badge>
  }

  if (timelineNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No timeline items found. Add nodes with due dates to see them here.
        </p>
        <Button variant="outline" onClick={() => onNodeClick("")}>
          Return to Canvas
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Timeline View</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage + 1} / {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1 || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Timeline nodes */}
        <div className="space-y-6">
          {displayNodes.map((node) => {
            const { outgoing, incoming } = getConnectedNodes(node.id)
            const date = node.data.dueDate ? new Date(node.data.dueDate) : null

            return (
              <div key={node.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "absolute left-2 top-2 w-5 h-5 rounded-full border-4 border-background",
                    getNodeColor(node.type),
                  )}
                />

                <Card
                  className={cn("transition-all", selectedNodeId === node.id ? "border-blue-500 shadow-md" : "")}
                  onClick={() => onNodeClick(node.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{node.data.title}</h4>
                        {date && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{date.toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {getPriorityBadge(node.data.priority)}
                        <Badge variant="outline">{node.type}</Badge>
                      </div>
                    </div>

                    {node.data.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{node.data.description}</p>
                    )}

                    {(incoming.length > 0 || outgoing.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        {incoming.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Prerequisites:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {incoming.map((n) => (
                                <Badge key={n.id} variant="secondary" className="text-xs">
                                  {n.data.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {outgoing.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Leads to:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {outgoing.map((n) => (
                                <Badge key={n.id} variant="secondary" className="text-xs">
                                  {n.data.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

