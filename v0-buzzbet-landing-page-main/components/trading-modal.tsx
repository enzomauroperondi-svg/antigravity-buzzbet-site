"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/lib/web3-context"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { ethers } from "ethers"

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  market: {
    id: number
    question: string
  }
  onOrderPlaced?: () => void
}

export function TradingModal({ isOpen, onClose, market, onOrderPlaced }: TradingModalProps) {
  const { balance, account } = useWeb3()
  const [limitPrice, setLimitPrice] = useState("")
  const [shares, setShares] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderBook, setOrderBook] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("yes")

  useEffect(() => {
    if (isOpen) {
      fetchOrderBook()
      const interval = setInterval(fetchOrderBook, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, market.id])

  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`/api/order-book?marketId=${market.id}`)
      const data = await response.json()
      setOrderBook(data)
    } catch (error) {
      console.error("Error fetching order book:", error)
    }
  }

  const handlePlaceOrder = async (side: "yes" | "no") => {
    if (!account) {
      alert("Por favor, conecte sua carteira primeiro!")
      return
    }

    if (!limitPrice || !shares) {
      alert("Por favor, insira preço limite e ações")
      return
    }

    const priceNum = Number.parseFloat(limitPrice)
    const sharesNum = Number.parseFloat(shares)

    if (priceNum <= 0 || priceNum >= 100) {
      alert("O preço deve estar entre 0 e 100 centavos")
      return
    }

    if (sharesNum <= 0) {
      alert("Ações devem ser maiores que 0")
      return
    }

    // Cost in USD: (price in cents / 100) * shares
    const costUSD = (priceNum / 100) * sharesNum

    // Convert USD to ETH using a simple approximation (1 USD = 0.0003 ETH at ~$3300/ETH)
    // In production, you'd fetch the real ETH/USD price from an oracle
    const ETH_USD_RATE = 3300 // Approximate ETH price in USD
    const costETH = Number((costUSD / ETH_USD_RATE).toFixed(8)) // Round to 8 decimal places

    console.log("[v0] Order cost calculation:", {
      costUSD: `$${costUSD.toFixed(2)}`,
      costETH: `${costETH.toFixed(8)} ETH`,
      userBalance: `${balance} ETH`,
    })

    if (balance && costETH > Number.parseFloat(balance)) {
      alert(`Saldo insuficiente. Precisa de ${costETH.toFixed(8)} ETH mas você tem ${balance} ETH`)
      return
    }

    setIsPlacingOrder(true)
    try {
      const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0xA8a04eEB9509013667EB8Ca7739cAB3640A593ED"

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const tx = await signer.sendTransaction({
        to: ESCROW_ADDRESS,
        value: ethers.parseEther(costETH.toString()),
        gasLimit: 100000,
      })

      await tx.wait()

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketId: market.id,
          walletAddress: account,
          side,
          limitPrice: priceNum,
          shares: sharesNum,
          txHash: tx.hash,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar ordem")
      }

      const result = await response.json()

      alert(
        `✅ Ordem colocada com sucesso!\n\nCompra ${side.toUpperCase()} @ ${priceNum}¢\n${sharesNum} ações\n\nTransação: ${tx.hash.slice(0, 10)}...`,
      )

      onOrderPlaced?.()
      fetchOrderBook()
      setLimitPrice("")
      setShares("")
    } catch (error: any) {
      console.error("Error placing order:", error)
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        alert("Transação rejeitada pelo usuário")
      } else {
        alert(`Falha ao colocar ordem: ${error.message}`)
      }
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const bestAskYes = orderBook?.bestAsk || 100
  const bestAskNo = orderBook ? 100 - orderBook.bestBid : 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Negociar Mercado</DialogTitle>
          <DialogDescription className="text-pretty">{market.question}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yes" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
              Comprar SIM
            </TabsTrigger>
            <TabsTrigger
              value="no"
              className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
            >
              Comprar NÃO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yes" className="space-y-4">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Melhor Oferta (SIM)</span>
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xl font-bold">{bestAskYes}¢</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Melhor preço atual para comprar ações SIM</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="yes-price">Preço Limite (centavos)</Label>
                <Input
                  id="yes-price"
                  type="number"
                  step="1"
                  min="1"
                  max="99"
                  placeholder="60"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Defina seu preço de compra (1-99¢)</p>
              </div>

              <div>
                <Label htmlFor="yes-shares">Ações</Label>
                <Input
                  id="yes-shares"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="100"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Número de ações para comprar</p>
              </div>

              {limitPrice && shares && (
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo</span>
                    <span className="font-medium">
                      ${((Number.parseFloat(limitPrice) / 100) * Number.parseFloat(shares)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Retorno Máx (se SIM vencer)</span>
                    <span className="font-medium text-success">
                      ${(((100 - Number.parseFloat(limitPrice)) / 100) * Number.parseFloat(shares)).toFixed(2)} lucro
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => handlePlaceOrder("yes")}
              className="w-full bg-success hover:bg-success/90"
              disabled={isPlacingOrder || !limitPrice || !shares || !account}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Colocar Ordem de Compra (SIM)"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="no" className="space-y-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Melhor Oferta (NÃO)</span>
                <div className="flex items-center gap-1 text-destructive">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xl font-bold">{bestAskNo}¢</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Melhor preço atual para comprar ações NÃO</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="no-price">Preço Limite (centavos)</Label>
                <Input
                  id="no-price"
                  type="number"
                  step="1"
                  min="1"
                  max="99"
                  placeholder="40"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Defina seu preço de compra (1-99¢)</p>
              </div>

              <div>
                <Label htmlFor="no-shares">Ações</Label>
                <Input
                  id="no-shares"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="100"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Número de ações para comprar</p>
              </div>

              {limitPrice && shares && (
                <div className="rounded-lg bg-muted p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo</span>
                    <span className="font-medium">
                      ${((Number.parseFloat(limitPrice) / 100) * Number.parseFloat(shares)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Retorno Máx (se NÃO vencer)</span>
                    <span className="font-medium text-destructive">
                      ${(((100 - Number.parseFloat(limitPrice)) / 100) * Number.parseFloat(shares)).toFixed(2)} lucro
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => handlePlaceOrder("no")}
              className="w-full bg-destructive hover:bg-destructive/90"
              disabled={isPlacingOrder || !limitPrice || !shares || !account}
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Colocar Ordem de Compra (NÃO)"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {orderBook && (
          <div className="mt-4 border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3">Livro de Ofertas</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Compradores NÃO (Liquidez para SIM)</p>
                <div className="space-y-1">
                  {orderBook.asks?.slice(0, 3).map((ask: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs bg-destructive/10 p-1 rounded">
                      <span className="text-destructive">{ask.price}¢</span>
                      <span>{ask.shares} ações</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-y text-xs">
                <span className="text-muted-foreground">Spread</span>
                <span className="font-bold">{orderBook.spread}¢</span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Compradores SIM</p>
                <div className="space-y-1">
                  {orderBook.bids?.slice(0, 3).map((bid: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs bg-success/10 p-1 rounded">
                      <span className="text-success">{bid.price}¢</span>
                      <span>{bid.shares} ações</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
