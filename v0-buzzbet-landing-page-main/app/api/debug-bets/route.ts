import { NextResponse } from "next/server"
import { getAllBets, getMarkets } from "@/lib/markets-store"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const bets = getAllBets()
    const markets = getMarkets()

    return NextResponse.json(
      {
        success: true,
        totalBets: bets.length,
        bets: bets.map((bet) => ({
          id: bet.id,
          marketId: bet.marketId,
          walletAddress: bet.walletAddress.slice(0, 6) + "..." + bet.walletAddress.slice(-4),
          prediction: bet.prediction,
          amount: bet.amount,
          txHash: bet.txHash.slice(0, 10) + "..." + bet.txHash.slice(-8),
          timestamp: new Date(bet.timestamp).toISOString(),
        })),
        markets: markets.map((m) => ({
          id: m.id,
          question: m.question,
          totalYes: m.totalYes,
          totalNo: m.totalNo,
          resolved: m.resolved || false,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching debug data:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
