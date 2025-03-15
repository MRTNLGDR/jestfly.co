"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save, FileDown, FileUp, Share2 } from "lucide-react"
import type { Node, Connection, NodeType } from "@/types/career-planner"

// Mock data for demonstration
const mockNodes: Node[] = [
  {
    id: "1",
    type: "GOAL",
    title: "Release First Album",
    description: "Complete and release my debut album",
    position: { x: 300, y: 100 },
    deadline: "2023-12-31",
    completed: false,
    color: "#4f46e5",
  },
  {
    id: "2",
    type: "TASK",
    title: "Finish Recording",
    description: "Complete all recording sessions",
    position: { x: 100, y: 250 },
    deadline: "2023-10-15",
    completed: true,
    color: "#10b981",
  },
  {
    id: "3",
    type: "TASK",
    title: "Mixing and Mastering",
    description: "Get the album professionally mixed and mastered",
    position: { x: 300, y: 250 },
    deadline: "2023-11-15",
    completed: false,
    color: "#10b981",
  },
  {
    id: "4",
    type: "MILESTONE",
    title: "Album Launch Event",
    description: "Host a launch party for the album",
    position: { x: 500, y: 250 },
    deadline: "2023-12-15",
    completed: false,
    color: "#f59e0b",
  },
]

const mockConnections: Connection[] = [
  {
    id: "c1",
    sourceId: "2",
    targetId: "3",
    label: "Next Step",
  },
  {
    id: "c2",
    sourceId: "3",
    targetId: "4",
    label: "Leads to",
  },
  {
    id: "c3",
    sourceId: "4",
    targetId: "1",
    label: "Completes",
  },
]

export default function CareerPlannerDemo() {
  const [nodes, setNodes] = useState<Node[]>(mockNodes)
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Mock function to toggle node completion
  const toggleNodeCompletion = (nodeId: string) => {
    setNodes(nodes.map((node) => (node.id === nodeId ? { ...node, completed: !node.completed } : node)))
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
        Career Planner Demo
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="border border-white/10 bg-black/50 backdrop-blur-sm">
            <CardHeader className="border-b border-white/10 p-4">
              <div className="flex justify-between items-center">
                <CardTitle>My Career Plan</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <FileDown className="h-4 w-4" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <FileUp className="h-4 w-4" />
                    Import
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[600px] bg-black/30 overflow-hidden">
                {/* Canvas with nodes */}
                <div className="absolute inset-0">
                  {/* Render connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map((connection) => {
                      const source = nodes.find((n) => n.id === connection.sourceId)
                      const target = nodes.find((n) => n.id === connection.targetId)

                      if (!source || !target) return null

                      return (
                        <g key={connection.id}>
                          <line
                            x1={source.position.x + 100}
                            y1={source.position.y + 50}
                            x2={target.position.x + 100}
                            y2={target.position.y + 50}
                            stroke="rgba(255, 255, 255, 0.5)"
                            strokeWidth={2}
                            strokeDasharray={connection.label ? "0" : "5,5"}
                            markerEnd="url(#arrowhead)"
                          />
                          {connection.label && (
                            <text
                              x={(source.position.x + target.position.x + 200) / 2}
                              y={(source.position.y + target.position.y + 100) / 2 - 10}
                              textAnchor="middle"
                              fill="white"
                              fontSize="12"
                              className="pointer-events-none"
                            >
                              {connection.label}
                            </text>
                          )}
                        </g>
                      )
                    })}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.5)" />
                      </marker>
                    </defs>
                  </svg>

                  {/* Render nodes */}
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      className="absolute cursor-pointer"
                      style={{
                        left: node.position.x,
                        top: node.position.y,
                        width: 200,
                        transform: "translate(0, 0)",
                      }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div
                        className={`p-4 rounded-lg border ${node.completed ? "border-green-500" : "border-white/20"}`}
                        style={{ backgroundColor: `${node.color}30` }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10">{node.type}</span>
                          <div
                            className={`w-5 h-5 rounded-full border ${node.completed ? "bg-green-500 border-green-500" : "border-white/50"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleNodeCompletion(node.id)
                            }}
                          >
                            {node.completed && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5 text-white"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                        <h3 className="font-medium text-white">{node.title}</h3>
                        <p className="text-sm text-white/70 mt-1">{node.description}</p>
                        {node.deadline && <div className="mt-2 text-xs text-white/50">Deadline: {node.deadline}</div>}
                      </div>
                    </div>
                  ))}

                  {/* Add node button */}
                  <Button size="sm" className="absolute bottom-4 right-4 flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Add Node
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-1">
                Progress
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card className="border border-white/10 bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Node Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNode ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-white/70">Title</h3>
                        <p className="text-white">{selectedNode.title}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/70">Type</h3>
                        <p className="text-white">{selectedNode.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/70">Description</h3>
                        <p className="text-white">{selectedNode.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/70">Deadline</h3>
                        <p className="text-white">{selectedNode.deadline}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/70">Status</h3>
                        <p className="text-white">{selectedNode.completed ? "Completed" : "In Progress"}</p>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full">Edit Node</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/50">Select a node to view details</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress">
              <Card className="border border-white/10 bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-white/70">Completion</h3>
                      <div className="w-full bg-white/10 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 h-2.5 rounded-full"
                          style={{ width: `${(nodes.filter((n) => n.completed).length / nodes.length) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-white/70 mt-1">
                        {nodes.filter((n) => n.completed).length} of {nodes.length} items completed
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white/70">Upcoming Deadlines</h3>
                      <div className="space-y-2 mt-2">
                        {nodes
                          .filter((n) => !n.completed && n.deadline)
                          .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
                          .slice(0, 3)
                          .map((node) => (
                            <div key={node.id} className="flex justify-between items-center p-2 rounded bg-white/5">
                              <span className="text-sm">{node.title}</span>
                              <span className="text-xs text-white/50">{node.deadline}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white/70">By Type</h3>
                      <div className="space-y-2 mt-2">
                        {(["GOAL", "TASK", "MILESTONE"] as NodeType[]).map((type) => {
                          const typeNodes = nodes.filter((n) => n.type === type)
                          const completed = typeNodes.filter((n) => n.completed).length
                          const total = typeNodes.length

                          return (
                            <div key={type} className="flex justify-between items-center">
                              <span className="text-sm">{type}</span>
                              <span className="text-xs text-white/50">
                                {completed}/{total}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

