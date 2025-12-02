import { NextResponse } from "next/server"
import { getMarkets, calculateOdds } from "@/lib/markets-store"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const markets = getMarkets()

  console.log("[v0] Markets API called - Current market totals:")
  markets.forEach((market) => {
    console.log(`[v0] Market ${market.id}: Yes=${market.totalYes} ETH, No=${market.totalNo} ETH`)
  })

  const marketsWithOdds = markets.map((market) => {
    const odds = calculateOdds(market.totalYes, market.totalNo)

    console.log(`[v0] Market ${market.id} calculated odds: Yes=${odds.oddsYes}x, No=${odds.oddsNo}x`)

    return {
      ...market,
      oddsYes: odds.oddsYes,
      oddsNo: odds.oddsNo,
    }
  })

  return NextResponse.json(marketsWithOdds, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
