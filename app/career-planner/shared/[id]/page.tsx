"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { Canvas } from "@/components/career-planner/canvas"
import { TimelineView } from "@/components/career-planner/timeline-view"
import { ProgressStats } from "@/components/career-planner/progress-stats"
import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { LayoutDashboardIcon, TimerIcon as TimelineIcon, BarChartIcon, ArrowLeftIcon, CopyIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SharedPlanPageProps {
  params: {
    id: string
  }
}

export default function SharedPlanPage({ params }: SharedPlanPageProps) {
  const [plan, setPlan] = useState<{
    id: string
    title: string
    description: string
    nodes: CareerNode[]
    connections: NodeConnection[]
    user: {
      name: string
      image: string | null
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"canvas" | "timeline" | "stats">("canvas")
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // Fetch shared plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/career-plans/shared/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Plan not found or not shared")
          } else {
            const data = await response.json()
            throw new Error(data.error || "Failed to fetch shared plan")
          }
        }

        const data = await response.json()
        setPlan(data)
      } catch (error: any) {
        setError(error.message || "Failed to fetch shared plan")
        toast({
          title: "Error",
          description: error.message || "Failed to fetch shared plan",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlan()
  }, [params.id, toast])

  // Handle copy plan
  const handleCopyPlan = async () => {
    if (!plan) return

    try {
      const response = await fetch("/api/career-plans/copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to copy plan")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Plan copied to your account",
      })

      // Redirect to the new plan
      router.push(`/career-planner?plan=${data.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to copy plan",
        variant: "destructive",
      })
    }
  }

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

  if (error || !plan) {
    return (
      <AppLayout>
        <Navbar />
        <main className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error || "Failed to load shared plan"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/career-planner")}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Career Planner
              </Button>
            </CardContent>
          </Card>
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
            <div>
              <h1 className="text-3xl font-bold">{plan.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">Shared by {plan.user.name}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/career-planner")}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleCopyPlan}>
                <CopyIcon className="h-4 w-4 mr-2" />
                Copy to My Plans
              </Button>
            </div>
          </div>

          {plan.description && (
            <Card>
              <CardContent className="p-4">
                <p>{plan.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
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
                style={{ height: "calc(100vh - 300px)" }}
              >
                <Canvas
                  initialNodes={plan.nodes}
                  initialConnections={plan.connections}
                  onSave={() => {}}
                  readOnly={true}
                />
              </div>
            )}

            {viewMode === "timeline" && (
              <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                style={{ minHeight: "calc(100vh - 300px)" }}
              >
                <TimelineView
                  nodes={plan.nodes}
                  connections={plan.connections}
                  onNodeClick={(nodeId) => {
                    setSelectedNodeId(nodeId)
                    setViewMode("canvas")
                  }}
                  selectedNodeId={selectedNodeId}
                />
              </div>
            )}

            {viewMode === "stats" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow" style={{ minHeight: "calc(100vh - 300px)" }}>
                <ProgressStats nodes={plan.nodes} connections={plan.connections} />
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

