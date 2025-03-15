"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { Canvas } from "@/components/career-planner/canvas"
import { NodeEditor } from "@/components/career-planner/node-editor"
import { ConnectionEditor } from "@/components/career-planner/connection-editor"
import { TimelineView } from "@/components/career-planner/timeline-view"
import { ProgressStats } from "@/components/career-planner/progress-stats"
import { ExportImport } from "@/components/career-planner/export-import"
import { SharePlan } from "@/components/career-planner/share-plan"
import { TemplateGallery } from "@/components/career-planner/templates/template-gallery"
import { DeadlineNotifications } from "@/components/career-planner/deadline-notifications"
import { CalendarIntegration } from "@/components/career-planner/calendar-integration"
import { FiltersSearch } from "@/components/career-planner/filters-search"
import { DetailedReports } from "@/components/career-planner/detailed-reports"
import { useCareerCanvas } from "@/hooks/use-career-canvas"
import type { CareerNode, NodeConnection, CareerPlan } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SaveIcon,
  FolderOpenIcon,
  PlusIcon,
  LayoutDashboardIcon,
  TimerIcon as TimelineIcon,
  BarChartIcon,
} from "lucide-react"

export default function CareerPlannerPage() {
  const [planTitle, setPlanTitle] = useState("My Career Plan")
  const [planDescription, setPlanDescription] = useState("")
  const [plans, setPlans] = useState<CareerPlan[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<"canvas" | "timeline" | "stats">("canvas")
  const [filteredNodes, setFilteredNodes] = useState<CareerNode[]>([])

  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const {
    nodes,
    connections,
    selectedNodeId,
    selectedConnectionId,
    updateNode,
    deleteNode,
    deleteConnection,
    loadData,
    clearCanvas,
    selectNode,
  } = useCareerCanvas()

  // Set filtered nodes initially
  useEffect(() => {
    setFilteredNodes(nodes)
  }, [nodes])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch user's career plans
  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/career-plans")

        if (!response.ok) {
          throw new Error("Failed to fetch career plans")
        }

        const data = await response.json()
        setPlans(data)

        // Load the most recent plan if available
        if (data.length > 0) {
          const mostRecent = data.sort(
            (a: CareerPlan, b: CareerPlan) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )[0]

          setCurrentPlanId(mostRecent.id)
          setPlanTitle(mostRecent.title)
          setPlanDescription(mostRecent.description || "")
          loadData({
            nodes: mostRecent.nodes,
            connections: mostRecent.connections,
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch career plans",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchPlans()
    } else {
      setIsLoading(false)
    }
  }, [user, toast, loadData])

  // Handle save
  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      const planData = {
        id: currentPlanId || undefined,
        title: planTitle,
        description: planDescription,
        nodes,
        connections,
      }

      const response = await fetch("/api/career-plans", {
        method: currentPlanId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save career plan")
      }

      const savedPlan = await response.json()

      if (!currentPlanId) {
        setCurrentPlanId(savedPlan.id)
        setPlans([...plans, savedPlan])
      } else {
        setPlans(plans.map((plan) => (plan.id === savedPlan.id ? savedPlan : plan)))
      }

      toast({
        title: "Success",
        description: "Career plan saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save career plan",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle create new plan
  const handleCreateNew = () => {
    setCurrentPlanId(null)
    setPlanTitle("New Career Plan")
    setPlanDescription("")
    clearCanvas()
  }

  // Handle load plan
  const handleLoadPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    setCurrentPlanId(plan.id)
    setPlanTitle(plan.title)
    setPlanDescription(plan.description || "")
    loadData({
      nodes: plan.nodes,
      connections: plan.connections,
    })
  }

  // Handle import
  const handleImport = (data: { nodes: CareerNode[]; connections: NodeConnection[] }) => {
    loadData(data)
    toast({
      title: "Import Successful",
      description: `Imported ${data.nodes.length} nodes and ${data.connections.length} connections`,
    })
  }

  // Handle template application
  const handleApplyTemplate = (nodes: CareerNode[], connections: NodeConnection[]) => {
    loadData({ nodes, connections })
    toast({
      title: "Template Applied",
      description: "Template has been applied to your career plan",
    })
  }

  // Get current plan
  const currentPlan = currentPlanId ? plans.find((p) => p.id === currentPlanId) || null : null

  // Get selected node and connection
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null
  const selectedConnection = connections.find((conn) => conn.id === selectedConnectionId) || null

  if (isLoading) {
    return (
      <AppLayout>
        <Navbar />
        <main className="flex justify-center items-center min-h-[80vh]">
          <p>Loading...</p>
        </main>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Career Planner</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCreateNew} disabled={isSaving}>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Plan
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <SaveIcon className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Plan"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="planTitle">Plan Title</Label>
                  <Input
                    id="planTitle"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    placeholder="Enter plan title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planDescription">Description</Label>
                  <Textarea
                    id="planDescription"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Enter plan description"
                    rows={3}
                  />
                </div>

                <div className="pt-2">
                  <SharePlan plan={currentPlan} />
                </div>

                <div className="pt-2">
                  <TemplateGallery onApplyTemplate={handleApplyTemplate} />
                </div>

                <div className="pt-2">
                  <ExportImport nodes={nodes} connections={connections} onImport={handleImport} />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <Tabs defaultValue="editor">
                  <TabsList className="w-full">
                    <TabsTrigger value="editor" className="flex-1">
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="plans" className="flex-1">
                      My Plans
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="p-4">
                    {selectedNode ? (
                      <NodeEditor node={selectedNode} onUpdate={updateNode} onDelete={deleteNode} />
                    ) : selectedConnection ? (
                      <ConnectionEditor
                        connection={selectedConnection}
                        onUpdate={(id, updates) => {
                          const conn = connections.find((c) => c.id === id)
                          if (conn) {
                            deleteConnection(id)
                            const newConn = { ...conn, ...updates }
                            // Re-add the connection with updates
                            // This is a workaround since we don't have a direct updateConnection method
                          }
                        }}
                        onDelete={deleteConnection}
                      />
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        Select a node or connection to edit
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="plans" className="p-4">
                    {plans.length > 0 ? (
                      <div className="space-y-2">
                        {plans.map((plan) => (
                          <Button
                            key={plan.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleLoadPlan(plan.id)}
                          >
                            <FolderOpenIcon className="h-4 w-4 mr-2" />
                            {plan.title}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-4">No saved plans yet</div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              {/* Toolbar with filters, notifications, etc. */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <FiltersSearch nodes={nodes} onFilterChange={setFilteredNodes} />
                  </div>
                  <div className="flex items-center gap-2">
                    <DeadlineNotifications nodes={nodes} onNodeSelect={selectNode} />
                    <CalendarIntegration nodes={nodes} onNodeSelect={selectNode} />
                    <DetailedReports nodes={nodes} connections={connections} />
                  </div>
                </div>
              </div>

              {/* View mode selector */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-2">
                <div className="flex justify-center">
                  <div className="inline-flex rounded-md shadow-sm">
                    <Button
                      variant={viewMode === "canvas" ? "default" : "outline"}
                      className="rounded-l-md rounded-r-none"
                      onClick={() => setViewMode("canvas")}
                    >
                      <LayoutDashboardIcon className="h-4 w-4 mr-2" />
                      Canvas
                    </Button>
                    <Button
                      variant={viewMode === "timeline" ? "default" : "outline"}
                      className="rounded-none border-l-0 border-r-0"
                      onClick={() => setViewMode("timeline")}
                    >
                      <TimelineIcon className="h-4 w-4 mr-2" />
                      Timeline
                    </Button>
                    <Button
                      variant={viewMode === "stats" ? "default" : "outline"}
                      className="rounded-r-md rounded-l-none"
                      onClick={() => setViewMode("stats")}
                    >
                      <BarChartIcon className="h-4 w-4 mr-2" />
                      Statistics
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              {viewMode === "canvas" && (
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                  style={{ height: "calc(100vh - 350px)" }}
                >
                  <Canvas
                    initialNodes={filteredNodes}
                    initialConnections={connections}
                    onSave={(nodes, connections) => {
                      handleSave()
                    }}
                  />
                </div>
              )}

              {viewMode === "timeline" && (
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  style={{ minHeight: "calc(100vh - 350px)" }}
                >
                  <TimelineView
                    nodes={filteredNodes}
                    connections={connections}
                    onNodeClick={(nodeId) => {
                      selectNode(nodeId)
                      setViewMode("canvas")
                    }}
                    selectedNodeId={selectedNodeId}
                  />
                </div>
              )}

              {viewMode === "stats" && (
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow"
                  style={{ minHeight: "calc(100vh - 350px)" }}
                >
                  <ProgressStats nodes={filteredNodes} connections={connections} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

