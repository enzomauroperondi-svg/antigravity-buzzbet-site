import { Card } from "@/components/ui/card"
import { Target, Zap, Trophy, Users } from "lucide-react"

export function WhyBuzzbet() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Por que Buzzbet?</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            O primeiro mercado de previsões de celebridades combinando entretenimento, engajamento social e recompensas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">A Necessidade</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  As pessoas discutem constantemente sobre celebridades, mas não têm uma maneira interativa de se engajar. Os aplicativos de apostas atuais
                  focam apenas em esportes, deixando os fãs da cultura pop desatendidos.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Nossa Abordagem</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Um aplicativo divertido e fácil de usar que permite aos usuários prever eventos de celebridades com amigos, com gamificação
                  e interação social no centro.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Os Benefícios</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Proporciona entretenimento, engajamento social e pequenas recompensas por previsões precisas. Transforme seu
                  conhecimento sobre celebridades em vitórias.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-chart-4/10 p-3">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Nossa Vantagem</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pioneiro em previsões de celebridades. Enquanto outros focam em esportes ou política, nós dominamos o nicho da cultura pop
                  com experiências virais e gamificadas.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Por que este Espaço?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Uma grande oportunidade inexplorada combinando entretenimento, mídia social e mercados de previsão. A
                  indústria de fofocas de celebridades vale bilhões, mas nenhuma plataforma gamifica o engajamento.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Como Venceremos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Vantagem de pioneiro no nicho de previsões de celebridades. Nossa experiência viral, gamificada e impulsionada pela comunidade
                  nos torna a plataforma de referência para previsões da cultura pop.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
