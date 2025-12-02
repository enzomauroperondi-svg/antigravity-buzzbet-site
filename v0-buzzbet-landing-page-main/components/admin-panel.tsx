"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ethers } from "ethers"

interface Market {
  id: number
  question: string
  category: string
  resolved?: boolean
  winner?: "yes" | "no"
}

interface Winner {
  wallet: string
  betAmount: number
  winnings: number
  totalPayout: number
}

export function AdminPanel() {
  const [adminKey, setAdminKey] = useState("")
  const [selectedMarket, setSelectedMarket] = useState("")
  const [winner, setWinner] = useState<"yes" | "no">("yes")
  const [loading, setLoading] = useState(false)
  const [markets, setMarkets] = useState<Market[]>([])
  const [resolvedWinners, setResolvedWinners] = useState<Winner[]>([])
  const [showWinners, setShowWinners] = useState(false)
  const [payoutInProgress, setPayoutInProgress] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("/api/markets")
        const data = await response.json()
        setMarkets(data)
      } catch (error) {
        console.error("Failed to fetch markets:", error)
      }
    }
    fetchMarkets()
  }, [])

  const resolveMarket = async () => {
    if (!adminKey || !selectedMarket) {
      toast({
        title: "Error",
        description: "Please enter admin key and market ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/resolve-market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: Number.parseInt(selectedMarket),
          winner,
          adminKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResolvedWinners(data.winners || [])
        setShowWinners(true)

        toast({
          title: "Market Resolved!",
          description: `${data.totalWinners} winners will receive ${data.totalPayouts.toFixed(4)} ETH total`,
        })

        const marketsResponse = await fetch("/api/markets")
        const updatedMarkets = await marketsResponse.json()
        setMarkets(updatedMarkets)
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve market",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processPayouts = async () => {
    if (resolvedWinners.length === 0) {
      toast({
        title: "No Winners",
        description: "There are no winners to pay out",
        variant: "destructive",
      })
      return
    }

    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to process payouts",
        variant: "destructive",
      })
      return
    }

    setPayoutInProgress(true)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const adminAddress = await signer.getAddress()

      toast({
        title: "Processing Payouts",
        description: `Sending payouts to ${resolvedWinners.length} winners...`,
      })

      let successCount = 0
      let failCount = 0

      for (const winner of resolvedWinners) {
        try {
          const tx = await signer.sendTransaction({
            to: winner.wallet,
            value: ethers.parseEther(winner.totalPayout.toString()),
          })

          console.log(`[v0] Payout sent to ${winner.wallet}: ${tx.hash}`)
          await tx.wait()
          successCount++
        } catch (error) {
          console.error(`[v0] Failed to send payout to ${winner.wallet}:`, error)
          failCount++
        }
      }

      toast({
        title: "Payouts Complete",
        description: `Successfully paid ${successCount} winners. ${failCount > 0 ? `${failCount} failed.` : ""}`,
      })

      setShowWinners(false)
      setResolvedWinners([])
      setSelectedMarket("")
    } catch (error: any) {
      console.error("[v0] Payout error:", error)
      toast({
        title: "Payout Failed",
        description: error.message || "Failed to process payouts",
        variant: "destructive",
      })
    } finally {
      setPayoutInProgress(false)
    }
  }

  return (
    <div className="space-y-6">
      {showWinners && resolvedWinners.length > 0 && (
        <Card className="p-6 bg-green-500/10 border-green-500">
          <h2 className="text-2xl font-bold mb-4 text-green-500">Market Resolved - Winners List</h2>
          <div className="space-y-3 mb-6">
            {resolvedWinners.map((winner, index) => (
              <div key={index} className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-muted-foreground">
                      {winner.wallet.slice(0, 6)}...{winner.wallet.slice(-4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bet: {winner.betAmount.toFixed(4)} ETH • Winnings: {winner.winnings.toFixed(4)} ETH
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-500">{winner.totalPayout.toFixed(4)} ETH</p>
                    <p className="text-xs text-muted-foreground">Total Payout</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              onClick={processPayouts}
              disabled={payoutInProgress}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {payoutInProgress ? "Processing Payouts..." : `Send Payouts to ${resolvedWinners.length} Winners`}
            </Button>

            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold mb-2">
                Important: Manual Payout Option
              </p>
              <p className="text-xs text-muted-foreground">
                Alternatively, winners can claim their winnings themselves by connecting their wallet and visiting the{" "}
                <strong>/winnings</strong> page. They will see all their claimable rewards there.
              </p>
            </div>

            <Button
              onClick={() => {
                setShowWinners(false)
                setResolvedWinners([])
              }}
              variant="outline"
              className="w-full"
            >
              Close Winners List
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-card border-border">
        <h2 className="text-2xl font-bold mb-4">Available Markets</h2>
        <div className="space-y-3">
          {markets.map((market) => (
            <div
              key={market.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedMarket === String(market.id)
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              } ${market.resolved ? "opacity-50" : ""}`}
              onClick={() => !market.resolved && setSelectedMarket(String(market.id))}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-primary">ID: {market.id}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary">{market.category}</span>
                    {market.resolved && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                        Resolved: {market.winner?.toUpperCase()} Won
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{market.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="adminKey">Admin Key</Label>
            <Input
              id="adminKey"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="marketId">Market ID</Label>
            <Input
              id="marketId"
              type="number"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              placeholder="Click a market above or enter ID (1-6)"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedMarket
                ? `Selected: ${markets.find((m) => m.id === Number(selectedMarket))?.question || "Unknown market"}`
                : "Select a market from the list above"}
            </p>
          </div>

          <div>
            <Label>Winner</Label>
            <div className="flex gap-4 mt-2">
              <Button
                variant={winner === "yes" ? "default" : "outline"}
                onClick={() => setWinner("yes")}
                className="flex-1"
              >
                Yes Won
              </Button>
              <Button
                variant={winner === "no" ? "default" : "outline"}
                onClick={() => setWinner("no")}
                className="flex-1"
              >
                No Won
              </Button>
            </div>
          </div>

          <Button onClick={resolveMarket} disabled={loading} className="w-full mt-6">
            {loading ? "Resolving..." : "Resolve Market"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
