import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MusicIcon, CalendarIcon, ShoppingBagIcon, HeartIcon, CoinsIcon as CoinIcon, UsersIcon } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <MusicIcon className="h-12 w-12 text-iridescent-1" />,
      title: "Compartilhe sua música",
      description:
        "Faça upload de álbuns e faixas para compartilhar com seus fãs. Organize sua discografia e destaque seus lançamentos mais recentes.",
    },
    {
      icon: <CalendarIcon className="h-12 w-12 text-iridescent-2" />,
      title: "Eventos e transmissões ao vivo",
      description:
        "Crie eventos presenciais ou virtuais. Transmita shows ao vivo diretamente na plataforma e conecte-se com seus fãs em tempo real.",
    },
    {
      icon: <ShoppingBagIcon className="h-12 w-12 text-iridescent-3" />,
      title: "Venda merchandise",
      description:
        "Crie sua loja online para vender camisetas, pôsteres, álbuns físicos e outros produtos exclusivos para seus fãs.",
    },
    {
      icon: <HeartIcon className="h-12 w-12 text-iridescent-1" />,
      title: "Construa sua base de fãs",
      description:
        "Conecte-se com seus fãs, receba feedback e construa uma comunidade engajada ao redor da sua música.",
    },
    {
      icon: <CoinIcon className="h-12 w-12 text-iridescent-2" />,
      title: "Sistema de recompensas JestCoin",
      description:
        "Recompense seus fãs mais fiéis com JestCoins, que podem ser usados para acessar conteúdo exclusivo e descontos em produtos.",
    },
    {
      icon: <UsersIcon className="h-12 w-12 text-iridescent-3" />,
      title: "Planejador de carreira",
      description:
        "Use nossa ferramenta interativa de planejamento de carreira para definir metas, acompanhar seu progresso e planejar seu futuro na música.",
    },
  ]

  return (
    <section className="py-20 bg-black/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Recursos para artistas e fãs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Jestfly oferece tudo o que você precisa para crescer como artista e conectar-se com seus fãs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/30 border-white/10 hover:border-white/20 transition-colors">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

