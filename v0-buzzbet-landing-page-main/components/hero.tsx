import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Trophy } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <TrendingUp className="h-4 w-4" />
            Pioneiro em Previsões de Celebridades
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Transforme Fofocas de Celebridades em <span className="text-accent">Previsões Vencedoras</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl max-w-2xl mx-auto">
            Um mercado de previsões de celebridades que transforma fofocas em uma experiência social e gamificada. Preveja eventos de celebridades
            com amigos e ganhe recompensas por previsões precisas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
              Começar a Prever
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Ver Mercados
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Usuários Ativos</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Mercados ao Vivo</div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border">
              <Trophy className="h-8 w-8 text-success" />
              <div className="text-2xl font-bold">$50K+</div>
              <div className="text-sm text-muted-foreground">Recompensas Pagas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
