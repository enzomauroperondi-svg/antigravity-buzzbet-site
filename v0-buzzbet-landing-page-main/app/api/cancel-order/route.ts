import { NextResponse } from "next/server"
import { cancelOrder } from "@/lib/order-book-store"

export async function POST(request: Request) {
  try {
    const { orderId, wallet } = await request.json()

    if (!orderId || !wallet) {
      return NextResponse.json({ error: "Order ID and wallet address required" }, { status: 400 })
    }

    const success = cancelOrder(orderId, wallet)

    if (success) {
      return NextResponse.json({ success: true, message: "Order cancelled successfully" })
    } else {
      return NextResponse.json({ error: "Order not found or already cancelled" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error cancelling order:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
