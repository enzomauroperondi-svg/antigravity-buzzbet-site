import { type NextRequest, NextResponse } from "next/server"
import { getUserOrders } from "@/lib/order-book-store"
import { markets } from "@/lib/markets-store"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  try {
    const userOrders = getUserOrders(wallet)

    // Enrich orders with market titles
    const enrichedOrders = userOrders.map((order) => {
      const market = markets.find((m) => m.id === order.marketId)
      return {
        ...order,
        marketTitle: market?.question || "Unknown Market",
      }
    })

    return NextResponse.json({ orders: enrichedOrders })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
