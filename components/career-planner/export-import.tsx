"use client"

import type React from "react"

import { useState } from "react"
import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DownloadIcon, UploadIcon, FileIcon, AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExportImportProps {
  nodes: CareerNode[]
  connections: NodeConnection[]
  onImport: (data: { nodes: CareerNode[]; connections: NodeConnection[] }) => void
}

export function ExportImport({ nodes, connections, onImport }: ExportImportProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  // Handle export
  const handleExport = () => {
    const data = {
      nodes,
      connections,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `career-plan-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle import from file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null)

    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)

        // Validate the imported data
        if (!data.nodes || !Array.isArray(data.nodes) || !data.connections || !Array.isArray(data.connections)) {
          throw new Error("Invalid file format. The file must contain nodes and connections arrays.")
        }

        // Validate each node
        for (const node of data.nodes) {
          if (!node.id || !node.type || !node.position || !node.data || !node.data.title) {
            throw new Error("Invalid node format in the imported file.")
          }
        }

        // Validate each connection
        for (const conn of data.connections) {
          if (!conn.id || !conn.sourceId || !conn.targetId) {
            throw new Error("Invalid connection format in the imported file.")
          }
        }

        onImport({
          nodes: data.nodes,
          connections: data.connections,
        })

        setIsImportDialogOpen(false)
      } catch (error: any) {
        setImportError(error.message || "Failed to import file. Please check the file format.")
      }
    }

    reader.onerror = () => {
      setImportError("Error reading the file. Please try again.")
    }

    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handleExport} className="flex-1" disabled={nodes.length === 0}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Plan
        </Button>

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <UploadIcon className="h-4 w-4 mr-2" />
              Import Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Career Plan</DialogTitle>
              <DialogDescription>
                Upload a previously exported career plan file to import it. This will replace your current plan.
              </DialogDescription>
            </DialogHeader>

            {importError && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plan-file">Select File</Label>
                <div className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-gray-400" />
                  <Input id="plan-file" type="file" accept=".json" onChange={handleFileImport} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

