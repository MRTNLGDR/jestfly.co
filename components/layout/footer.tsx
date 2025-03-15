import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicIcon, FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black/80 border-t border-white/10 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <MusicIcon className="h-8 w-8 text-iridescent-1 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text">
                Jestfly
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Conectando artistas e fãs através da música, eventos e experiências únicas.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="rounded-full hover:text-iridescent-1">
                <FacebookIcon className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:text-iridescent-1">
                <TwitterIcon className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:text-iridescent-1">
                <InstagramIcon className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:text-iridescent-1">
                <YoutubeIcon className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Para Artistas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/artist/create" className="text-muted-foreground hover:text-white transition-colors">
                  Criar perfil de artista
                </Link>
              </li>
              <li>
                <Link href="/artist/dashboard" className="text-muted-foreground hover:text-white transition-colors">
                  Dashboard do artista
                </Link>
              </li>
              <li>
                <Link href="/career-planner" className="text-muted-foreground hover:text-white transition-colors">
                  Planejador de carreira
                </Link>
              </li>
              <li>
                <Link href="/artist/analytics" className="text-muted-foreground hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/artist/monetization" className="text-muted-foreground hover:text-white transition-colors">
                  Monetização
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Para Fãs</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/artists" className="text-muted-foreground hover:text-white transition-colors">
                  Descobrir artistas
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/merch" className="text-muted-foreground hover:text-white transition-colors">
                  Merchandise
                </Link>
              </li>
              <li>
                <Link href="/profile/jestcoins" className="text-muted-foreground hover:text-white transition-colors">
                  JestCoins
                </Link>
              </li>
              <li>
                <Link href="/live" className="text-muted-foreground hover:text-white transition-colors">
                  Transmissões ao vivo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Inscreva-se para receber novidades sobre artistas, eventos e recursos da plataforma.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-transparent border-white/20 focus:border-white/40"
              />
              <Button className="bg-iridescent-1 hover:bg-iridescent-1/90">Inscrever</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Jestfly. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Termos de Serviço
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Documentação
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

