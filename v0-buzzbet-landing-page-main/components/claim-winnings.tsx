"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3-context"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Coins } from "lucide-react"

interface ClaimableWinning {
  betId: string
  marketId: number
  marketQuestion: string
  betAmount: number
  winnings: number
  prediction: string
}

export function ClaimWinnings() {
  const { account, signer } = useWeb3()
  const [winnings, setWinnings] = useState<ClaimableWinning[]>([])
  const [totalClaimable, setTotalClaimable] = useState(0)
  const [loading, setLoading] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const { toast } = useToast()

  const fetchWinnings = async () => {
    if (!account) return

    setLoading(true)
    try {
      const response = await fetch("/api/claim-winnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account }),
      })

      const data = await response.json()
      if (data.success) {
        setWinnings(data.claimableWinnings)
        setTotalClaimable(data.totalClaimable)
      }
    } catch (error) {
      console.error("Error fetching winnings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account) {
      fetchWinnings()
    }
  }, [account])

  const claimWinnings = async () => {
    if (!signer || winnings.length === 0) return

    setClaiming(true)
    try {
      // In production, you'd send from your contract/treasury to the user
      // For now, we'll simulate the transaction
      const tx = await signer.sendTransaction({
        to: account,
        value: 0, // In production: totalClaimable in Wei
      })

      toast({
        title: "Processando...",
        description: "Reivindicando seus ganhos",
      })

      await tx.wait()

      // Mark all bets as paid
      for (const winning of winnings) {
        await fetch("/api/claim-winnings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            betId: winning.betId,
            txHash: tx.hash,
          }),
        })
      }

      toast({
        title: "Sucesso!",
        description: `Reivindicou ${totalClaimable.toFixed(4)} ETH em ganhos`,
      })

      // Refresh winnings
      fetchWinnings()
    } catch (error) {
      console.error("Error claiming winnings:", error)
      toast({
        title: "Erro",
        description: "Falha ao reivindicar ganhos",
        variant: "destructive",
      })
    } finally {
      setClaiming(false)
    }
  }

  if (!account) {
    return (
      <Card className="p-6 bg-card border-border text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Conecte sua carteira para ver os ganhos</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Seus Ganhos</h2>
        <Button onClick={fetchWinnings} variant="outline" size="sm" disabled={loading}>
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </div>

      {winnings.length === 0 ? (
        <div className="text-center py-8">
          <Coins className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum ganho disponível para reivindicar</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {winnings.map((winning) => (
              <div key={winning.betId} className="p-4 rounded-lg bg-background border border-border">
                <p className="font-medium mb-2">{winning.marketQuestion}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Aposta: {winning.betAmount} ETH em {winning.prediction}
                  </span>
                  <span className="text-primary font-semibold">Ganhou: {winning.winnings.toFixed(4)} ETH</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Reivindicável</span>
              <span className="text-2xl font-bold text-primary">{totalClaimable.toFixed(4)} ETH</span>
            </div>
          </div>

          <Button onClick={claimWinnings} disabled={claiming} className="w-full">
            {claiming ? "Reivindicando..." : `Reivindicar ${totalClaimable.toFixed(4)} ETH`}
          </Button>
        </>
      )}
    </Card>
  )
}
