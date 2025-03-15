"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutTemplateIcon as TemplateIcon,
  CheckIcon,
  MusicIcon,
  CodeIcon,
  PaletteIcon,
  BriefcaseIcon,
  GraduationCapIcon,
} from "lucide-react"
import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { useToast } from "@/hooks/use-toast"
import { careerTemplates } from "./template-data"

interface TemplateGalleryProps {
  onApplyTemplate: (nodes: CareerNode[], connections: NodeConnection[]) => void
}

export function TemplateGallery({ onApplyTemplate }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return

    const template = careerTemplates.find((t) => t.id === selectedTemplate)
    if (!template) return

    onApplyTemplate(template.nodes, template.connections)
    setIsDialogOpen(false)

    toast({
      title: "Template Applied",
      description: `"${template.title}" template has been applied to your plan.`,
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <TemplateIcon className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Career Plan Templates</DialogTitle>
          <DialogDescription>
            Choose a template to jumpstart your career planning. Templates provide a structured framework that you can
            customize.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {careerTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onSelect={() => setSelectedTemplate(template.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {careerTemplates
                  .filter((t) => t.category === "tech")
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="creative" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {careerTemplates
                  .filter((t) => t.category === "creative")
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {careerTemplates
                  .filter((t) => t.category === "business")
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {careerTemplates
                  .filter((t) => t.category === "education")
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => setSelectedTemplate(template.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyTemplate} disabled={!selectedTemplate}>
            Apply Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface TemplateCardProps {
  template: {
    id: string
    title: string
    description: string
    category: string
    difficulty: "beginner" | "intermediate" | "advanced"
    nodeCount: number
    timeframe: string
    icon: React.ReactNode
    nodes: CareerNode[]
    connections: NodeConnection[]
  }
  isSelected: boolean
  onSelect: () => void
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tech":
        return <CodeIcon className="h-4 w-4" />
      case "creative":
        return <PaletteIcon className="h-4 w-4" />
      case "music":
        return <MusicIcon className="h-4 w-4" />
      case "business":
        return <BriefcaseIcon className="h-4 w-4" />
      case "education":
        return <GraduationCapIcon className="h-4 w-4" />
      default:
        return <TemplateIcon className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-blue-500 shadow-md" : ""}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              {template.icon || getCategoryIcon(template.category)}
            </div>
            <CardTitle className="text-lg">{template.title}</CardTitle>
          </div>
          {isSelected && (
            <div className="bg-blue-500 text-white rounded-full p-1">
              <CheckIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getCategoryIcon(template.category)}
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </Badge>
          <Badge className={getDifficultyColor(template.difficulty)}>
            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{template.nodeCount} nodes</span>
        <span>{template.timeframe}</span>
      </CardFooter>
    </Card>
  )
}

