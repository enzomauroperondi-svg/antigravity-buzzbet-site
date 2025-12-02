import { NextResponse } from "next/server"
import { createOrder } from "@/lib/order-book-store"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marketId, walletAddress, side, limitPrice, shares, txHash } = body

    if (!marketId || !walletAddress || !side || !limitPrice || !shares) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = createOrder({
      marketId,
      walletAddress,
      side,
      limitPrice,
      shares,
    })

    return NextResponse.json(
      {
        success: true,
        order,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
