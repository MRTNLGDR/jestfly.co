"use client"

import { useState, useRef, useCallback } from "react"
import type { CareerNode, NodeConnection, NodePosition, NodeType } from "@/types/career-planner"
import { v4 as uuidv4 } from "uuid"

type CanvasState = {
  nodes: CareerNode[]
  connections: NodeConnection[]
  selectedNodeId: string | null
  selectedConnectionId: string | null
  isDragging: boolean
  isConnecting: boolean
  connectingNodeId: string | null
  scale: number
  offset: NodePosition
}

const initialState: CanvasState = {
  nodes: [],
  connections: [],
  selectedNodeId: null,
  selectedConnectionId: null,
  isDragging: false,
  isConnecting: false,
  connectingNodeId: null,
  scale: 1,
  offset: { x: 0, y: 0 },
}

export function useCareerCanvas(initialData?: Partial<CanvasState>) {
  const [state, setState] = useState<CanvasState>({
    ...initialState,
    ...initialData,
  })

  const canvasRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef<NodePosition | null>(null)
  const dragNodeOffset = useRef<NodePosition | null>(null)

  // Add a new node to the canvas
  const addNode = useCallback((type: NodeType, position: NodePosition, data: any = {}) => {
    const newNode: CareerNode = {
      id: uuidv4(),
      type,
      position,
      data: {
        title: `New ${type}`,
        description: "",
        ...data,
      },
      width: 200,
      height: 100,
    }

    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      selectedNodeId: newNode.id,
    }))

    return newNode.id
  }, [])

  // Update a node's properties
  const updateNode = useCallback((id: string, updates: Partial<CareerNode>) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
    }))
  }, [])

  // Delete a node and its connections
  const deleteNode = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== id),
      connections: prev.connections.filter((conn) => conn.sourceId !== id && conn.targetId !== id),
      selectedNodeId: prev.selectedNodeId === id ? null : prev.selectedNodeId,
    }))
  }, [])

  // Add a connection between nodes
  const addConnection = useCallback(
    (sourceId: string, targetId: string, label?: string) => {
      // Prevent self-connections and duplicates
      if (sourceId === targetId) return null

      const connectionExists = state.connections.some(
        (conn) => conn.sourceId === sourceId && conn.targetId === targetId,
      )

      if (connectionExists) return null

      const newConnection: NodeConnection = {
        id: uuidv4(),
        sourceId,
        targetId,
        label,
      }

      setState((prev) => ({
        ...prev,
        connections: [...prev.connections, newConnection],
        isConnecting: false,
        connectingNodeId: null,
      }))

      return newConnection.id
    },
    [state.connections],
  )

  // Delete a connection
  const deleteConnection = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      connections: prev.connections.filter((conn) => conn.id !== id),
      selectedConnectionId: prev.selectedConnectionId === id ? null : prev.selectedConnectionId,
    }))
  }, [])

  // Start connecting nodes
  const startConnecting = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      isConnecting: true,
      connectingNodeId: nodeId,
    }))
  }, [])

  // Cancel connecting nodes
  const cancelConnecting = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnecting: false,
      connectingNodeId: null,
    }))
  }, [])

  // Select a node
  const selectNode = useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: id,
      selectedConnectionId: null,
    }))
  }, [])

  // Select a connection
  const selectConnection = useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedConnectionId: id,
      selectedNodeId: null,
    }))
  }, [])

  // Start dragging a node
  const startDragging = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const node = state.nodes.find((n) => n.id === id)
      if (!node) return

      dragStartPos.current = { x: clientX, y: clientY }
      dragNodeOffset.current = { x: 0, y: 0 }

      setState((prev) => ({
        ...prev,
        isDragging: true,
        selectedNodeId: id,
      }))
    },
    [state.nodes],
  )

  // Handle node dragging
  const handleDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!state.isDragging || !dragStartPos.current || !state.selectedNodeId) return

      const dx = clientX - dragStartPos.current.x
      const dy = clientY - dragStartPos.current.y

      dragNodeOffset.current = { x: dx, y: dy }

      setState((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === prev.selectedNodeId
            ? {
                ...node,
                position: {
                  x: node.position.x + dx / prev.scale,
                  y: node.position.y + dy / prev.scale,
                },
              }
            : node,
        ),
      }))

      dragStartPos.current = { x: clientX, y: clientY }
    },
    [state.isDragging, state.selectedNodeId, state.scale],
  )

  // Stop dragging
  const stopDragging = useCallback(() => {
    dragStartPos.current = null
    dragNodeOffset.current = null

    setState((prev) => ({
      ...prev,
      isDragging: false,
    }))
  }, [])

  // Zoom the canvas
  const zoom = useCallback((delta: number, clientX: number, clientY: number) => {
    setState((prev) => {
      const newScale = Math.max(0.1, Math.min(2, prev.scale + delta * 0.1))

      // Calculate the point on the canvas where the zoom is centered
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return { ...prev, scale: newScale }

      const mouseX = clientX - canvasRect.left
      const mouseY = clientY - canvasRect.top

      // Calculate new offset to keep the point under the mouse in the same position
      const newOffset = {
        x: mouseX - (mouseX - prev.offset.x) * (newScale / prev.scale),
        y: mouseY - (mouseY - prev.offset.y) * (newScale / prev.scale),
      }

      return {
        ...prev,
        scale: newScale,
        offset: newOffset,
      }
    })
  }, [])

  // Pan the canvas
  const pan = useCallback((dx: number, dy: number) => {
    setState((prev) => ({
      ...prev,
      offset: {
        x: prev.offset.x + dx,
        y: prev.offset.y + dy,
      },
    }))
  }, [])

  // Reset the canvas view
  const resetView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      scale: 1,
      offset: { x: 0, y: 0 },
    }))
  }, [])

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    setState((prev) => ({
      ...prev,
      nodes: [],
      connections: [],
      selectedNodeId: null,
      selectedConnectionId: null,
    }))
  }, [])

  // Load data into the canvas
  const loadData = useCallback((data: { nodes: CareerNode[]; connections: NodeConnection[] }) => {
    setState((prev) => ({
      ...prev,
      nodes: data.nodes,
      connections: data.connections,
      selectedNodeId: null,
      selectedConnectionId: null,
    }))
  }, [])

  return {
    ...state,
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
  }
}

