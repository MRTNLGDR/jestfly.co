"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"
import { useFileUpload } from "@/hooks/use-file-upload"
import { UPLOAD_BUCKETS } from "@/lib/upload-service"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useNotification } from "@/contexts/notification-context"

export interface Track {
  id?: string
  title: string
  duration: number
  audioUrl: string
}

interface TrackUploadFormProps {
  tracks: Track[]
  onChange: (tracks: Track[]) => void
  artistId: string
}

export function TrackUploadForm({ tracks, onChange, artistId }: TrackUploadFormProps) {
  const { showNotification } = useNotification()

  // Adicionar uma faixa vazia
  const addTrack = () => {
    onChange([...tracks, { title: "", duration: 0, audioUrl: "" }])
  }

  // Remover uma faixa pelo índice
  const removeTrack = (index: number) => {
    const newTracks = [...tracks]
    newTracks.splice(index, 1)
    onChange(newTracks)
  }

  // Atualizar uma faixa pelo índice
  const updateTrack = (index: number, field: keyof Track, value: any) => {
    const newTracks = [...tracks]
    newTracks[index] = { ...newTracks[index], [field]: value }
    onChange(newTracks)
  }

  // Calcular duração do áudio
  const calculateDuration = (index: number, audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.addEventListener("loadedmetadata", () => {
      // Duração em segundos
      const durationInSeconds = Math.round(audio.duration)
      updateTrack(index, "duration", durationInSeconds)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Faixas</h3>
        <Button type="button" variant="outline" size="sm" onClick={addTrack}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adicionar Faixa
        </Button>
      </div>

      {tracks.length === 0 && (
        <div className="text-center p-4 border border-dashed border-white/20 rounded-md">
          <p className="text-muted-foreground">Nenhuma faixa adicionada. Clique em "Adicionar Faixa" para começar.</p>
        </div>
      )}

      {tracks.map((track, index) => (
        <TrackItem
          key={index}
          track={track}
          index={index}
          artistId={artistId}
          onUpdate={(field, value) => updateTrack(index, field, value)}
          onRemove={() => removeTrack(index)}
          onCalculateDuration={(audioUrl) => calculateDuration(index, audioUrl)}
        />
      ))}
    </div>
  )
}

interface TrackItemProps {
  track: Track
  index: number
  artistId: string
  onUpdate: (field: keyof Track, value: any) => void
  onRemove: () => void
  onCalculateDuration: (audioUrl: string) => void
}

function TrackItem({ track, index, artistId, onUpdate, onRemove, onCalculateDuration }: TrackItemProps) {
  const { showNotification } = useNotification()

  // Use o hook de upload para a faixa de áudio
  const {
    upload,
    reset: resetUpload,
    isUploading,
    progress,
    error: uploadError,
    url: audioUrl,
  } = useFileUpload({
    bucket: UPLOAD_BUCKETS.AUDIO_TRACKS,
    path: `artists/${artistId}`,
    onSuccess: (url) => {
      onUpdate("audioUrl", url)
      onCalculateDuration(url)
      showNotification({
        title: "Sucesso",
        message: "Arquivo de áudio enviado com sucesso",
        type: "success",
      })
    },
    onError: (error) => {
      showNotification({
        title: "Erro",
        message: error.message || "Falha ao enviar arquivo de áudio",
        type: "error",
      })
    },
  })

  // Atualizar URL de áudio no estado do componente pai quando o upload for concluído
  useState(() => {
    if (audioUrl && !track.audioUrl) {
      onUpdate("audioUrl", audioUrl)
    }
  })

  const handleFileUpload = async (file: File) => {
    try {
      await upload(file)
    } catch (error) {
      // Erro já tratado pelo hook
      console.error("Erro ao fazer upload do áudio:", error)
    }
  }

  return (
    <div className="p-4 border border-white/20 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Faixa {index + 1}</h4>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2Icon className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`track-title-${index}`}>Título da Faixa</Label>
          <Input
            id={`track-title-${index}`}
            value={track.title}
            onChange={(e) => onUpdate("title", e.target.value)}
            required
            className="bg-transparent border-white/20 focus:border-white/40"
          />
        </div>

        <div className="space-y-2">
          <FileUpload
            label="Arquivo de Áudio"
            accept="audio/*"
            onChange={handleFileUpload}
            onClear={resetUpload}
            value={track.audioUrl || audioUrl || ""}
            isUploading={isUploading}
            progress={progress}
            error={uploadError || ""}
            previewType="audio"
            helperText="Formatos aceitos: MP3, WAV, OGG. Máximo 50MB."
          />
        </div>

        {track.duration > 0 && (
          <div className="text-sm text-muted-foreground">
            Duração: {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  )
}

