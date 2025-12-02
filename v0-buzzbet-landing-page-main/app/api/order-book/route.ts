import { NextResponse } from "next/server"
import { getOrderBook } from "@/lib/order-book-store"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const marketId = searchParams.get("marketId")

    if (!marketId) {
      return NextResponse.json({ error: "Market ID required" }, { status: 400 })
    }

    const orderBook = getOrderBook(Number.parseInt(marketId))

    return NextResponse.json(orderBook, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching order book:", error)
    return NextResponse.json({ error: "Failed to fetch order book" }, { status: 500 })
  }
}
