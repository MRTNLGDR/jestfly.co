import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QuoteIcon } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Jestfly transformou minha carreira musical. Agora posso me conectar diretamente com meus fãs e monetizar minha música de maneiras que nunca imaginei.",
      name: "Amanda Silva",
      role: "Artista Independente",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "Como fã, adoro poder apoiar meus artistas favoritos diretamente. Os eventos ao vivo e o sistema de JestCoins tornam tudo mais interativo e divertido.",
      name: "Carlos Mendes",
      role: "Fã e Colecionador",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "O planejador de carreira é uma ferramenta incrível. Me ajudou a visualizar meus objetivos e traçar um caminho claro para alcançá-los na indústria musical.",
      name: "Juliana Costa",
      role: "Artista Emergente",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-black/30 to-black/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            O que dizem sobre nós
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Artistas e fãs compartilham suas experiências com a plataforma Jestfly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black/30 border-white/10">
              <CardContent className="p-6">
                <QuoteIcon className="h-8 w-8 text-iridescent-2 mb-4" />
                <p className="mb-6 text-muted-foreground">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

