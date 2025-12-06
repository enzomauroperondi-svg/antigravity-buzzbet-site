"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/lib/web3-context"
import { Loader2 } from "lucide-react"
import { ethers } from "ethers"

interface ClosePositionModalProps {
  isOpen: boolean
  onClose: () => void
  position: {
    marketId: number
    side: "yes" | "no"
    shares: number
    avgPrice: number
    market: {
      question: string
    }
  }
  onPositionClosed?: () => void
}

export function ClosePositionModal({ isOpen, onClose, position, onPositionClosed }: ClosePositionModalProps) {
  const { account } = useWeb3()
  const [sharesToClose, setSharesToClose] = useState(position.shares.toString())
  const [limitPrice, setLimitPrice] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = async () => {
    if (!account || !limitPrice || !sharesToClose) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const shares = Number.parseFloat(sharesToClose)
    const price = Number.parseFloat(limitPrice)

    if (shares <= 0 || shares > position.shares) {
      alert(`Por favor, insira ações entre 1 e ${position.shares}`)
      return
    }

    if (price <= 0 || price >= 100) {
      alert("O preço deve estar entre 0 e 100 centavos")
      return
    }

    setIsClosing(true)
    try {
      // Closing position: if holding YES, place Buy NO order
      // If holding NO, place Buy YES order
      const oppositeSide = position.side === "yes" ? "no" : "yes"
      const oppositePrice = 100 - price

      const cost = (oppositePrice / 100) * shares

      const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0xA8a04eEB9509013667EB8Ca7739cAB3640A593ED"
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const tx = await signer.sendTransaction({
        to: ESCROW_ADDRESS,
        value: ethers.parseEther(cost.toString()),
        gasLimit: 100000,
      })

      await tx.wait()

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketId: position.marketId,
          walletAddress: account,
          side: oppositeSide,
          limitPrice: oppositePrice,
          shares,
          txHash: tx.hash,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao fechar posição")
      }

      alert(
        `✅ Ordem de fechamento colocada!\n\nFechando ${shares} ações ${position.side.toUpperCase()}\n\nTransação: ${tx.hash.slice(0, 10)}...`,
      )

      onPositionClosed?.()
      onClose()
    } catch (error: any) {
      console.error("Error closing position:", error)
      alert(`Falha ao fechar posição: ${error.message}`)
    } finally {
      setIsClosing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fechar Posição</DialogTitle>
          <DialogDescription className="text-pretty">{position.market.question}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Posição Atual</span>
              <span className={`font-semibold ${position.side === "yes" ? "text-success" : "text-destructive"}`}>
                {position.shares} {position.side.toUpperCase()} @ {position.avgPrice.toFixed(1)}¢
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Fechar cria uma ordem de compra no lado oposto</p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="shares">Ações para Fechar</Label>
              <Input
                id="shares"
                type="number"
                step="1"
                min="1"
                max={position.shares}
                value={sharesToClose}
                onChange={(e) => setSharesToClose(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Máx: {position.shares} ações</p>
            </div>

            <div>
              <Label htmlFor="price">Preço Limite (centavos)</Label>
              <Input
                id="price"
                type="number"
                step="1"
                min="1"
                max="99"
                placeholder="50"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Seu preço de fechamento (cria ordem de compra {position.side === "yes" ? "NÃO" : "SIM"})
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isClosing}>
              Cancelar
            </Button>
            <Button
              onClick={handleClose}
              className="flex-1 bg-accent hover:bg-accent/90"
              disabled={isClosing || !limitPrice || !sharesToClose || !account}
            >
              {isClosing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Fechar Posição"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
