import { NextResponse } from "next/server"
import { updateBetTransaction, getMarkets, calculateOdds } from "@/lib/markets-store"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { betId, txHash } = body

    console.log("[v0] Update bet transaction called:", { betId, txHash })

    if (!betId || !txHash) {
      console.log("[v0] Missing betId or txHash")
      return NextResponse.json({ success: false, message: "Bet ID and transaction hash required" }, { status: 400 })
    }

    const updatedBet = updateBetTransaction(betId, txHash)

    if (!updatedBet) {
      console.log("[v0] Bet not found:", betId)
      return NextResponse.json({ success: false, message: "Bet not found" }, { status: 404 })
    }

    console.log("[v0] Bet updated successfully:", updatedBet)

    const markets = getMarkets()
    const market = markets.find((m) => m.id === updatedBet.marketId)

    if (!market) {
      console.log("[v0] Market not found:", updatedBet.marketId)
      return NextResponse.json({ success: false, message: "Market not found" }, { status: 404 })
    }

    const odds = calculateOdds(market.totalYes, market.totalNo)

    console.log("[v0] Returning updated odds:", odds)

    return NextResponse.json(
      {
        success: true,
        message: "Bet transaction updated successfully",
        betId: updatedBet.id,
        txHash: updatedBet.txHash,
        newOdds: odds,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error updating bet transaction:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
