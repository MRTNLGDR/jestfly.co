"use client"

import { useState } from "react"
import { CalendarIcon, Download, ExternalLink } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { CareerNode } from "@/types/career-planner"

interface CalendarIntegrationProps {
  nodes: CareerNode[]
  onNodeSelect: (nodeId: string) => void
}

export function CalendarIntegration({ nodes, onNodeSelect }: CalendarIntegrationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarView, setCalendarView] = useState<"month" | "agenda">("month")
  const [calendarProvider, setCalendarProvider] = useState<string>("google")
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("1day")

  // Get nodes with due dates
  const nodesWithDueDates = nodes.filter((node) => node.data.dueDate)

  // Get nodes due on selected date
  const getNodesForDate = (date: Date) => {
    return nodesWithDueDates.filter((node) => {
      const nodeDate = new Date(node.data.dueDate!)
      return (
        nodeDate.getDate() === date.getDate() &&
        nodeDate.getMonth() === date.getMonth() &&
        nodeDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Get dates with nodes
  const getDatesWithNodes = () => {
    return nodesWithDueDates.map((node) => new Date(node.data.dueDate!))
  }

  // Generate iCal file
  const generateICalFile = () => {
    // This is a simplified version - in a real app, you'd use a library like ical-generator
    let icalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jestfly//Career Planner//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ]

    nodesWithDueDates.forEach((node) => {
      const dueDate = new Date(node.data.dueDate!)
      const dateString = dueDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

      icalContent = [
        ...icalContent,
        "BEGIN:VEVENT",
        `UID:${node.id}@jestfly.com`,
        `DTSTAMP:${dateString}`,
        `DTSTART:${dateString}`,
        `SUMMARY:${node.data.title}`,
        `DESCRIPTION:${node.data.description || ""}`,
        "END:VEVENT",
      ]
    })

    icalContent.push("END:VCALENDAR")

    const blob = new Blob([icalContent.join("\r\n")], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "career-plan.ics"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get external calendar URL
  const getExternalCalendarUrl = () => {
    switch (calendarProvider) {
      case "google":
        return "https://calendar.google.com/calendar/u/0/r/settings/createcalendar"
      case "outlook":
        return "https://outlook.live.com/calendar/0/addcalendar"
      case "apple":
        return "https://www.icloud.com/calendar/"
      default:
        return "#"
    }
  }

  // Get node color based on type
  const getNodeColor = (type: string) => {
    switch (type) {
      case "goal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "milestone":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "resource":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "note":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Calendar Integration</DialogTitle>
          <DialogDescription>
            View and manage your career plan deadlines in a calendar format or export them to your preferred calendar
            app.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="view" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">Calendar View</TabsTrigger>
            <TabsTrigger value="export">Export & Sync</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <Select value={calendarView} onValueChange={(value) => setCalendarView(value as "month" | "agenda")}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {calendarView === "month" ? (
              <div className="flex flex-col md:flex-row gap-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md"
                  modifiers={{
                    hasDueDate: getDatesWithNodes(),
                  }}
                  modifiersClassNames={{
                    hasDueDate: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold",
                  }}
                />

                <div className="flex-1">
                  <h3 className="font-medium mb-2">
                    {selectedDate ? selectedDate.toLocaleDateString(undefined, { dateStyle: "full" }) : "Select a date"}
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedDate &&
                      getNodesForDate(selectedDate).map((node) => (
                        <Card
                          key={node.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onNodeSelect(node.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{node.data.title}</h4>
                                <Badge className={getNodeColor(node.type)}>
                                  {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                                </Badge>
                              </div>
                              {node.data.completed && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                >
                                  Completed
                                </Badge>
                              )}
                            </div>
                            {node.data.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{node.data.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    {selectedDate && getNodesForDate(selectedDate).length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400">No items due on this date</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {nodesWithDueDates.length > 0 ? (
                  nodesWithDueDates
                    .sort((a, b) => new Date(a.data.dueDate!).getTime() - new Date(b.data.dueDate!).getTime())
                    .map((node) => (
                      <Card
                        key={node.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onNodeSelect(node.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{node.data.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getNodeColor(node.type)}>
                                  {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(node.data.dueDate!).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {node.data.completed && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Completed
                              </Badge>
                            )}
                          </div>
                          {node.data.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{node.data.description}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">No items with due dates</div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Export Options</h3>
                <Button onClick={generateICalFile} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download iCal File
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Calendar Provider</h3>
                <Select value={calendarProvider} onValueChange={setCalendarProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Calendar</SelectItem>
                    <SelectItem value="outlook">Outlook Calendar</SelectItem>
                    <SelectItem value="apple">Apple Calendar</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => window.open(getExternalCalendarUrl(), "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open {calendarProvider.charAt(0).toUpperCase() + calendarProvider.slice(1)} Calendar
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-medium">Sync Settings</h3>
                <Card>
                  <CardContent className="p-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sync-enabled" className="font-medium">
                          Auto-sync with calendar
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Automatically sync your career plan deadlines with your calendar
                        </p>
                      </div>
                      <Switch id="sync-enabled" checked={syncEnabled} onCheckedChange={setSyncEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reminder-enabled" className="font-medium">
                          Enable reminders
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get reminders for upcoming deadlines</p>
                      </div>
                      <Switch id="reminder-enabled" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
                    </div>

                    {reminderEnabled && (
                      <div className="space-y-1">
                        <Label htmlFor="reminder-time" className="text-sm">
                          Reminder time
                        </Label>
                        <Select value={reminderTime} onValueChange={setReminderTime}>
                          <SelectTrigger id="reminder-time">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30min">30 minutes before</SelectItem>
                            <SelectItem value="1hour">1 hour before</SelectItem>
                            <SelectItem value="1day">1 day before</SelectItem>
                            <SelectItem value="2days">2 days before</SelectItem>
                            <SelectItem value="1week">1 week before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

