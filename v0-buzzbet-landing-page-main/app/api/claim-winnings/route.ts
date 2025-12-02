import { NextResponse } from "next/server"
import { getUserBets, calculateWinnings, getMarkets, markBetAsPaid } from "@/lib/markets-store"

export const dynamic = "force-dynamic"

// Endpoint for users to check their winnings and claim them
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { walletAddress } = body

    if (!walletAddress) {
      return NextResponse.json({ success: false, message: "Wallet address required" }, { status: 400 })
    }

    const userBets = getUserBets(walletAddress)
    const markets = getMarkets()

    // Calculate winnings for all resolved markets
    const claimableWinnings = userBets
      .map((bet) => {
        const market = markets.find((m) => m.id === bet.marketId)
        if (!market?.resolved || bet.paidOut) {
          return null
        }

        const winnings = calculateWinnings(bet)
        if (winnings > 0) {
          return {
            betId: bet.id,
            marketId: bet.marketId,
            marketQuestion: market.question,
            betAmount: bet.amount,
            winnings,
            prediction: bet.prediction,
          }
        }
        return null
      })
      .filter((w) => w !== null)

    const totalClaimable = claimableWinnings.reduce((sum, w) => sum + (w?.winnings || 0), 0)

    return NextResponse.json(
      {
        success: true,
        claimableWinnings,
        totalClaimable,
        totalBets: userBets.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error fetching winnings:", error)
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
  }
}

// Mark winnings as paid after successful blockchain transaction
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { betId, txHash } = body

    if (!betId || !txHash) {
      return NextResponse.json({ success: false, message: "Bet ID and transaction hash required" }, { status: 400 })
    }

    const bet = markBetAsPaid(betId)

    return NextResponse.json(
      {
        success: true,
        message: "Winnings marked as paid",
        bet,
        txHash,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error marking as paid:", error)
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
  }
}
