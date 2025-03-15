export type NodeType = "GOAL" | "TASK" | "MILESTONE" | "NOTE"

export interface Position {
  x: number
  y: number
}

export interface Node {
  id: string
  type: NodeType
  title: string
  description?: string
  position: Position
  deadline?: string
  completed: boolean
  color: string
}

export interface Connection {
  id: string
  sourceId: string
  targetId: string
  label?: string
}

export interface CareerPlan {
  id?: string
  title: string
  description?: string
  nodes: Node[]
  connections: Connection[]
  isPublic?: boolean
  userId?: string
  createdAt?: string
  updatedAt?: string
}

