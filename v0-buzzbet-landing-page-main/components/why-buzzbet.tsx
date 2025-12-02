import { Card } from "@/components/ui/card"
import { Target, Zap, Trophy, Users } from "lucide-react"

export function WhyBuzzbet() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Why Buzzbet?</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            The first celebrity prediction market combining entertainment, social engagement, and rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">The Need</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  People constantly discuss celebrities but lack an interactive way to engage. Current betting apps
                  focus only on sports, leaving pop culture fans underserved.
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
                <h3 className="font-semibold mb-2">Our Approach</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A fun, easy-to-use app that lets users predict celebrity events with friends, featuring gamification
                  and social interaction at its core.
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
                <h3 className="font-semibold mb-2">The Benefits</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Provides entertainment, social engagement, and small rewards for accurate predictions. Turn your
                  celebrity knowledge into wins.
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
                <h3 className="font-semibold mb-2">Our Edge</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  First mover in celebrity predictions. While others focus on sports or politics, we own the pop culture
                  niche with viral, gamified experiences.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Why This Space?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A large, untapped opportunity combining entertainment, social media, and prediction markets. The
                  celebrity gossip industry is worth billions, yet no platform gamifies engagement.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">How We'll Win</h3>
                <p className="text-muted-foreground leading-relaxed">
                  First mover advantage in the celebrity prediction niche. Our viral, gamified, and community-driven
                  experience makes us the go-to platform for pop culture predictions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
