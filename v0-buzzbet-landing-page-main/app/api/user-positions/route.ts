import { NextResponse } from "next/server"
import { getUserPositions, getUserOrders } from "@/lib/order-book-store"
import { getMarkets } from "@/lib/markets-store"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    const positions = getUserPositions(walletAddress)
    const orders = getUserOrders(walletAddress)
    const markets = getMarkets()

    // Enrich positions with market data
    const enrichedPositions = positions.map((p) => {
      const market = markets.find((m) => m.id === p.marketId)
      return {
        ...p,
        market,
      }
    })

    return NextResponse.json(
      {
        positions: enrichedPositions,
        orders,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching user positions:", error)
    return NextResponse.json({ error: "Failed to fetch user positions" }, { status: 500 })
  }
}
