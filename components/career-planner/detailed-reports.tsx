"use client"

import { useState } from "react"
import { BarChart, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
} from "recharts"
import type { CareerNode, NodeConnection } from "@/types/career-planner"

interface DetailedReportsProps {
  nodes: CareerNode[]
  connections: NodeConnection[]
}

export function DetailedReports({ nodes, connections }: DetailedReportsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [timeRange, setTimeRange] = useState<"all" | "month" | "quarter" | "year">("all")

  // Calculate statistics
  const calculateStats = () => {
    // Filter nodes by time range if needed
    let filteredNodes = [...nodes]

    if (timeRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      if (timeRange === "month") {
        cutoffDate.setMonth(now.getMonth() - 1)
      } else if (timeRange === "quarter") {
        cutoffDate.setMonth(now.getMonth() - 3)
      } else if (timeRange === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1)
      }

      filteredNodes = nodes.filter((node) => {
        if (!node.data.dueDate) return true
        const dueDate = new Date(node.data.dueDate)
        return dueDate >= cutoffDate
      })
    }

    // Basic stats
    const totalNodes = filteredNodes.length
    const completedNodes = filteredNodes.filter((node) => node.data.completed).length
    const completionRate = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0

    // Nodes by type
    const nodesByType = filteredNodes.reduce(
      (acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Completion by type
    const completionByType = filteredNodes.reduce(
      (acc, node) => {
        if (!acc[node.type]) {
          acc[node.type] = { total: 0, completed: 0 }
        }

        acc[node.type].total++
        if (node.data.completed) {
          acc[node.type].completed++
        }

        return acc
      },
      {} as Record<string, { total: number; completed: number }>,
    )

    // Nodes by priority
    const nodesByPriority = filteredNodes.reduce(
      (acc, node) => {
        const priority = node.data.priority || "none"
        acc[priority] = (acc[priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Completion by priority
    const completionByPriority = filteredNodes.reduce(
      (acc, node) => {
        const priority = node.data.priority || "none"

        if (!acc[priority]) {
          acc[priority] = { total: 0, completed: 0 }
        }

        acc[priority].total++
        if (node.data.completed) {
          acc[priority].completed++
        }

        return acc
      },
      {} as Record<string, { total: number; completed: number }>,
    )

    // Completion over time
    const completionOverTime = filteredNodes
      .filter((node) => node.data.completed && node.data.dueDate)
      .reduce(
        (acc, node) => {
          const dueDate = new Date(node.data.dueDate!)
          const month = dueDate.toLocaleString("default", { month: "short" })
          const year = dueDate.getFullYear()
          const key = `${month} ${year}`

          if (!acc[key]) {
            acc[key] = 0
          }

          acc[key]++
          return acc
        },
        {} as Record<string, number>,
      )

    // Convert to arrays for charts
    const typeData = Object.entries(nodesByType).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }))

    const completionByTypeData = Object.entries(completionByType).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      completed: data.completed,
      pending: data.total - data.completed,
    }))

    const priorityData = Object.entries(nodesByPriority).map(([priority, count]) => ({
      name: priority === "none" ? "Not Set" : priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
    }))

    const completionByPriorityData = Object.entries(completionByPriority).map(([priority, data]) => ({
      name: priority === "none" ? "Not Set" : priority.charAt(0).toUpperCase() + priority.slice(1),
      completed: data.completed,
      pending: data.total - data.completed,
    }))

    const timelineData = Object.entries(completionOverTime)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })

    return {
      totalNodes,
      completedNodes,
      completionRate,
      typeData,
      completionByTypeData,
      priorityData,
      completionByPriorityData,
      timelineData,
    }
  }

  const stats = calculateStats()

  // Chart colors
  const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#6b7280"]

  const typeColors: Record<string, string> = {
    Goal: "#3b82f6",
    Milestone: "#8b5cf6",
    Task: "#22c55e",
    Resource: "#f59e0b",
    Note: "#6b7280",
  }

  const priorityColors: Record<string, string> = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#22c55e",
    "Not Set": "#6b7280",
  }

  // Export report as PDF
  const exportReport = () => {
    // In a real application, you would use a library like jsPDF or html2pdf
    // to generate a PDF report. This is a placeholder.
    alert("Export functionality would generate a PDF report in a real application.")
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <BarChart className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detailed Progress Reports</DialogTitle>
          <DialogDescription>Analyze your career plan progress with detailed charts and statistics.</DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mt-4">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="by-type">By Type</TabsTrigger>
            <TabsTrigger value="by-priority">By Priority</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalNodes}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Items in your career plan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedNodes}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Items completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</div>
                  <Progress value={stats.completionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Distribution by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={stats.typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.typeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={typeColors[entry.name] || COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Distribution by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={stats.priorityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.priorityData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={priorityColors[entry.name] || COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="by-type" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Completion by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={stats.completionByTypeData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
                      <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.completionByTypeData.map((item) => (
                <Card key={item.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-bold">
                        {((item.completed / (item.completed + item.pending)) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.completed} of {item.completed + item.pending}
                      </div>
                    </div>
                    <Progress value={(item.completed / (item.completed + item.pending)) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="by-priority" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Completion by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={stats.completionByPriorityData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
                      <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.completionByPriorityData.map((item) => (
                <Card key={item.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-bold">
                        {((item.completed / (item.completed + item.pending)) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.completed} of {item.completed + item.pending}
                      </div>
                    </div>
                    <Progress value={(item.completed / (item.completed + item.pending)) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Completion Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={stats.timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        name="Completed Items"
                        activeDot={{ r: 8 }}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.timelineData.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                      <div className="space-y-6">
                        {stats.timelineData.map((item, index) => (
                          <div key={index} className="relative pl-10">
                            <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-blue-500 border-4 border-background" />

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{item.date}</h4>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>{item.count} items completed</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No completion data available for the selected time range
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

