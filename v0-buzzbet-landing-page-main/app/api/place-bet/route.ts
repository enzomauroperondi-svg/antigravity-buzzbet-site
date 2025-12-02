import { NextResponse } from "next/server"
import { getMarkets, updateMarket, calculateOdds, recordBet } from "@/lib/markets-store"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marketId, prediction, amount, txHash, walletAddress } = body

    console.log("[v0] Bet placement started:", { marketId, prediction, amount, walletAddress })

    if (!walletAddress) {
      return NextResponse.json({ success: false, message: "Wallet address required" }, { status: 400 })
    }

    const markets = getMarkets()
    const market = markets.find((m) => m.id === marketId)

    if (!market) {
      return NextResponse.json({ success: false, message: "Market not found" }, { status: 404 })
    }

    if (market.resolved) {
      return NextResponse.json({ success: false, message: "Market is already resolved" }, { status: 400 })
    }

    console.log("[v0] Before bet - Market totals:", {
      totalYes: market.totalYes,
      totalNo: market.totalNo,
    })

    const newTotalYes = prediction === "yes" ? market.totalYes + Number.parseFloat(amount) : market.totalYes
    const newTotalNo = prediction === "no" ? market.totalNo + Number.parseFloat(amount) : market.totalNo

    console.log("[v0] After bet - New totals:", {
      totalYes: newTotalYes,
      totalNo: newTotalNo,
      betAmount: Number.parseFloat(amount),
    })

    updateMarket(marketId, newTotalYes, newTotalNo)

    const bet = recordBet({
      marketId,
      walletAddress,
      prediction,
      amount: Number.parseFloat(amount),
      txHash,
    })

    const odds = calculateOdds(newTotalYes, newTotalNo)

    console.log("[v0] Calculated odds:", odds)

    return NextResponse.json(
      {
        success: true,
        message: "Bet placed successfully",
        betId: bet.id,
        data: body,
        newOdds: odds,
        market: {
          id: market.id,
          totalYes: newTotalYes,
          totalNo: newTotalNo,
          oddsYes: odds.oddsYes,
          oddsNo: odds.oddsNo,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error placing bet:", error)
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
  }
}
