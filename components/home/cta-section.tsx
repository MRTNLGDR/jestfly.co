import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-iridescent-1/20 via-iridescent-2/20 to-iridescent-3/20">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Comece sua jornada musical hoje
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Junte-se a milhares de artistas e fãs na plataforma Jestfly e transforme sua experiência musical.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            asChild
          >
            <Link href="/register">Criar conta</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
            <Link href="/demo">Ver demonstração</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

