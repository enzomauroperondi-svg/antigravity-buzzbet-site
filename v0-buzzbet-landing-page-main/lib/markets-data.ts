// Shared markets data
export const markets = [
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
