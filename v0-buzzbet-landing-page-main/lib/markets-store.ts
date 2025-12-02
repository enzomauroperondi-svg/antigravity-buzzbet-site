interface Bet {
  id: string
  marketId: number
  walletAddress: string
  prediction: "yes" | "no"
  amount: number
  txHash: string
  timestamp: number
  paidOut?: boolean
}

interface Market {
  id: number
  question: string
  image: string
  totalYes: number
  totalNo: number
  volume: string
  traders: number
  endsIn: string
  category: string
  resolved?: boolean
  winner?: "yes" | "no"
  resolvedAt?: number
}

export const bets: Bet[] = []

export const markets: Market[] = [
  {
    id: 8,
    question: "Will Daniel Vorcaro be out of jail before Christmas?",
    image: "/images/daniel-vorcaro.png",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$0",
    traders: 0,
    endsIn: "334 days",
    category: "Justice",
  },
  {
    id: 7,
    question: "Will Vini Jr cheat on Virginia again before the end of 2025?",
    image: "/images/vini-virginia.png",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$0",
    traders: 0,
    endsIn: "365 days",
    category: "Gossip",
  },
  {
    id: 9,
    question: "Is Malu Borges' baby a boy?",
    image: "/images/malu-borges.png",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$0",
    traders: 0,
    endsIn: "180 days",
    category: "Gossip",
  },
  {
    id: 1,
    question: "Will Taylor Swift announce a new album in 2025?",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$12.5K",
    traders: 234,
    endsIn: "5 days",
    category: "Music",
  },
  {
    id: 2,
    question: "Will Kim Kardashian launch a new business venture?",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$8.2K",
    traders: 189,
    endsIn: "12 days",
    category: "Business",
  },
  {
    id: 3,
    question: "Will Dwayne Johnson star in a Marvel movie?",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$15.8K",
    traders: 312,
    endsIn: "8 days",
    category: "Movies",
  },
  {
    id: 4,
    question: "Will Beyoncé perform at the Super Bowl halftime?",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$22.1K",
    traders: 456,
    endsIn: "3 days",
    category: "Music",
  },
  {
    id: 5,
    question: "Will Elon Musk make a major announcement?",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$31.4K",
    traders: 589,
    endsIn: "2 days",
    category: "Tech",
  },
  {
    id: 6,
    question: "Will Rihanna release new music this year?",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
    totalYes: 5.0,
    totalNo: 5.0,
    volume: "$9.7K",
    traders: 201,
    endsIn: "15 days",
    category: "Music",
  },
]

export function getMarkets() {
  return markets
}

export function updateMarket(marketId: number, totalYes: number, totalNo: number) {
  const market = markets.find((m) => m.id === marketId)
  if (market) {
    market.totalYes = totalYes
    market.totalNo = totalNo
  }
  return market
}

export function recordBet(bet: Omit<Bet, "id" | "timestamp">) {
  const newBet: Bet = {
    ...bet,
    id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  }
  bets.push(newBet)
  return newBet
}

export function getMarketBets(marketId: number) {
  return bets.filter((bet) => bet.marketId === marketId)
}

export function getUserBets(walletAddress: string) {
  return bets.filter((bet) => bet.walletAddress.toLowerCase() === walletAddress.toLowerCase())
}

export function resolveMarket(marketId: number, winner: "yes" | "no") {
  const market = markets.find((m) => m.id === marketId)
  if (!market) {
    throw new Error("Market not found")
  }
  if (market.resolved) {
    throw new Error("Market already resolved")
  }

  market.resolved = true
  market.winner = winner
  market.resolvedAt = Date.now()

  return market
}

export function calculateWinnings(bet: Bet): number {
  const market = markets.find((m) => m.id === bet.marketId)
  if (!market || !market.resolved) {
    return 0
  }

  // If user's prediction doesn't match winner, they lost
  if (bet.prediction !== market.winner) {
    return 0
  }

  // Calculate odds at the time of payout (current state)
  const totalPool = market.totalYes + market.totalNo
  const winningPool = market.winner === "yes" ? market.totalYes : market.totalNo

  // Winner gets their share of the total pool proportional to their contribution
  const userShare = bet.amount / winningPool
  const winnings = userShare * totalPool

  return winnings
}

export function getMarketWinners(marketId: number) {
  const market = markets.find((m) => m.id === marketId)
  if (!market || !market.resolved) {
    return []
  }

  const marketBets = getMarketBets(marketId)
  const winningBets = marketBets.filter((bet) => bet.prediction === market.winner)

  return winningBets.map((bet) => ({
    ...bet,
    winnings: calculateWinnings(bet),
  }))
}

export function markBetAsPaid(betId: string) {
  const bet = bets.find((b) => b.id === betId)
  if (bet) {
    bet.paidOut = true
  }
  return bet
}

export function updateBetTransaction(betId: string, txHash: string) {
  const bet = bets.find((b) => b.id === betId)
  if (bet) {
    bet.txHash = txHash
  }
  return bet
}

export function getAllBets() {
  return bets
}

export function calculateOdds(totalYes: number, totalNo: number, k = 1) {
  const totalPool = totalYes + totalNo
  if (totalPool === 0) {
    return { oddsYes: 2.0, oddsNo: 2.0 }
  }

  const oddsYes = totalPool / (totalYes + k)
  const oddsNo = totalPool / (totalNo + k)

  return {
    oddsYes: Math.round(oddsYes * 100) / 100,
    oddsNo: Math.round(oddsNo * 100) / 100,
  }
}
