"use client"

import type React from "react"

import { useState } from "react"
import type { NodeConnection, CareerNode } from "@/types/career-planner"
import { cn } from "@/lib/utils"

interface ConnectionProps {
  connection: NodeConnection
  nodes: CareerNode[]
  isSelected: boolean
  onSelect: (id: string) => void
  scale: number
  offset: { x: number; y: number }
}

export function Connection({ connection, nodes, isSelected, onSelect, scale, offset }: ConnectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sourceNode = nodes.find((n) => n.id === connection.sourceId)
  const targetNode = nodes.find((n) => n.id === connection.targetId)

  if (!sourceNode || !targetNode) return null

  // Calculate connection points
  const sourceX = sourceNode.position.x + sourceNode.width / 2
  const sourceY = sourceNode.position.y + sourceNode.height / 2
  const targetX = targetNode.position.x + targetNode.width / 2
  const targetY = targetNode.position.y + targetNode.height / 2

  // Calculate control points for the curve
  const dx = Math.abs(targetX - sourceX) * 0.5
  const controlPoint1X = sourceX + dx
  const controlPoint1Y = sourceY
  const controlPoint2X = targetX - dx
  const controlPoint2Y = targetY

  // Create SVG path
  const path = `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`

  // Calculate midpoint for label
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(connection.id)
  }

  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={isSelected || isHovered ? "#3b82f6" : "#9ca3af"}
        strokeWidth={isSelected || isHovered ? 2 : 1}
        strokeDasharray={isSelected ? "none" : isHovered ? "5,5" : "none"}
        className="transition-all"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: "pointer",
        }}
      />

      {/* Arrow head */}
      <marker id={`arrowhead-${connection.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill={isSelected || isHovered ? "#3b82f6" : "#9ca3af"} />
      </marker>

      {/* Connection label */}
      {connection.label && (
        <foreignObject
          x={midX - 50}
          y={midY - 10}
          width="100"
          height="20"
          style={{
            pointerEvents: "none",
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          <div
            className={cn(
              "bg-white dark:bg-gray-800 text-xs px-2 py-0.5 rounded border text-center",
              isSelected ? "border-blue-500" : "border-gray-200 dark:border-gray-700",
            )}
          >
            {connection.label}
          </div>
        </foreignObject>
      )}
    </>
  )
}

