"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3-context"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { ClosePositionModal } from "@/components/close-position-modal"

interface Position {
  marketId: number
  side: "yes" | "no"
  shares: number
  avgPrice: number
  market: {
    question: string
    category: string
  }
}

export function Portfolio() {
  const { account } = useWeb3()
  const [positions, setPositions] = useState<Position[]>([])
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

  useEffect(() => {
    if (account) {
      fetchPositions()
      const interval = setInterval(fetchPositions, 5000)
      return () => clearInterval(interval)
    }
  }, [account])

  const fetchPositions = async () => {
    if (!account) return

    try {
      const response = await fetch(`/api/user-positions?walletAddress=${account}`)
      const data = await response.json()
      setPositions(data.positions || [])
    } catch (error) {
      console.error("Error fetching positions:", error)
    }
  }

  const handleClosePosition = (position: Position) => {
    setSelectedPosition(position)
    setIsCloseModalOpen(true)
  }

  if (!account) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Conecte Sua Carteira</h3>
            <p className="text-muted-foreground">Conecte sua carteira para ver suas posições</p>
          </div>
        </div>
      </section>
    )
  }

  if (positions.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Minhas Posições</h2>
          <div className="text-center text-muted-foreground">
            <p>Nenhuma posição ativa. Comece a negociar para construir seu portfólio!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Minhas Posições</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {positions.map((position, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">{position.market.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">{position.market.category}</p>
                  </div>
                  {position.side === "yes" ? (
                    <TrendingUp className="h-5 w-5 text-success ml-2" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive ml-2" />
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posição</span>
                    <span className={`font-semibold ${position.side === "yes" ? "text-success" : "text-destructive"}`}>
                      {position.shares} ações {position.side.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preço Médio</span>
                    <span className="font-medium">{position.avgPrice.toFixed(1)}¢</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo Total</span>
                    <span className="font-medium">{((position.avgPrice / 100) * position.shares).toFixed(4)} ETH</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleClosePosition(position)}
                >
                  Vender / Fechar
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedPosition && (
        <ClosePositionModal
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          position={selectedPosition}
          onPositionClosed={fetchPositions}
        />
      )}
    </>
  )
}
