"use client"

import { useState, useEffect } from "react"
import { Bell, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { CareerNode } from "@/types/career-planner"

interface DeadlineNotificationsProps {
  nodes: CareerNode[]
  onNodeSelect: (nodeId: string) => void
}

export function DeadlineNotifications({ nodes, onNodeSelect }: DeadlineNotificationsProps) {
  const [notifications, setNotifications] = useState<Array<{ node: CareerNode; daysRemaining: number }>>([])
  const [showNotifications, setShowNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationThreshold, setNotificationThreshold] = useState(7) // days
  const [unreadCount, setUnreadCount] = useState(0)

  // Calculate notifications based on upcoming deadlines
  useEffect(() => {
    if (!showNotifications) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    const today = new Date()
    const upcoming = nodes
      .filter((node) => {
        if (!node.data.dueDate || node.data.completed) return false

        const dueDate = new Date(node.data.dueDate)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return diffDays >= 0 && diffDays <= notificationThreshold
      })
      .map((node) => {
        const dueDate = new Date(node.data.dueDate!)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return { node, daysRemaining: diffDays }
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)

    setNotifications(upcoming)
    setUnreadCount(upcoming.length)
  }, [nodes, showNotifications, notificationThreshold])

  // Mark all as read
  const markAllAsRead = () => {
    setUnreadCount(0)
  }

  // Get notification severity
  const getNotificationSeverity = (daysRemaining: number): "low" | "medium" | "high" => {
    if (daysRemaining <= 1) return "high"
    if (daysRemaining <= 3) return "medium"
    return "low"
  }

  // Get notification color
  const getNotificationColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "text-amber-500 bg-amber-100 dark:bg-amber-900 dark:text-amber-200"
      case "low":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Deadline Notifications</h3>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2">
            Mark all as read
          </Button>
        </div>

        <div className="space-y-4">
          {/* Settings */}
          <Card>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-notifications" className="text-sm">
                    Show notifications
                  </Label>
                  <Switch id="show-notifications" checked={showNotifications} onCheckedChange={setShowNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm">
                    Email notifications
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {notifications.length > 0 ? (
              notifications.map(({ node, daysRemaining }) => {
                const severity = getNotificationSeverity(daysRemaining)
                return (
                  <Card key={node.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3 flex items-start gap-3" onClick={() => onNodeSelect(node.id)}>
                      <div className={cn("mt-0.5 p-1.5 rounded-full", getNotificationColor(severity))}>
                        {severity === "high" ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{node.data.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              daysRemaining === 0 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "",
                            )}
                          >
                            {daysRemaining === 0 ? "Today" : daysRemaining === 1 ? "Tomorrow" : `${daysRemaining} days`}
                          </Badge>
                        </div>
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                          {node.data.description || "No description"}
                        </p>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          Due: {new Date(node.data.dueDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                {showNotifications ? "No upcoming deadlines" : "Notifications are disabled"}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

