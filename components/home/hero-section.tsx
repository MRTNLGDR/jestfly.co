"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlayIcon, PauseIcon } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Aqui você poderia adicionar lógica para reproduzir/pausar um vídeo ou áudio de fundo
  }

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background com efeito de gradiente */}
      <div className="absolute inset-0 z-0">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,41,170,0.2)_0,rgba(0,0,0,0)_70%)]" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text">
              Conectando artistas e fãs
            </span>{" "}
            através da música
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Jestfly é a plataforma completa para artistas compartilharem sua música, eventos e produtos, enquanto fãs
            descobrem novos talentos e apoiam seus artistas favoritos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
              asChild
            >
              <Link href="/register">Começar agora</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" onClick={togglePlay}>
              {isPlaying ? (
                <>
                  <PauseIcon className="mr-2 h-4 w-4" /> Pausar vídeo
                </>
              ) : (
                <>
                  <PlayIcon className="mr-2 h-4 w-4" /> Ver vídeo
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl">
          <div>
            <p className="text-4xl font-bold bg-gradient-to-r from-iridescent-1 to-iridescent-2 text-transparent bg-clip-text">
              10k+
            </p>
            <p className="text-muted-foreground">Artistas</p>
          </div>
          <div>
            <p className="text-4xl font-bold bg-gradient-to-r from-iridescent-2 to-iridescent-3 text-transparent bg-clip-text">
              50k+
            </p>
            <p className="text-muted-foreground">Fãs</p>
          </div>
          <div>
            <p className="text-4xl font-bold bg-gradient-to-r from-iridescent-3 to-iridescent-1 text-transparent bg-clip-text">
              5k+
            </p>
            <p className="text-muted-foreground">Eventos</p>
          </div>
          <div>
            <p className="text-4xl font-bold bg-gradient-to-r from-iridescent-1 to-iridescent-3 text-transparent bg-clip-text">
              100k+
            </p>
            <p className="text-muted-foreground">Faixas</p>
          </div>
        </div>
      </div>
    </section>
  )
}

