import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Award } from "lucide-react"

const topPredictors = [
  {
    rank: 1,
    name: "CelebGuru",
    avatar: "/diverse-group-avatars.png",
    accuracy: 94,
    predictions: 156,
    earnings: "$2,450",
  },
  {
    rank: 2,
    name: "PopCulturePro",
    avatar: "/pandora-ocean-scene.png",
    accuracy: 91,
    predictions: 203,
    earnings: "$2,180",
  },
  {
    rank: 3,
    name: "GossipKing",
    avatar: "/diverse-group-futuristic-setting.png",
    accuracy: 89,
    predictions: 178,
    earnings: "$1,920",
  },
  {
    rank: 4,
    name: "StarWatcher",
    avatar: "/diverse-group-futuristic-avatars.png",
    accuracy: 87,
    predictions: 145,
    earnings: "$1,650",
  },
  {
    rank: 5,
    name: "TrendSetter",
    avatar: "/diverse-futuristic-avatars.png",
    accuracy: 85,
    predictions: 167,
    earnings: "$1,480",
  },
]

export function Leaderboard() {
  return (
    <section id="leaderboard" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Trophy className="h-4 w-4" />
              Top Predictors
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Leaderboard</h2>
            <p className="text-muted-foreground">See who's making the best celebrity predictions</p>
          </div>

          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {topPredictors.map((predictor) => (
                <div key={predictor.rank} className="flex items-center gap-4 p-5 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-bold">
                    {predictor.rank === 1 && <Trophy className="h-5 w-5 text-accent" />}
                    {predictor.rank === 2 && <Award className="h-5 w-5 text-muted-foreground" />}
                    {predictor.rank === 3 && <Award className="h-5 w-5 text-chart-4" />}
                    {predictor.rank > 3 && <span className="text-muted-foreground">{predictor.rank}</span>}
                  </div>

                  <Avatar className="h-12 w-12">
                    <AvatarImage src={predictor.avatar || "/placeholder.svg"} alt={predictor.name} />
                    <AvatarFallback>{predictor.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{predictor.name}</div>
                    <div className="text-sm text-muted-foreground">{predictor.predictions} predictions</div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">{predictor.accuracy}%</span>
                  </div>

                  <Badge variant="secondary" className="hidden md:inline-flex">
                    {predictor.earnings}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Join thousands of users making predictions and earning rewards
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
