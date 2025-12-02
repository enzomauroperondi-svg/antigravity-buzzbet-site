"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/lib/web3-context"
import { Loader2 } from "lucide-react"
import { ethers } from "ethers"

interface BettingModalProps {
  isOpen: boolean
  onClose: () => void
  market: {
    id: number
    question: string
    oddsYes: number
    oddsNo: number
  }
  prediction: "yes" | "no"
  onBetPlaced?: () => void
}

export function BettingModal({ isOpen, onClose, market, prediction, onBetPlaced }: BettingModalProps) {
  const { balance, account } = useWeb3()
  const [amount, setAmount] = useState("")
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  const odds = prediction === "yes" ? market.oddsYes : market.oddsNo
  const potentialReturn = amount ? (Number.parseFloat(amount) * odds).toFixed(4) : "0"
  const potentialProfit = amount ? (Number.parseFloat(amount) * odds - Number.parseFloat(amount)).toFixed(4) : "0"

  const handlePlaceBet = async () => {
    if (!account) {
      alert("Please connect your wallet first!")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (balance && Number.parseFloat(amount) > Number.parseFloat(balance)) {
      alert("Insufficient balance")
      return
    }

    setIsPlacingBet(true)
    try {
      console.log("[v0] Starting bet placement:", { marketId: market.id, prediction, amount, account })

      console.log("[v0] Calling /api/place-bet to pre-register...")
      const preRegisterResponse = await fetch("/api/place-bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketId: market.id,
          prediction,
          amount: Number.parseFloat(amount),
          txHash: "pending",
          walletAddress: account,
        }),
      })

      console.log("[v0] Pre-register response status:", preRegisterResponse.status)

      if (!preRegisterResponse.ok) {
        const errorText = await preRegisterResponse.text()
        console.error("[v0] Pre-register failed:", errorText)
        alert(`Failed to register bet: ${errorText}`)
        setIsPlacingBet(false)
        return
      }

      const preRegisterResult = await preRegisterResponse.json()
      console.log("[v0] Pre-register result:", preRegisterResult)

      if (!preRegisterResult.success) {
        alert(`Failed to register bet: ${preRegisterResult.message}`)
        setIsPlacingBet(false)
        return
      }

      const betId = preRegisterResult.betId
      console.log("[v0] Bet pre-registered with ID:", betId)

      const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0xA8a04eEB9509013667EB8Ca7739cAB3640A593ED"

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      console.log("[v0] Sending transaction to blockchain...")
      console.log("[v0] Escrow address:", ESCROW_ADDRESS)
      console.log("[v0] Amount:", amount, "ETH")

      const tx = await signer.sendTransaction({
        to: ESCROW_ADDRESS,
        value: ethers.parseEther(amount),
        gasLimit: 100000,
      })

      console.log("[v0] Transaction sent:", tx.hash)

      console.log("[v0] Calling /api/update-bet-tx to update transaction hash...")
      const updateResponse = await fetch("/api/update-bet-tx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betId,
          txHash: tx.hash,
        }),
      })

      console.log("[v0] Update response status:", updateResponse.status)

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        console.error("[v0] Update bet tx failed:", errorText)
        alert(`Warning: Blockchain transaction succeeded but bet record update failed: ${errorText}`)
      }

      const updateResult = await updateResponse.json()
      console.log("[v0] Update result:", updateResult)

      console.log("[v0] Waiting for transaction confirmation...")
      await tx.wait()
      console.log("[v0] Transaction confirmed!")

      if (updateResult.success) {
        alert(
          `✅ Bet placed successfully!\n\n${amount} ETH on ${prediction.toUpperCase()}\n\nTransaction: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}\n\nNew odds:\nYes: ${updateResult.newOdds.oddsYes.toFixed(2)}x\nNo: ${updateResult.newOdds.oddsNo.toFixed(2)}x`,
        )
        onBetPlaced?.()
        onClose()
        setAmount("")
      } else {
        alert(
          `⚠️ Transaction confirmed but bet record failed to update.\nTransaction: ${tx.hash}\nPlease contact support.`,
        )
      }
    } catch (error: any) {
      console.error("[v0] Error placing bet:", error)
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        alert("Transaction rejected by user")
      } else {
        alert(`Failed to place bet: ${error.message || "Unknown error"}\n\nCheck console for details.`)
      }
    } finally {
      setIsPlacingBet(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place Your Bet</DialogTitle>
          <DialogDescription className="text-pretty">{market.question}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Prediction</p>
              <p className="text-2xl font-bold capitalize">{prediction}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Odds</p>
              <p className="text-2xl font-bold text-accent">{odds}x</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Bet Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Available balance: {balance ? `${Number.parseFloat(balance).toFixed(4)} ETH` : "Connect wallet"}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bet Amount</span>
              <span className="font-medium">{amount || "0"} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Odds</span>
              <span className="font-medium">{odds}x</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential Return</span>
              <span className="font-medium">{potentialReturn} ETH</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Potential Profit</span>
              <span className="font-bold text-accent">+{potentialProfit} ETH</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isPlacingBet}>
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              className="flex-1 bg-accent hover:bg-accent/90"
              disabled={isPlacingBet || !amount || Number.parseFloat(amount) <= 0 || !account}
            >
              {isPlacingBet ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Bet"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
