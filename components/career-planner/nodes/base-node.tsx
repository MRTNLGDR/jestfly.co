"use client"

import type React from "react"

import { useState } from "react"
import type { CareerNode } from "@/types/career-planner"
import { cn } from "@/lib/utils"

interface BaseNodeProps {
  node: CareerNode
  isSelected: boolean
  onSelect: (id: string) => void
  onStartDrag: (id: string, clientX: number, clientY: number) => void
  onStartConnect: (id: string) => void
  scale: number
  readOnly?: boolean
}

export function BaseNode({
  node,
  isSelected,
  onSelect,
  onStartDrag,
  onStartConnect,
  scale,
  readOnly = false,
}: BaseNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return

    e.stopPropagation()
    onSelect(node.id)

    if (e.button === 0) {
      // Left click
      onStartDrag(node.id, e.clientX, e.clientY)
    }
  }

  const handleConnectClick = (e: React.MouseEvent) => {
    if (readOnly) return

    e.stopPropagation()
    onStartConnect(node.id)
  }

  return (
    <div
      className={cn(
        "absolute bg-white dark:bg-gray-800 rounded-md shadow-md border-2 transition-all",
        isSelected ? "border-blue-500" : "border-gray-200 dark:border-gray-700",
        isHovered ? "shadow-lg" : "",
        readOnly ? "pointer-events-auto" : "cursor-move",
      )}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("h-6 rounded-t-md flex items-center justify-between px-2", getNodeHeaderColor(node.type))}>
        <span className="text-xs font-medium text-white truncate">{getNodeTypeLabel(node.type)}</span>
        {!readOnly && (
          <div className="flex space-x-1">
            <button
              className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center"
              onClick={handleConnectClick}
              title="Connect to another node"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm truncate">{node.data.title}</h3>
        {node.data.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{node.data.description}</p>
        )}
        {node.data.dueDate && (
          <div className="mt-2 text-xs flex items-center">
            <span className="text-gray-500 dark:text-gray-400">Due: </span>
            <span className="ml-1">{new Date(node.data.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        {node.data.priority && (
          <div className="mt-1 flex items-center">
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                node.data.priority === "high"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : node.data.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              )}
            >
              {node.data.priority}
            </span>
          </div>
        )}
        {node.data.completed && (
          <div className="mt-1 flex items-center">
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Completed
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function getNodeHeaderColor(type: string): string {
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

function getNodeTypeLabel(type: string): string {
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

