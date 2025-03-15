"use client"

import { useMemo } from "react"
import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface ProgressStatsProps {
  nodes: CareerNode[]
  connections: NodeConnection[]
}

export function ProgressStats({ nodes, connections }: ProgressStatsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalNodes = nodes.length
    const completedNodes = nodes.filter((node) => node.data.completed).length
    const completionRate = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0

    // Count by type
    const typeCount = nodes.reduce(
      (acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Count by priority
    const priorityCount = nodes.reduce(
      (acc, node) => {
        const priority = node.data.priority || "none"
        acc[priority] = (acc[priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Count by completion status and type
    const completionByType = nodes.reduce(
      (acc, node) => {
        const status = node.data.completed ? "completed" : "pending"
        if (!acc[node.type]) {
          acc[node.type] = { completed: 0, pending: 0 }
        }
        acc[node.type][status]++
        return acc
      },
      {} as Record<string, { completed: number; pending: number }>,
    )

    // Upcoming due dates
    const upcoming = nodes
      .filter((node) => node.data.dueDate && !node.data.completed)
      .sort((a, b) => {
        const dateA = new Date(a.data.dueDate || "").getTime()
        const dateB = new Date(b.data.dueDate || "").getTime()
        return dateA - dateB
      })
      .slice(0, 5)

    return {
      totalNodes,
      completedNodes,
      completionRate,
      typeCount,
      priorityCount,
      completionByType,
      upcoming,
    }
  }, [nodes])

  // Prepare chart data
  const typeChartData = useMemo(() => {
    return Object.entries(stats.typeCount).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }))
  }, [stats.typeCount])

  const priorityChartData = useMemo(() => {
    return Object.entries(stats.priorityCount).map(([priority, count]) => ({
      name: priority === "none" ? "Not Set" : priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
    }))
  }, [stats.priorityCount])

  const completionChartData = useMemo(() => {
    return Object.entries(stats.completionByType).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      completed: data.completed,
      pending: data.pending,
    }))
  }, [stats.completionByType])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"]

  const typeColors: Record<string, string> = {
    goal: "#3b82f6",
    milestone: "#8b5cf6",
    task: "#22c55e",
    resource: "#f59e0b",
    note: "#6b7280",
  }

  const priorityColors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
    none: "#6b7280",
  }

  if (nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress & Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Add nodes to your career plan to see statistics and progress.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress & Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall completion */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stats.completedNodes} of {stats.totalNodes} items
              </span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
          </div>

          {/* Charts */}
          <Tabs defaultValue="distribution">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
              <TabsTrigger value="completion">Completion</TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={typeColors[entry.name.toLowerCase()] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="priority" className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={priorityColors[entry.name.toLowerCase()] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="completion" className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={completionChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#22c55e" stackId="a" name="Completed" />
                    <Bar dataKey="pending" fill="#f59e0b" stackId="a" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>

          {/* Upcoming items */}
          {stats.upcoming.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Upcoming Items</h4>
              <div className="space-y-2">
                {stats.upcoming.map((node) => {
                  const date = node.data.dueDate ? new Date(node.data.dueDate) : null
                  return (
                    <div
                      key={node.id}
                      className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-sm">{node.data.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                        </p>
                      </div>
                      {date && (
                        <div className="text-right">
                          <p className="text-xs font-medium">{date.toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{getDaysRemaining(date)}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get days remaining
function getDaysRemaining(date: Date): string {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return "Due today"
  } else if (diffDays === 1) {
    return "Due tomorrow"
  } else {
    return `${diffDays} days remaining`
  }
}

