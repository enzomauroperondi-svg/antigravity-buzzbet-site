"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/lib/web3-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Clock, CheckCircle } from "lucide-react"
import { ClosePositionModal } from "@/components/close-position-modal"
import Link from "next/link"

interface Position {
  marketId: number
  marketTitle: string
  side: "yes" | "no"
  shares: number
  avgPrice: number
  currentPrice: number
}

interface Order {
  id: string
  marketId: number
  marketTitle: string
  side: "yes" | "no"
  limitPrice: number
  shares: number
  filled: number
  status: string
}

interface SettledPosition {
  marketTitle: string
  side: "yes" | "no"
  shares: number
  finalPayout: number
  realizedPL: number
}

export function PortfolioPageContent() {
  const { account } = useWeb3()
  const [positions, setPositions] = useState<Position[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [settledPositions] = useState<SettledPosition[]>([])
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [activeTab, setActiveTab] = useState<"positions" | "orders" | "history">("positions")

  // Mock financial data
  const availableCash = 550.0
  const totalPositionsValue = positions.reduce((sum, p) => sum + (p.currentPrice / 100) * p.shares, 0)
  const totalEquity = availableCash + totalPositionsValue
  const totalPL = 25.0
  const todayPL = 5.0

  useEffect(() => {
    if (account) {
      fetchUserData()
      const interval = setInterval(fetchUserData, 5000)
      return () => clearInterval(interval)
    }
  }, [account])

  const fetchUserData = async () => {
    if (!account) return

    try {
      const [positionsRes, ordersRes] = await Promise.all([
        fetch(`/api/user-positions?wallet=${account}`),
        fetch(`/api/user-orders?wallet=${account}`),
      ])

      if (positionsRes.ok) {
        const data = await positionsRes.json()
        setPositions(data.positions || [])
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch("/api/cancel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, wallet: account }),
      })

      if (response.ok) {
        fetchUserData()
      }
    } catch (error) {
      console.error("Failed to cancel order:", error)
    }
  }

  const calculateUnrealizedPL = (position: Position) => {
    const costBasis = (position.avgPrice / 100) * position.shares
    const currentValue = (position.currentPrice / 100) * position.shares
    return currentValue - costBasis
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Conecte Sua Carteira</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">Conecte sua carteira para ver seu portfólio</p>
              <Link href="/">
                <Button className="bg-accent hover:bg-accent/90">
                  <Wallet className="h-4 w-4 mr-2" />
                  Ir para Início
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Portfólio</h1>
          <p className="text-muted-foreground">Usuário Buzzbet #{account.slice(-6)}</p>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Patrimônio Total</span>
                <Wallet className="h-4 w-4 text-accent" />
              </div>
              <div className="text-2xl font-bold">${totalEquity.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Dinheiro Disponível</span>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-bold">${availableCash.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">L&P Total</span>
                {totalPL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className={`text-2xl font-bold ${totalPL >= 0 ? "text-success" : "text-destructive"}`}>
                {totalPL >= 0 ? "+" : ""}${totalPL.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalPL >= 0 ? "+" : ""}
                {((totalPL / totalEquity) * 100).toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">L&P de Hoje</span>
                {todayPL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className={`text-2xl font-bold ${todayPL >= 0 ? "text-success" : "text-destructive"}`}>
                {todayPL >= 0 ? "+" : ""}${todayPL.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "positions"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setActiveTab("positions")}
          >
            Posições Ativas ({positions.length})
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "orders"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setActiveTab("orders")}
          >
            Ordens Pendentes ({orders.filter((o) => o.status === "active").length})
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${activeTab === "history"
              ? "text-accent border-b-2 border-accent"
              : "text-muted-foreground hover:text-foreground"
              }`}
            onClick={() => setActiveTab("history")}
          >
            Histórico Liquidado ({settledPositions.length})
          </button>
        </div>

        {/* Active Positions Table */}
        {activeTab === "positions" && (
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Posições Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhuma posição ativa</p>
                  <p className="text-sm mt-2">Faça sua primeira negociação para começar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mercado</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resultado</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ações Detidas</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Entrada Média</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Preço Atual</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">L&P Não Realizado</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((position, index) => {
                        const unrealizedPL = calculateUnrealizedPL(position)
                        return (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium">{position.marketTitle}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${position.side === "yes"
                                  ? "bg-success/20 text-success"
                                  : "bg-destructive/20 text-destructive"
                                  }`}
                              >
                                {position.side.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-mono">{position.shares}</td>
                            <td className="py-4 px-4 text-right font-mono">${(position.avgPrice / 100).toFixed(2)}</td>
                            <td className="py-4 px-4 text-right font-mono">
                              ${(position.currentPrice / 100).toFixed(2)}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span
                                className={`font-mono font-semibold ${unrealizedPL >= 0 ? "text-success" : "text-destructive"
                                  }`}
                              >
                                {unrealizedPL >= 0 ? "+" : ""}${unrealizedPL.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-destructive/10 border-destructive/50 hover:bg-destructive/20 text-destructive"
                                onClick={() =>
                                  setSelectedPosition({
                                    ...position,
                                    market: { question: position.marketTitle },
                                  } as any)
                                }
                              >
                                Fechar
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pending Orders Table */}
        {activeTab === "orders" && (
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Ordens Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.filter((o) => o.status === "active").length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhuma ordem pendente</p>
                  <p className="text-sm mt-2">Todas as ordens foram preenchidas ou canceladas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mercado</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo de Ordem</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resultado</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Preço</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ações Restantes</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter((o) => o.status === "active")
                        .map((order) => (
                          <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium">{order.marketTitle}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-muted-foreground">Compra / Limite</span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.side === "yes"
                                  ? "bg-success/20 text-success"
                                  : "bg-destructive/20 text-destructive"
                                  }`}
                              >
                                {order.side.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-mono">${(order.limitPrice / 100).toFixed(2)}</td>
                            <td className="py-4 px-4 text-right font-mono">{order.shares - order.filled}</td>
                            <td className="py-4 px-4 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive/50 hover:bg-destructive/20 bg-transparent"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancelar
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Settled History Table */}
        {activeTab === "history" && (
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Histórico Liquidado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {settledPositions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum mercado liquidado ainda</p>
                  <p className="text-sm mt-2">Suas negociações concluídas aparecerão aqui</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mercado</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resultado</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ações Liquidadas</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Pagamento Final</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">L&P Realizado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settledPositions.map((position, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium">{position.marketTitle}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${position.side === "yes"
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                                }`}
                            >
                              {position.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-mono">{position.shares}</td>
                          <td className="py-4 px-4 text-right font-mono">${position.finalPayout.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={`font-mono font-semibold ${position.realizedPL >= 0 ? "text-success" : "text-destructive"
                                }`}
                            >
                              {position.realizedPL >= 0 ? "+" : ""}${position.realizedPL.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {selectedPosition && (
        <ClosePositionModal
          isOpen={!!selectedPosition}
          position={selectedPosition as any}
          onClose={() => setSelectedPosition(null)}
          onPositionClosed={fetchUserData}
        />
      )}
    </div>
  )
}
