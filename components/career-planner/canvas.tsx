"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useCareerCanvas } from "@/hooks/use-career-canvas"
import { BaseNode } from "./nodes/base-node"
import { Connection } from "./connection"
import { Button } from "@/components/ui/button"
import { PlusIcon, MinusIcon, HomeIcon } from "lucide-react"
import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { cn } from "@/lib/utils"

interface CanvasProps {
  initialNodes?: CareerNode[]
  initialConnections?: NodeConnection[]
  onSave?: (nodes: CareerNode[], connections: NodeConnection[]) => void
  readOnly?: boolean
}

export function Canvas({ initialNodes = [], initialConnections = [], onSave, readOnly = false }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 2000 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const {
    nodes,
    connections,
    selectedNodeId,
    selectedConnectionId,
    isDragging,
    isConnecting,
    connectingNodeId,
    scale,
    offset,
    canvasRef,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    startConnecting,
    cancelConnecting,
    selectNode,
    selectConnection,
    startDragging,
    handleDrag,
    stopDragging,
    zoom,
    pan,
    resetView,
    clearCanvas,
    loadData,
  } = useCareerCanvas({
    nodes: initialNodes,
    connections: initialConnections,
  })

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setCanvasSize({ width: Math.max(width * 2, 3000), height: Math.max(height * 2, 2000) })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [canvasRef])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected node or connection
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          deleteNode(selectedNodeId)
        } else if (selectedConnectionId) {
          deleteConnection(selectedConnectionId)
        }
      }

      // Cancel connecting mode with Escape
      if (e.key === "Escape") {
        if (isConnecting) {
          cancelConnecting()
        } else {
          selectNode(null)
          selectConnection(null)
        }
      }

      // Zoom with + and -
      if (e.key === "+" || e.key === "=") {
        zoom(1, window.innerWidth / 2, window.innerHeight / 2)
      } else if (e.key === "-" || e.key === "_") {
        zoom(-1, window.innerWidth / 2, window.innerHeight / 2)
      }

      // Reset view with 0
      if (e.key === "0") {
        resetView()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    selectedNodeId,
    selectedConnectionId,
    isConnecting,
    deleteNode,
    deleteConnection,
    cancelConnecting,
    selectNode,
    selectConnection,
    zoom,
    resetView,
  ])

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return

    // Middle mouse button or space + left mouse button for panning
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    } else if (e.button === 0) {
      // Left click on canvas (not on a node) deselects everything
      selectNode(null)
      selectConnection(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    // Código para atualizar a posição do mouse pode continuar mesmo em modo somente leitura
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left - offset.x) / scale
    const y = (e.clientY - rect.top - offset.y) / scale

    setMousePosition({ x, y })

    if (readOnly) return

    if (isDragging) {
      handleDrag(e.clientX, e.clientY)
    } else if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      pan(dx, dy)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    if (readOnly) return

    if (isDragging) {
      stopDragging()
    }

    if (isPanning) {
      setIsPanning(false)
    }

    if (isConnecting && selectedNodeId) {
      // Complete the connection if a target node is selected
      if (connectingNodeId && connectingNodeId !== selectedNodeId) {
        addConnection(connectingNodeId, selectedNodeId)
      }
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -1 : 1
    zoom(delta, e.clientX, e.clientY)
  }

  // Handle node creation
  const handleAddNode = (type: "goal" | "milestone" | "task" | "resource" | "note") => {
    // Calculate position based on current view
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = (rect.width / 2 - offset.x) / scale
    const centerY = (rect.height / 2 - offset.y) / scale

    addNode(type, { x: centerX, y: centerY })
  }

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(nodes, connections)
    }
  }

  // Calculate connecting line if in connecting mode
  const connectingLine =
    isConnecting && connectingNodeId
      ? (() => {
          const sourceNode = nodes.find((n) => n.id === connectingNodeId)
          if (!sourceNode) return null

          const sourceX = sourceNode.position.x + sourceNode.width / 2
          const sourceY = sourceNode.position.y + sourceNode.height / 2

          return (
            <line
              x1={sourceX}
              y1={sourceY}
              x2={mousePosition.x}
              y2={mousePosition.y}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
          )
        })()
      : null

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      {/* Toolbar - oculto no modo somente leitura */}
      {!readOnly && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
          <Button size="icon" variant="outline" onClick={() => handleAddNode("goal")} title="Add Goal">
            <div className="w-4 h-4 bg-blue-500 rounded-full" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => handleAddNode("milestone")} title="Add Milestone">
            <div className="w-4 h-4 bg-purple-500 rounded-full" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => handleAddNode("task")} title="Add Task">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => handleAddNode("resource")} title="Add Resource">
            <div className="w-4 h-4 bg-amber-500 rounded-full" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => handleAddNode("note")} title="Add Note">
            <div className="w-4 h-4 bg-gray-500 rounded-full" />
          </Button>
        </div>
      )}

      {/* Zoom controls - mantidos mesmo no modo somente leitura */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2 bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => zoom(1, window.innerWidth / 2, window.innerHeight / 2)}
          title="Zoom In"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => zoom(-1, window.innerWidth / 2, window.innerHeight / 2)}
          title="Zoom Out"
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={resetView} title="Reset View">
          <HomeIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Save button - oculto no modo somente leitura */}
      {!readOnly && (
        <div className="absolute top-4 right-4 z-20">
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={cn("w-full h-full", readOnly ? "cursor-grab" : "cursor-default")}
        style={{
          overflow: "hidden",
          position: "relative",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: canvasSize.width,
            height: canvasSize.height,
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundSize: `${40 * scale}px ${40 * scale}px`,
              backgroundImage: "radial-gradient(circle, #9ca3af 1px, transparent 1px)",
              backgroundPosition: `${offset.x}px ${offset.y}px`,
            }}
          />

          {/* SVG for connections */}
          <svg
            ref={svgRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute inset-0 pointer-events-none"
          >
            {connections.map((connection) => (
              <Connection
                key={connection.id}
                connection={connection}
                nodes={nodes}
                isSelected={selectedConnectionId === connection.id}
                onSelect={readOnly ? () => {} : selectConnection}
                scale={scale}
                offset={offset}
              />
            ))}
            {connectingLine}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <BaseNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={readOnly ? () => {} : selectNode}
              onStartDrag={readOnly ? () => {} : startDragging}
              onStartConnect={readOnly ? () => {} : startConnecting}
              scale={scale}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>

      {/* Instructions - ocultas no modo somente leitura ou quando há nodes */}
      {!readOnly && nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
            <h3 className="text-lg font-medium mb-2">Welcome to Career Planner</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Use the tools on the left to add nodes to your career plan. Connect nodes to create a roadmap for your
              career journey.
            </p>
            <ul className="text-sm text-left space-y-2 mb-4">
              <li className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <span>Goals - Long-term career objectives</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                <span>Milestones - Key achievements along the way</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <span>Tasks - Specific actions to complete</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
                <span>Resources - Tools, courses, or people to help</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2" />
                <span>Notes - Additional information</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

