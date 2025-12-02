import { NextResponse } from "next/server"

const leaderboard = [
  { rank: 1, username: "CelebGuru", predictions: 156, accuracy: 87, earnings: "$2,450" },
  { rank: 2, username: "PopCulturePro", predictions: 142, accuracy: 84, earnings: "$2,180" },
  { rank: 3, username: "GossipKing", predictions: 128, accuracy: 82, earnings: "$1,920" },
  { rank: 4, username: "TrendSpotter", predictions: 115, accuracy: 79, earnings: "$1,650" },
  { rank: 5, username: "StarWatcher", predictions: 98, accuracy: 76, earnings: "$1,380" },
]

export async function GET() {
  return NextResponse.json(leaderboard)
}
