"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { CareerNode } from "@/types/career-planner"

interface FiltersSearchProps {
  nodes: CareerNode[]
  onFilterChange: (filteredNodes: CareerNode[]) => void
}

type FilterOption = {
  id: string
  label: string
  value: string
  group: string
}

export function FiltersSearch({ nodes, onFilterChange }: FiltersSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [filteredNodes, setFilteredNodes] = useState<CareerNode[]>(nodes)

  // Define filter options
  const filterOptions: FilterOption[] = [
    // Node types
    { id: "type-goal", label: "Goals", value: "goal", group: "Type" },
    { id: "type-milestone", label: "Milestones", value: "milestone", group: "Type" },
    { id: "type-task", label: "Tasks", value: "task", group: "Type" },
    { id: "type-resource", label: "Resources", value: "resource", group: "Type" },
    { id: "type-note", label: "Notes", value: "note", group: "Type" },

    // Status
    { id: "status-completed", label: "Completed", value: "completed", group: "Status" },
    { id: "status-pending", label: "Pending", value: "pending", group: "Status" },

    // Priority
    { id: "priority-high", label: "High Priority", value: "high", group: "Priority" },
    { id: "priority-medium", label: "Medium Priority", value: "medium", group: "Priority" },
    { id: "priority-low", label: "Low Priority", value: "low", group: "Priority" },

    // Due date
    { id: "due-overdue", label: "Overdue", value: "overdue", group: "Due Date" },
    { id: "due-today", label: "Due Today", value: "today", group: "Due Date" },
    { id: "due-week", label: "Due This Week", value: "week", group: "Due Date" },
    { id: "due-month", label: "Due This Month", value: "month", group: "Due Date" },
  ]

  // Apply filters and search
  useEffect(() => {
    let result = [...nodes]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (node) =>
          node.data.title.toLowerCase().includes(query) ||
          (node.data.description && node.data.description.toLowerCase().includes(query)),
      )
    }

    // Apply filters
    if (selectedFilters.length > 0) {
      // Get filter values by group
      const typeFilters = selectedFilters
        .map((id) => filterOptions.find((option) => option.id === id))
        .filter((option) => option && option.group === "Type")
        .map((option) => option!.value)

      const statusFilters = selectedFilters
        .map((id) => filterOptions.find((option) => option.id === id))
        .filter((option) => option && option.group === "Status")
        .map((option) => option!.value)

      const priorityFilters = selectedFilters
        .map((id) => filterOptions.find((option) => option.id === id))
        .filter((option) => option && option.group === "Priority")
        .map((option) => option!.value)

      const dueDateFilters = selectedFilters
        .map((id) => filterOptions.find((option) => option.id === id))
        .filter((option) => option && option.group === "Due Date")
        .map((option) => option!.value)

      // Apply type filters
      if (typeFilters.length > 0) {
        result = result.filter((node) => typeFilters.includes(node.type))
      }

      // Apply status filters
      if (statusFilters.length > 0) {
        result = result.filter((node) => {
          if (statusFilters.includes("completed")) {
            return node.data.completed
          }
          if (statusFilters.includes("pending")) {
            return !node.data.completed
          }
          return true
        })
      }

      // Apply priority filters
      if (priorityFilters.length > 0) {
        result = result.filter((node) => priorityFilters.includes(node.data.priority || ""))
      }

      // Apply due date filters
      if (dueDateFilters.length > 0) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const weekEnd = new Date(today)
        weekEnd.setDate(today.getDate() + (7 - today.getDay()))

        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

        result = result.filter((node) => {
          if (!node.data.dueDate) return false

          const dueDate = new Date(node.data.dueDate)
          dueDate.setHours(0, 0, 0, 0)

          if (dueDateFilters.includes("overdue")) {
            return dueDate < today && !node.data.completed
          }

          if (dueDateFilters.includes("today")) {
            return (
              dueDate.getDate() === today.getDate() &&
              dueDate.getMonth() === today.getMonth() &&
              dueDate.getFullYear() === today.getFullYear()
            )
          }

          if (dueDateFilters.includes("week")) {
            return dueDate >= today && dueDate <= weekEnd
          }

          if (dueDateFilters.includes("month")) {
            return (
              dueDate.getMonth() === today.getMonth() &&
              dueDate.getFullYear() === today.getFullYear() &&
              dueDate >= today
            )
          }

          return true
        })
      }
    }

    setFilteredNodes(result)
    onFilterChange(result)
  }, [nodes, searchQuery, selectedFilters, onFilterChange])

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters([])
    setSearchQuery("")
  }

  // Get selected filter count by group
  const getSelectedFilterCountByGroup = (group: string) => {
    return selectedFilters.filter((id) => {
      const option = filterOptions.find((opt) => opt.id === id)
      return option && option.group === group
    }).length
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {selectedFilters.length > 0 && (
                  <Badge className="ml-1 bg-primary text-primary-foreground">{selectedFilters.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search filters..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>

                  <CommandGroup heading="Type">
                    {filterOptions
                      .filter((option) => option.group === "Type")
                      .map((option) => (
                        <CommandItem
                          key={option.id}
                          onSelect={() => toggleFilter(option.id)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={option.id}
                              checked={selectedFilters.includes(option.id)}
                              onCheckedChange={() => toggleFilter(option.id)}
                            />
                            <Label htmlFor={option.id} className="flex-1">
                              {option.label}
                            </Label>
                          </div>
                          {selectedFilters.includes(option.id) && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Status">
                    {filterOptions
                      .filter((option) => option.group === "Status")
                      .map((option) => (
                        <CommandItem
                          key={option.id}
                          onSelect={() => toggleFilter(option.id)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={option.id}
                              checked={selectedFilters.includes(option.id)}
                              onCheckedChange={() => toggleFilter(option.id)}
                            />
                            <Label htmlFor={option.id} className="flex-1">
                              {option.label}
                            </Label>
                          </div>
                          {selectedFilters.includes(option.id) && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Priority">
                    {filterOptions
                      .filter((option) => option.group === "Priority")
                      .map((option) => (
                        <CommandItem
                          key={option.id}
                          onSelect={() => toggleFilter(option.id)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={option.id}
                              checked={selectedFilters.includes(option.id)}
                              onCheckedChange={() => toggleFilter(option.id)}
                            />
                            <Label htmlFor={option.id} className="flex-1">
                              {option.label}
                            </Label>
                          </div>
                          {selectedFilters.includes(option.id) && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Due Date">
                    {filterOptions
                      .filter((option) => option.group === "Due Date")
                      .map((option) => (
                        <CommandItem
                          key={option.id}
                          onSelect={() => toggleFilter(option.id)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={option.id}
                              checked={selectedFilters.includes(option.id)}
                              onCheckedChange={() => toggleFilter(option.id)}
                            />
                            <Label htmlFor={option.id} className="flex-1">
                              {option.label}
                            </Label>
                          </div>
                          {selectedFilters.includes(option.id) && <Check className="h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>

                {selectedFilters.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-800 p-2">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>

          {selectedFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active filters */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {getSelectedFilterCountByGroup("Type") > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Type:</span>
              <span>{getSelectedFilterCountByGroup("Type")}</span>
            </Badge>
          )}

          {getSelectedFilterCountByGroup("Status") > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Status:</span>
              <span>{getSelectedFilterCountByGroup("Status")}</span>
            </Badge>
          )}

          {getSelectedFilterCountByGroup("Priority") > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Priority:</span>
              <span>{getSelectedFilterCountByGroup("Priority")}</span>
            </Badge>
          )}

          {getSelectedFilterCountByGroup("Due Date") > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Due Date:</span>
              <span>{getSelectedFilterCountByGroup("Due Date")}</span>
            </Badge>
          )}

          <Badge variant="outline" className="flex items-center gap-1">
            <span>Results:</span>
            <span>{filteredNodes.length}</span>
          </Badge>
        </div>
      )}
    </div>
  )
}

