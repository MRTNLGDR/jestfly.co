"use client"

import { useState } from "react"
import { uploadFile } from "@/lib/upload-service"

interface UseFileUploadOptions {
  bucket: string
  path: string
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

export function useFileUpload({ bucket, path, onSuccess, onError }: UseFileUploadOptions) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  const upload = async (file: File) => {
    setIsUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Simular progresso (na vida real, isso viria do evento progress do upload)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress > 90 ? 90 : newProgress
        })
      }, 200)

      // Fazer o upload
      const fileUrl = await uploadFile(file, bucket, path)

      // Limpar intervalo e definir progresso como 100%
      clearInterval(progressInterval)
      setProgress(100)
      setUrl(fileUrl)

      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess(fileUrl)
      }

      return fileUrl
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido ao fazer upload"
      setError(errorMessage)

      // Chamar callback de erro
      if (onError) {
        onError(err)
      }

      throw err
    } finally {
      // Pequeno atraso antes de considerar upload completo
      setTimeout(() => {
        setIsUploading(false)
      }, 500)
    }
  }

  const reset = () => {
    setUrl(null)
    setError(null)
    setProgress(0)
  }

  return {
    upload,
    reset,
    isUploading,
    progress,
    error,
    url,
  }
}

