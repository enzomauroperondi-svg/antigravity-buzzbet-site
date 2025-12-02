interface Order {
  id: string
  marketId: number
  walletAddress: string
  side: "yes" | "no"
  limitPrice: number // Price in cents (0-100)
  shares: number
  filled: number
  timestamp: number
  status: "active" | "filled" | "cancelled"
}

interface Position {
  marketId: number
  walletAddress: string
  side: "yes" | "no"
  shares: number
  avgPrice: number
}

const orders: Order[] = []
const positions: Position[] = []

export function createOrder(order: Omit<Order, "id" | "timestamp" | "filled" | "status">): Order {
  const newOrder: Order = {
    ...order,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    filled: 0,
    status: "active",
  }

  orders.push(newOrder)

  // Try to match the order
  matchOrders(newOrder)

  return newOrder
}

function matchOrders(newOrder: Order) {
  // Binary market constraint: priceYes + priceNo = 100
  const oppositePrice = 100 - newOrder.limitPrice

  // Find matching orders on the opposite side
  const matchingOrders = orders
    .filter(
      (o) =>
        o.marketId === newOrder.marketId &&
        o.status === "active" &&
        o.side !== newOrder.side &&
        (newOrder.side === "yes" ? o.limitPrice <= oppositePrice : o.limitPrice >= oppositePrice) &&
        o.filled < o.shares,
    )
    .sort((a, b) => (newOrder.side === "yes" ? a.limitPrice - b.limitPrice : b.limitPrice - a.limitPrice))

  let remainingShares = newOrder.shares - newOrder.filled

  for (const matchingOrder of matchingOrders) {
    if (remainingShares <= 0) break

    const matchingShares = Math.min(remainingShares, matchingOrder.shares - matchingOrder.filled)

    // Execute trade
    matchingOrder.filled += matchingShares
    newOrder.filled += matchingShares
    remainingShares -= matchingShares

    // Update positions
    updatePosition(newOrder.walletAddress, newOrder.marketId, newOrder.side, matchingShares, newOrder.limitPrice)
    updatePosition(
      matchingOrder.walletAddress,
      matchingOrder.marketId,
      matchingOrder.side,
      matchingShares,
      matchingOrder.limitPrice,
    )

    // Mark orders as filled if complete
    if (matchingOrder.filled >= matchingOrder.shares) {
      matchingOrder.status = "filled"
    }
  }

  if (newOrder.filled >= newOrder.shares) {
    newOrder.status = "filled"
  }
}

function updatePosition(walletAddress: string, marketId: number, side: "yes" | "no", shares: number, price: number) {
  const position = positions.find(
    (p) => p.walletAddress === walletAddress && p.marketId === marketId && p.side === side,
  )

  if (!position) {
    positions.push({
      walletAddress,
      marketId,
      side,
      shares,
      avgPrice: price,
    })
  } else {
    // Update average price
    const totalCost = position.avgPrice * position.shares + price * shares
    position.shares += shares
    position.avgPrice = totalCost / position.shares
  }
}

export function getOrderBook(marketId: number) {
  const activeOrders = orders.filter((o) => o.marketId === marketId && o.status === "active")

  // YES bids (people buying YES)
  const yesBids = activeOrders
    .filter((o) => o.side === "yes")
    .map((o) => ({
      price: o.limitPrice,
      shares: o.shares - o.filled,
    }))
    .sort((a, b) => b.price - a.price)

  // NO bids converted to YES asks (people buying NO are selling YES)
  const noBids = activeOrders
    .filter((o) => o.side === "no")
    .map((o) => ({
      price: 100 - o.limitPrice, // Convert NO price to YES price
      shares: o.shares - o.filled,
    }))
    .sort((a, b) => a.price - b.price)

  // Aggregate by price level
  const aggregateBids = aggregateOrders(yesBids)
  const aggregateAsks = aggregateOrders(noBids)

  return {
    bids: aggregateBids,
    asks: aggregateAsks,
    bestBid: aggregateBids[0]?.price || 0,
    bestAsk: aggregateAsks[0]?.price || 100,
    spread: (aggregateAsks[0]?.price || 100) - (aggregateBids[0]?.price || 0),
  }
}

function aggregateOrders(orders: { price: number; shares: number }[]) {
  const priceMap = new Map<number, number>()

  orders.forEach((o) => {
    const current = priceMap.get(o.price) || 0
    priceMap.set(o.price, current + o.shares)
  })

  return Array.from(priceMap.entries())
    .map(([price, shares]) => ({ price, shares }))
    .sort((a, b) => b.price - a.price)
}

export function getUserPositions(walletAddress: string) {
  return positions.filter((p) => p.walletAddress.toLowerCase() === walletAddress.toLowerCase())
}

export function getUserOrders(walletAddress: string) {
  return orders.filter((o) => o.walletAddress.toLowerCase() === walletAddress.toLowerCase())
}

export function cancelOrder(orderId: string, walletAddress: string) {
  const order = orders.find((o) => o.id === orderId && o.walletAddress.toLowerCase() === walletAddress.toLowerCase())
  if (order && order.status === "active") {
    order.status = "cancelled"
    return true
  }
  return false
}

export function closePosition(
  walletAddress: string,
  marketId: number,
  side: "yes" | "no",
  shares: number,
  limitPrice: number,
) {
  // Closing a position means creating an order on the opposite side
  const oppositeSide = side === "yes" ? "no" : "yes"
  const oppositePrice = 100 - limitPrice

  return createOrder({
    marketId,
    walletAddress,
    side: oppositeSide,
    limitPrice: oppositePrice,
    shares,
  })
}
