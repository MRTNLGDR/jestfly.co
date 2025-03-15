import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { UPLOAD_BUCKETS } from "@/lib/upload-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Cria uma instância do cliente Supabase com a chave de serviço
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Esta rota deve ser chamada apenas uma vez durante a configuração
export async function POST() {
  try {
    // Verificar autenticação e autorização
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bucketsToCreate = Object.values(UPLOAD_BUCKETS)
    const results = []

    // Criar cada bucket
    for (const bucket of bucketsToCreate) {
      try {
        // Verificar se o bucket já existe
        const { data: existingBucket } = await supabase.storage.getBucket(bucket)

        if (existingBucket) {
          results.push({ bucket, status: "already_exists" })
          continue
        }

        // Criar bucket
        const { data, error } = await supabase.storage.createBucket(bucket, {
          public: true, // Bucket público (acessível sem autenticação)
          fileSizeLimit: 52428800, // 50MB em bytes
        })

        if (error) {
          results.push({ bucket, status: "error", message: error.message })
        } else {
          results.push({ bucket, status: "created" })
        }
      } catch (error: any) {
        results.push({ bucket, status: "error", message: error.message })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error("Error initializing storage buckets:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

