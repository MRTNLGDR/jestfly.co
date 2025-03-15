import { createClient } from "@supabase/supabase-js"

// Cria uma instância do cliente Supabase para Storage
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

/**
 * Faz upload de um arquivo para o Supabase Storage
 * @param file - O arquivo a ser enviado
 * @param bucket - O bucket do Supabase Storage
 * @param path - O caminho dentro do bucket onde o arquivo será armazenado
 * @returns URL pública do arquivo
 */
export async function uploadFile(file: File, bucket: string, path: string): Promise<string> {
  try {
    // Gera um nome de arquivo único baseado no timestamp e nome original
    const timestamp = new Date().getTime()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
    const fullPath = `${path}/${fileName}`

    // Faz o upload do arquivo
    const { data, error } = await supabase.storage.from(bucket).upload(fullPath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw new Error(`Erro ao fazer upload: ${error.message}`)
    }

    // Obtém a URL pública do arquivo
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath)

    return urlData.publicUrl
  } catch (error: any) {
    console.error("Erro no serviço de upload:", error)
    throw new Error(`Falha no upload: ${error.message}`)
  }
}

/**
 * Exclui um arquivo do Supabase Storage
 * @param url - URL pública do arquivo
 * @param bucket - O bucket do Supabase Storage
 * @returns Boolean indicando sucesso ou falha
 */
export async function deleteFile(url: string, bucket: string): Promise<boolean> {
  try {
    // Extrai o caminho do arquivo da URL
    const urlObj = new URL(url)
    const pathWithBucket = urlObj.pathname
    const path = pathWithBucket.replace(`/${bucket}/`, "")

    // Exclui o arquivo
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw new Error(`Erro ao excluir arquivo: ${error.message}`)
    }

    return true
  } catch (error: any) {
    console.error("Erro ao excluir arquivo:", error)
    return false
  }
}

/**
 * Retorna os buckets disponíveis para upload
 */
export const UPLOAD_BUCKETS = {
  ARTIST_IMAGES: "artist-images",
  ALBUM_COVERS: "album-covers",
  AUDIO_TRACKS: "audio-tracks",
  EVENT_IMAGES: "event-images",
  MERCHANDISE_IMAGES: "merchandise-images",
  USER_AVATARS: "user-avatars",
}

