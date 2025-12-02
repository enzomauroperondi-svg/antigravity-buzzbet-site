import { NextResponse } from "next/server"
import { resolveMarket, getMarketWinners } from "@/lib/markets-store"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marketId, winner, adminKey } = body

    // Simple admin authentication (in production, use proper auth)
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== "buzzbet_admin_2025") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    if (!winner || (winner !== "yes" && winner !== "no")) {
      return NextResponse.json({ success: false, message: "Invalid winner value" }, { status: 400 })
    }

    const market = resolveMarket(marketId, winner)
    const winners = getMarketWinners(marketId)

    const totalPool = market.totalYes + market.totalNo
    const winnersList = winners.map((w) => ({
      wallet: w.walletAddress,
      betAmount: w.betAmount,
      winnings: w.winnings,
      totalPayout: w.betAmount + w.winnings, // Original bet + winnings
    }))

    return NextResponse.json(
      {
        success: true,
        message: "Market resolved successfully",
        market,
        winners: winnersList,
        totalWinners: winners.length,
        totalPayouts: winners.reduce((sum, w) => sum + w.winnings, 0),
        totalPool,
        instruction:
          "Winners can now claim their winnings at /winnings page, or you can process automatic payouts from your admin wallet.",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    )
  } catch (error: any) {
    console.error("[v0] Error resolving market:", error)
    return NextResponse.json({ success: false, message: error.message || "Invalid request" }, { status: 400 })
  }
}
