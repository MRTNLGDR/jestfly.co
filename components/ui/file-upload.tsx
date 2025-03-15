"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XIcon, FileIcon, ImageIcon, MusicIcon } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  onChange: (file: File) => void
  onClear: () => void
  value?: string
  accept?: string
  maxSize?: number // em MB
  isUploading?: boolean
  progress?: number
  error?: string
  previewType?: "image" | "audio" | "none"
  label?: string
  helperText?: string
}

export function FileUpload({
  onChange,
  onClear,
  value,
  accept = "image/*",
  maxSize = 5, // 5MB por padrão
  isUploading = false,
  progress = 0,
  error,
  previewType = "image",
  label = "Selecionar arquivo",
  helperText,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | null) => {
    if (!file) return

    // Verificar tamanho do arquivo
    const sizeInMB = file.size / (1024 * 1024)
    if (sizeInMB > maxSize) {
      alert(`O arquivo é muito grande. O tamanho máximo é ${maxSize}MB.`)
      return
    }

    setSelectedFile(file)
    onChange(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    handleFileChange(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    handleFileChange(file)
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onClear()
  }

  const getFileIcon = () => {
    if (accept.includes("image")) return <ImageIcon className="h-12 w-12 text-muted-foreground" />
    if (accept.includes("audio")) return <MusicIcon className="h-12 w-12 text-muted-foreground" />
    return <FileIcon className="h-12 w-12 text-muted-foreground" />
  }

  const getAcceptDescription = () => {
    if (accept.includes("image")) return "Imagens"
    if (accept.includes("audio")) return "Arquivos de áudio"
    return "Arquivos"
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        } ${error ? "border-destructive/50" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          ref={inputRef}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {!selectedFile && !value && (
          <div className="flex flex-col items-center justify-center py-4">
            {getFileIcon()}
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Arraste e solte um arquivo aqui, ou{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                selecione um arquivo
              </Button>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {getAcceptDescription()} • Máximo {maxSize}MB
            </p>
          </div>
        )}

        {(selectedFile || value) && !isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {previewType === "image" && value && (
                  <div className="relative h-12 w-12 rounded overflow-hidden">
                    <Image src={value || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                {previewType === "audio" && value && <audio src={value} controls className="h-8 max-w-full" />}
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile?.name || value?.split("/").pop()}
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)}MB</p>
                  )}
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={handleClear} disabled={isUploading}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2 py-2">
            <p className="text-sm text-center">Enviando arquivo...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

