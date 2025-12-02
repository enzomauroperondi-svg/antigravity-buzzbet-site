"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, Users } from "lucide-react"
import { useWeb3 } from "@/lib/web3-context"
import { useState, useEffect } from "react"
import { TradingModal } from "@/components/trading-modal"

interface Market {
  id: number
  question: string
  image: string
  totalYes: number
  totalNo: number
  oddsYes: number
  oddsNo: number
  volume: string
  traders: number
  endsIn: string
  category: string
}

export function TrendingMarkets() {
  const { account } = useWeb3()
  const [markets, setMarkets] = useState<Market[]>([])
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchMarkets()
    const interval = setInterval(fetchMarkets, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(`/api/markets?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()

      console.log(
        "[v0] Markets fetched from API:",
        data.map((m: Market) => ({
          id: m.id,
          question: m.question.substring(0, 30) + "...",
          totalYes: m.totalYes,
          totalNo: m.totalNo,
          oddsYes: m.oddsYes,
          oddsNo: m.oddsNo,
        })),
      )

      setMarkets(data)
    } catch (error) {
      console.error("Error fetching markets:", error)
    }
  }

  const handleBetClick = (market: Market) => {
    if (!account) {
      alert("Please connect your wallet to place a bet!")
      return
    }
    setSelectedMarket(market)
    setIsModalOpen(true)
  }

  const handleBetPlaced = () => {
    fetchMarkets()
  }

  return (
    <section id="markets" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Trending Markets</h2>
            <p className="mt-2 text-muted-foreground">Predict celebrity events and earn rewards</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="mb-4 text-xs text-muted-foreground text-center">v2.0 - Dynamic Odds System Active</div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <Card key={market.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={market.image || "/placeholder.svg"}
                  alt={market.question}
                  className="h-full w-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">{market.category}</Badge>
              </div>

              <div className="p-5">
                <h3 className="mb-4 text-base font-semibold leading-relaxed text-pretty">{market.question}</h3>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-4 border-success/50 hover:bg-success/10 bg-transparent"
                    onClick={() => handleBetClick(market)}
                  >
                    <span className="text-2xl font-bold text-success">Yes</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-4 border-destructive/50 hover:bg-destructive/10 bg-transparent"
                    onClick={() => handleBetClick(market)}
                  >
                    <span className="text-2xl font-bold text-destructive">No</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{market.volume}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{market.traders}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{market.endsIn}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedMarket && (
        <TradingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          market={selectedMarket}
          onOrderPlaced={handleBetPlaced}
        />
      )}
    </section>
  )
}
